---
author: cwyang
comments: true
date: "2023-07-16T19:02:00Z"
excerpt: UDP는 connectionless이기에 TCP와 달리 데이터 주고받을 때에 고려해야 할 다음과 같은 경우들이 있다. 보낸 요청에
  대해서 다른 IP로부터 응답이 돌아오는 경우, 서버가 IP주소를 여러개 가지고 있을 때, 받은 요청에 대해 응답을 할 IP를 결정하는 경우
tags:
- Unix
- socket
- UDP
- echo server
- python
- IP_PKTINFO
title: UDP 에코 서버
---
테스트를 위해 UDP 에코 서버를 만들다보니 TCP보다 좀 손이 많이 갔다.

UDP는 connectionless이기에 TCP와 달리 데이터 주고받을 때에 고려해야 할
다음과 같은 경우들이 있다.
* 보낸 요청에 대해서 다른 IP로부터 응답이 돌아오는 경우.
* 서버가 IP주소를 여러개 가지고 있을 때, 받은 요청에 대해 응답을 할 IP를 결정하는 경우

## 소켓의 연결성
UDP가 connectionless라는 것은 프로토콜 수준에서 연결 상태가 유지되지 않는다는 것이다. 즉
* 연결 단계(connection handshake)가 없고
* 통신 peer들 간에 상태 저장에 대한 부분이 프로토콜상에 정의되어 있지 않다.

그러나 소켓 자체는 `connect()`을 호출하여 상태 유지가 가능하다.
연결된 UDP소켓은 목적 주소를 지정하지 않아도 연결된 목적 주소로 패킷을 송신하며,
소켓의 UDP 포트로 목적지가 아닌 곳에서 패킷이 수신된다면 수신을 거부한다.

## 클라이언트

UDP가 connectionless이기는 하나, 소켓을 만들고 `connect()`를 하면 내부적으로 연결 테이블이 만들어진다.
해당 소켓에는 목적지 지정 없이 `send()`를 통해 데이터 송신을 할 수 있다.
연결 테이블에 매칭되는, 즉 5-tuple에 매칭되는 패킷이 수신되면 해당 소켓을 통해 응답 패킷을 읽을 수 있다.
연결 테이블에 매칭되지 않는 (IP, 포트) 로부터 패킷이 수신되는 경우 네트워크 스택은 해당 패킷을 거절하고,
ICMP Port Unreachable 패킷을 송신하여 거절하였음을 알린다.

`connect()` 없이 `sendto()`로 데이터를 보내는 경우 해당 소켓의 송신 포트로 패킷이 제한없이 들어올 수 있다.

## 서버

클라이언트가 자신이 보내지 않은 IP에서 응답이 수신되면 거절하기 때문에
서버는 클라이언트가 송신한 목적 IP를 가지고 응답 패킷을 만들어야한다.

TCP의 경우 `accept()`를 통해 송수신 4-튜플이 `(srcip, srcport, dstip, dstport)` 결정되는 반면,
UDP의 경우 자신이 여러 IP주소를 가지고 있고, 모든 IP 주소를 대상으로 `bind()`를 수행하였다면
`(srcip, srcport)`는 `recv()`를 통해 알 수 있고, `dstport`는 `bind()`시의 값으로 결정되나
목적지IP인 `dstip`를 표준 소켓인터페이스로 알 수는 없다

## IP_PKTINFO
Linux에서는 `IP_PKTINFO` 소켓 옵션을 이용하여 UDP 소켓의 목적 주소를 접근할 수 있다.
해당 소켓 옵션을 활성화 한다면
수신 패킷에 대해서는 `recvmsg()`를 통한 목적 주소 파악이 가능하고
송신 패킷에 대해서는 `sendmesg()`롤 통한 송신 주소 설정이 가능하다.
```
$ man 7 ip
       IP_PKTINFO (since Linux 2.2)
              Pass an IP_PKTINFO ancillary message that contains a pktinfo structure  that
              supplies  some  information  about the incoming packet.  This only works for
              datagram oriented sockets.  The argument is a flag  that  tells  the  socket
              whether  the IP_PKTINFO message should be passed or not.  The message itself
              can only be sent/retrieved as control message with a packet using recvmsg(2)
              or sendmsg(2).

                  struct in_pktinfo {
                      unsigned int   ipi_ifindex;  /* Interface index */
                      struct in_addr ipi_spec_dst; /* Local address */
                      struct in_addr ipi_addr;     /* Header Destination
                                                      address */
                  };

              ipi_ifindex is the unique index of the interface the packet was received on.
              ipi_spec_dst is the local address of the packet and ipi_addr is the destina‐
              tion  address  in  the packet header.  If IP_PKTINFO is passed to sendmsg(2)
              and ipi_spec_dst is not zero, then it is used as the  local  source  address
              for  the  routing  table  lookup and for setting up IP source route options.
              When ipi_ifindex is not zero, the primary local  address  of  the  interface
              specified by the index overwrites ipi_spec_dst for the routing table lookup.
```

## UDP 에코 서버
파이선으로 만들어본 UDP 에코 서버
```python
import socket, sys, struct
IP_PKTINFO = 8

def unpack_cmsg(cmsgs):
    for level, type, data in cmsgs:
        _ifindex, _, _, src_addr = struct.unpack('IHH4s', data)
        return (level, type, data), socket.inet_ntoa(src_addr)

def udp_echo_server(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_IP, IP_PKTINFO, 1)
    sock.bind(('0.0.0.0', port))
    while True:
        data, cmsgs, _flags, addr = sock.recvmsg(1024, 1024)
        cmsg, local_addr = unpack_cmsg(cmsgs)
        sock.sendmsg([data], [cmsg], 0, addr)
        print(f"RECV: {addr[0]}:{addr[1]} -> {local_addr}:{port} - [{data.decode()}]")
    sock.close()

port = int(sys.argv[1])
udp_echo_server(port)
```