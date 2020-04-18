---
title:  "한 세션을 여러번 정책 라우팅하니까 NAT가 안돼요"
date:   2020-04-18 09:15:00 +0900
tags: [blog, policy routing, NAT, iptables, linux, transparenty proxy, perl]
layout: post
comments: yes
author: cwyang
excerpt: 정책 라우팅으로 같은 5-tuple 패킷을 iptables에 여러번 보내는 것입니다. `iptales -L -nv`로 패킷 카운트를 보면 MASQUERADE룰 말고는 다 매치가 되는데 MASQUERADE만 매치가 안되는 이유는 무엇인가요?
toc: true
---
# TL; DR

같은 5-tuple의 패킷을 정책 라우팅으로 iptables를 여러번 태운다면
conntrack이 개입하는 nat테이블의 경우 zone으로 분리를 해줘야해요.

# 문제

호스트 머신에서 투명 프락시 네트워크를 구성하려고 합니다.
실제 클라이언트와 프록시는 컨테이너가 될 것이지만, 실험을 위해서
리눅스 네임스페이스로 구별되는 환경을 구성하였습니다.
클라이언트에서 인터넷으로의 트래픽을 프락시 네임스페이스로 유도하기 위해서
정책 라우팅을 사용하였습니다.

I'm trying to setup transparent proxying networks on my host.
Real Client and Proxy targets are containters but in this experiment I use netns (network namespace) separated envinroment.
To redirect client traffic to proxy transparently, I use policy routing.

```
Client (C)         Proxy (P)
10.10.1.1/24      10.10.2.1/24
    veth0             veth0
     |                 |
  veth pair         veth pair
     |                 |
 -----------(HOST)--------------
client-veth0       proxy-veth0
10.10.1.2/24      10.10.2.2/24
     |                 |            172.16.202.30
     +-----------------+-------------- enp4s0 ---- INTERNET
```

정책 라우팅은 `ip rule`과 `ip route`, 그리고 `iptables`를 사용하여 아래와 같이
설정하였습니다.

```
[Client->Proxy]
ip rule:  from 10.10.1.0/24 iif client-veth0 lookup 100
ip route: (100) default via 10.10.2.1 dev proxy-veth0
[Proxy->Internet]
ip route: (master) default via 172.16.202.1 dev enp4s0 proto static metric 100
iptables: -t nat -A POSTROUTING -s 10.10.10.1/32 -o enp4s0 -j MASQUERADE
[Internet->Proxy]
ip rule:  from all to 10.10.1.0/24 iif enp4s0 lookup 100
ip route: (100) default via 10.10.2.1 dev proxy-veth0
[Proxy->Client]
ip rule:  from all to 10.10.1.0/24 iif proxy-veth0 lookup 101
ip route: (101) default via 10.10.1.1 dev client-veth0
```

문제는 클라이언트에서 인터넷을 접속할 때 NAT가 이루어지지 않는다는 것입니다.
클라이언트에서 8.8.8.8으로 ping을 할 경우 인터넷 구간으로 10.10.1.1 소스 IP가
그대로 출력됩니다.

이 설정의 특이한 점이라면 정책 라우팅으로 같은 5-tuple 패킷을 iptables에
여러번 보내는 것입니다. `iptales -L -nv`로 패킷 카운트를 보면 MASQUERADE
룰 말고는 다 매치가 되는데 MASQUERADE만 매치가 안되는 이유는 무엇인가요?

Problem is, When I ping 8.8.8.8 from Client, within client netns, source ip masquerading does not happen. iptables masquerade rule does not match and defaults to ACCEPT . I expect that tcpdump on enp4s0 shows 172.16.202.30 --> 8.8.8.8, but it shows 10.10.1.1 --> 8.8.8.8, without source IP masquerading. Why doesn't NAT happen?

# 해결

conntrack 때문입니다.

nat테이블은 컨트랙의 NEW 상태 패킷만을 처리합니다.
첫번째 iptables nat테이블 처리시 NEW상태가 되기 때문에
두번째 iptables에 들어왔을때 매치가 되지 않는 것입니다.

[Conntrack zone](https://lwn.net/Articles/370152/)을 이용하여
conntrack의 key를 5-tuple에서 zone을 포함한 6-tuple로 만들어 주어 해결할 수 있습니다.
zone이 다르면 새로운 연결이라고 판단하여 각기 nat테이블 처리를 하게되는 것입니다.

```
iptables -t raw -A PREROUTING -i client-veth0 -j CT --zone 1
iptables -t raw -A PREROUTING -i proxy-veth0 -d 10.10.1.0/24 -j CT --zone 1
```

It's because conntrack gets involved.

Iptables nat table handles the packet with NEW state.
When a packet traverses nat table, conntrack adds a NEW entry.
The packet with same 5-tuple enters nat table again,
it is matched against conntrack database and skipped processing
since the packet is on conntrack database

[Conntrack zone](https://lwn.net/Articles/370152/) can be used to 
make a packet 6-tuple, including zone,  and be processed at nat table multiple times.

# 코드

conntrack zone을 분리한 펄 코드입니다.


``` perl
use strict;

my $debug=1;
my $dryrun=0;
my $ip="ip";
my $iptables="iptables";
my $nic_name="veth0";

sub run_cmd {
    my $cmd = shift;
    print "$cmd\n" if ($debug);
    return if ($dryrun);
    my $result = system("$cmd > /dev/null");
    if ($result != 0) {
	print "  Error: ($result) $cmd \n";
    }
}
sub iptables_add {
    my ($target, $line) = @_;
    run_cmd("$iptables -D $target $line");
    run_cmd("$iptables -A $target $line");
}
sub ip {
    my $ns = shift if (@_ >= 2);
    my ($line) = @_;
    my $cmd = $ns ? "$ip netns exec $ns $ip" : "$ip";
    run_cmd("$cmd $line");
}

sub make_ns {
    my ($target, $nsaddr, $hostaddr) = @_;
    my ($host) = split(/\//, $hostaddr);
    
    ip("netns del $target");
    ip("link del $target-$nic_name");
    # create namespace
    ip("netns add $target");
    # create a veth pair
    ip("link add $target-$nic_name type veth peer name $nic_name");
    ip("link set $nic_name netns $target");
    # address setup
    ip("addr add $hostaddr dev $target-$nic_name");
    ip("link set $target-$nic_name up");
    # address setup on target namespace
    ip($target, "addr add $nsaddr dev $nic_name");
    ip($target, "link set $nic_name up");
    ip($target, "link set lo up");
    ip($target, "route add default via $host dev $nic_name");
}

make_ns("client", "10.10.1.1/24", "10.10.1.2/24");
make_ns("proxy",  "10.10.2.1/24", "10.10.2.2/24");
route_setup("10.10.10.0/24");

sub route_setup {
    my $net_client = "10.10.1.0/24";
    my $net_proxy  = "10.10.2.0/24";
    my $gw_client = "10.10.1.1";
    my $gw_proxy  = "10.10.2.1";
    my $nic_client="client-veth0";
    my $nic_proxy ="proxy-veth0";
    my $nic_internet="enp4s0";

    # debug
    if ($debug) {
		iptables_add("PREROUTING", "-t raw -j TRACE");
		# we need to do following things like to enable netfliter logging
		# sysctl -w net.netfilter.nf_log_all_netns=1
		# sysctl -w "net.netfilter.nf_log.2"=nf_log_ipv4
    }
    # flush
    ip("route flush table 100");
    ip("route flush table 101");
    # OUTBOUND: src --> proxy
    ip("rule del from $net_client iif $nic_client prio 100 table 100");
    ip("rule add from $net_client iif $nic_client prio 100 table 100");
    # INBOUND: internet --> proxy
    ip("rule del to $net_client iif $nic_internet prio 102 table 100");
    ip("rule add to $net_client iif $nic_internet prio 102 table 100");
    # RT: route to proxy
    ip("route add default via $gw_proxy dev $nic_proxy table 100");

    # OUTBOUND: proxy --> internet
    # proxy --> default route w/ masquerade
    iptables_add("POSTROUTING", "-t nat -s $net_client ! -d $net_client -o $nic_internet -j MASQUERADE");

    # INBOUND: proxy --> client
    ip("rule del to $net_client iif $nic_proxy prio 101 table 101");
    ip("rule add to $net_client iif $nic_proxy prio 101 table 101");
    # RT: route to client
    ip("route add default via $gw_client dev $nic_client table 101");

    # conntrack zone split
    # zone 0: default zone, generic host traffic along proxy and Internet
    # zone 1: client <-> proxy traffic

    iptables_add("PREROUTING", "-t raw -i $nic_client -j CT --zone 1");
    iptables_add("PREROUTING", "-t raw -i $nic_proxy -d $net_client -j CT --zone 1");
}
```
