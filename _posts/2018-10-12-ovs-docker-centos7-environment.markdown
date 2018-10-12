---
title:  "OVS, Docker, CentOS7 환경 만들기"
date:   2018-10-12 14:38:00 +0900
tags: [blog, ovs, docker, centos, vagrant]
layout: post
comments: yes
author: cwyang
excerpt: centos7기반의 ovs와 docker가 머신이 당분간 계속 필요할 것 같아서,  vagrant를 이용하여 VM을  빌드해보기로 하였습니다.
header-img: /assets/images/animals.jpg
toc: true
---
# Vagrant

centos7기반의 ovs와 docker가 머신이 당분간 계속 필요할 것 같아서,  vagrant를 이용하여 VM을  빌드해보기로 하였습니다.
vagrant는 가상 머신 설치를 도와주는 프로그램입니다. vagrant가 없었던 시절에는 VM에 직접 인스톨 한 후 VM 이미지를 복사해 두어 재 사용하는 방법을 사용했었습니다.
vagrant에서는 기본 이미지 (box라고 합니다.)를 제공하면서, 그 위에 설치 프로그램 형상을 사용자가 지정할 수 있도록 합니다. 쓰면 매우 편한겁니다.

{% highlight bash linenos %}
$ uname -a
Linux cwyang 4.10.0-42-generic #46~16.04.1-Ubuntu SMP Mon Dec 4 15:57:59 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux
$ sudo apt-get install virtualbox vagrant
{% endhighlight bash linenos %}

# SSL 접속환경 확인

다음 ssl domain들이 인증서 피닝을 요구합니다.

- vagrantcloud.com
- cbs.centos.org
- yum.dockerproject.org
- raw.githubusercontent.com

회사안에서 SSL 복호화 장비가 있는 경우 회사 인증서를 VM에 신뢰할 수 있는 인증서로 심거나, SSL 복호화 장비에서 위의 사이트들에 대하여 복호화를 바이패스 하도록 설정합니다.

# 설치

github에 설치 스크립트를 작업해 둔 분이 있습니다. ([링크](https://github.com/joatmon08/vagrantfiles/tree/master/ovs-vagrant))그 파일들을 이용해서 설치해 보았습니다. 감사합니다.

아래 두 파일을 저장한 후 `vagrant up`  명령어를 실행하면 수 분 안에 centos/7을 다운 받고 dependency package를 설치하고 ovs를 설치하고 docker를 설치해줍니다. 좋은 세상입니다.

- [`Vagrantfile`](https://github.com/joatmon08/vagrantfiles/blob/master/ovs-vagrant/Vagrantfile)
- [`bootstrap.sh`](https://github.com/joatmon08/vagrantfiles/blob/master/ovs-vagrant/bootstrap.sh)

# 설치 확인
{% highlight bash linenos %}
$ vagrant ssh
Last login: Fri Oct 12 01:13:18 2018 from 10.0.2.2
[vagrant@localhost ~]$ 
{% endhighlight %}
호스트의 id_rsa.pub를 VM의 `.ssh/authorized_keys`에 등록하면 직접 ssh도 가능합니다.

{% highlight bash linenos %}
$ ssh vagrant@127.0.0.1 -p 2222
Last login: Fri Oct 12 01:22:25 2018 from 10.0.2.2
[vagrant@localhost ~]$ 
{% endhighlight bash linenos %}

도커와 OvS를 확인합니다.

{% highlight bash linenos %}
[vagrant@localhost ~]$ systemctl status openvswitch docker
● openvswitch.service - Open vSwitch
   Loaded: loaded (/usr/lib/systemd/system/openvswitch.service; enabled; vendor preset: disabled)
   Active: active (exited) since Fri 2018-10-12 01:05:18 UTC; 21min ago
 Main PID: 25616 (code=exited, status=0/SUCCESS)
    Tasks: 0
   Memory: 0B
   CGroup: /system.slice/openvswitch.service

● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Fri 2018-10-12 01:05:37 UTC; 21min ago
     Docs: https://docs.docker.com
 Main PID: 25686 (dockerd)
    Tasks: 16
   Memory: 16.0M
   CGroup: /system.slice/docker.service
           ├─25686 /usr/bin/dockerd
           └─25689 docker-containerd -l unix:///var/run/docker/libcontainerd/docker-containerd.sock --metrics-interval=0 -...
{% endhighlight bash linenos %}

도커 실행을 위해서 `docker`그룹에 `vagrant` 사용자를 등록합니다.

{% highlight bash linenos %}
[vagrant@localhost ~]$ sudo usermod -aG docker vagrant
{% endhighlight bash linenos %}

# Two containers w/ OVS bridge
## 구성
{% highlight bash linenos %}
moby1: eth1 192.168.0.1/24
  | (ovs-br1)
moby2: eth1 192.168.0.2/24
{% endhighlight bash linenos %}
## OVS 브릿지 생성
{% highlight bash linenos %}
root@localhost vagrant]# ovs-vsctl add-br ovs-br1
root@localhost vagrant]# ovs-vsctl show
94185d0-937e-49bf-a0a4-69ca5027718b
   Bridge "ovs-br1"
       Port "ovs-br1"
           Interface "ovs-br1"
               type: internal
   ovs_version: "2.9.0"
{% endhighlight bash linenos %}

## 컨테이너 생성후 ovs-bridge에 연결
{% highlight bash linenos %}
[vagrant@localhost ~]$ docker run -dit --name=moby1 ubuntu
[vagrant@localhost ~]$ docker exec -it moby1 apt-get update
[vagrant@localhost ~]$ docker exec -it moby1 apt-get install iproute2 iputils-ping
[vagrant@localhost ~]$ sudo ovs-docker add-port ovs-br1 eth1 moby1 --ipaddress=192.168.0.1/24

[vagrant@localhost ~]$ docker run -dit --name=moby2 ubuntu
[vagrant@localhost ~]$ docker exec -it moby2 apt-get update
[vagrant@localhost ~]$ docker exec -it moby2 apt-get install iproute2 iputils-ping
[vagrant@localhost ~]$ sudo ovs-docker add-port ovs-br1 eth2 moby1 --ipaddress=192.168.0.2/24

[vagrant@localhost ~]$ docker exec -it moby1 ip address
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
...
21: eth0@if22: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
...
23: eth1@if24: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether b2:bf:61:25:7e:f8 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.0.1/24 scope global eth1
       valid_lft forever preferred_lft forever
{% endhighlight bash linenos %}

## 컨테이너간 연결 확인
{% highlight bash linenos %}
[vagrant@localhost ~]$ sudo ovs-vsctl list-ports ovs-br1
6b9045d2be344_l
90cd4018819e4_l
[vagrant@localhost ~]$ docker exec moby1 ping 192.168.0.2 -c 1
PING 192.168.0.2 (192.168.0.2) 56(84) bytes of data.
64 bytes from 192.168.0.2: icmp_seq=1 ttl=64 time=0.037 ms

--- 192.168.0.2 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.037/0.037/0.037/0.000 ms
[vagrant@localhost ~]$ docker exec moby2 ping 192.168.0.1 -c 1
PING 192.168.0.1 (192.168.0.1) 56(84) bytes of data.
64 bytes from 192.168.0.1: icmp_seq=1 ttl=64 time=0.037 ms

--- 192.168.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.037/0.037/0.037/0.000 ms
{% endhighlight bash linenos %}


# Three-containers w/ OVS bridge
## 구성
{% highlight bash linenos %}
moby1: eth1 192.168.0.1/24
  | (ovs-br1)
moby2: eth1 - (moby2-bridge) - eth2
  | (ovs-br2)
moby3: eth1 192.168.0.2/24
{% endhighlight bash linenos %}
## OVS 브릿지 생성
{% highlight bash linenos %}
vagrant@localhost ~]$ sudo ovs-vsctl add-br ovs-br1
vagrant@localhost ~]$ sudo ovs-vsctl add-br ovs-br2
vagrant@localhost ~]$ sudo ovs-vsctl show
94185d0-937e-49bf-a0a4-69ca5027718b
   Bridge "ovs-br2"
       Port "ovs-br2"
           Interface "ovs-br2"
               type: internal
   Bridge "ovs-br1"
       Port "ovs-br1"
           Interface "ovs-br1"
               type: internal
   ovs_version: "2.9.0"
{% endhighlight bash linenos %}
## 컨테이너 생성후 ovs-bridge에 연결
{% highlight bash linenos %}
[vagrant@localhost ovs_3hosts]$ cat run.sh
sudo ovs-vsctl add-br ovs-br1
sudo ovs-vsctl add-br ovs-br2
sudo ovs-vsctl show

docker run -dit --name=moby1 ubuntu
docker exec moby1 apt-get update
docker exec moby1 apt-get -y install iproute2 iputils-ping
sudo ovs-docker add-port ovs-br1 eth1 moby1 --ipaddress=192.168.0.1/24

docker run -dit --privileged --name=moby2 ubuntu
docker exec moby2 apt-get update
docker exec moby2 apt-get -y install iproute2 iputils-ping
sudo ovs-docker add-port ovs-br1 eth1 moby2
sudo ovs-docker add-port ovs-br2 eth2 moby2

docker run -dit --name=moby3 ubuntu
docker exec moby3 apt-get update
docker exec moby3 apt-get -y install iproute2 iputils-ping
sudo ovs-docker add-port ovs-br2 eth1 moby3 --ipaddress=192.168.0.2/24
{% endhighlight bash linenos %}
## host-bridge

moby2안에서 bridge를 생성하여야 하는데, 기본적으로 NET-ADMIN capability를 가지고 있지 못하므로 아래와 같이 실패할 수 있습니다.

{% highlight bash linenos %}
root@79c82193d876:/# ip link add name moby2-bridge type bridge
RTNETLINK answers: Operation not permitted
{% endhighlight bash linenos %}

그래서 위에서 moby2는 `--privileged` 옵션을 이용하여 구동하였습니다. 자 브릿지를 만들어 봅시다.

{% highlight bash linenos %}
[vagrant@localhost ovs_3hosts]$ docker exec -it moby2 ip link add name moby2-bridge type bridge
[vagrant@localhost ovs_3hosts]$ docker exec -it moby2 ip link set dev moby2-bridge up
[vagrant@localhost ovs_3hosts]$ docker exec -it moby2 ip link set dev eth1 master moby2-bridge
[vagrant@localhost ovs_3hosts]$ docker exec -it moby2 ip link set dev eth2 master moby2-bridge

[vagrant@localhost ovs_3hosts]$ docker exec -it moby2 ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: moby2-bridge: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000
    link/ether 1e:d3:03:6a:8d:53 brd ff:ff:ff:ff:ff:ff
55: eth0@if56: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff link-netnsid 0
57: eth1@if58: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master moby2-bridge state UP mode DEFAULT group default qlen 1000
    link/ether 1e:d3:03:6a:8d:53 brd ff:ff:ff:ff:ff:ff link-netnsid 0
59: eth2@if60: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master moby2-bridge state UP mode DEFAULT group default qlen 1000
    link/ether 7e:a1:31:29:09:fc brd ff:ff:ff:ff:ff:ff link-netnsid 0
{% endhighlight bash linenos %}
    
## 컨테이너간 연결 확인
{% highlight bash linenos %}
[vagrant@localhost ~]$ docker exec -it moby2 apt-get install tcpdump

[vagrant@localhost ovs_3hosts]$ docker exec moby1 ping 192.168.0.2 -c 1
PING 192.168.0.2 (192.168.0.2) 56(84) bytes of data.
64 bytes from 192.168.0.2: icmp_seq=1 ttl=64 time=0.339 ms

--- 192.168.0.2 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.339/0.339/0.339/0.000 ms
[vagrant@localhost ovs_3hosts]$
{% endhighlight bash linenos %}

이 때 moby2에서 moby2-bridge에 대고 패킷을 뜨면 위의 연결 확인 패킷을 잡을 수 있습니다. 

    
{% highlight bash linenos %}
[vagrant@localhost ~]$ docker exec -it moby2 tcpdump -i moby2-bridge -A
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on moby2-bridge, link-type EN10MB (Ethernet), capture size 262144 bytes
05:24:36.195869 IP 192.168.0.1 > 192.168.0.2: ICMP echo request, id 344, seq 1, length 64
E..T..@.@..............L.X...0.[....G....................... !"#$%&'()*+,-./01234567
05:24:36.195971 IP 192.168.0.2 > 192.168.0.1: ICMP echo reply, id 344, seq 1, length 64
E..T....@.x...........!L.X...0.[....G....................... !"#$%&'()*+,-./01234567
{% endhighlight bash linenos %}
