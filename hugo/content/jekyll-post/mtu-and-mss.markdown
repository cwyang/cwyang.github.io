---
author: cwyang
comments: true
date: "2024-01-31T19:06:00Z"
excerpt: null
tags:
- blog
- network
- mtu
- mss
- mss-clamping
- TCP
title: MTU와 MSS
toc: true
---
라우터, 방화벽을 다루다보면 MTU와 MSS 두 단어를 흔히 접하게 된다.
비슷한 의미를 가지고 있기에 헷갈리고 있어 이 기회에 정리한다.

## MTU: Maximum Transmission Unit
MTU는 NIC의 특성이고, 해당 NIC에서 전송될 수 있는 PDU(protocol data unit)의 최대값을 나타낸다.
따라서 헤더와 데이터를 포함한 전체 패킷의 크기이다.

MSS보다 하위 개념이고, TCP만이 아닌 모든 네트워크 프로토콜에 관련된다.

일반적으로 이더넷의 MTU는 1500바이트이다.
그 이상의 크기를 전송하기 위해서는 패킷을 분할(fragmentation)하여 전송해야한다.
통신성능향상을 위해 MTU를 그 이상으로 키운것이 점보프레임이다. (대개 9000바이트)

여러 패킷으로 분할해서 보내는 경우 헤더들이 여러 패킷에 존재하므로 낭비이고,
여러 패킷을 보내기 위해 NIC가 일을 더 많이 하며,
IP패킷이 쪼개지므로 경로환경에 따라서 쪼개진 패킷이 전송되지 못하는 경우 전송 장애가 일어난다.

### Path MTU Discovery
ICMP를 통해 엔드포인트간의 통신구간의 MTU의 최소값을 찾는 작업이다.
찾으면 그 값을 사용할 수 있는데... 못찾을 수도 있고, 해당 결과를 100%신뢰할 수 없다.

## MSS: Maximum Segment Size
MSS는 ```TCP```가 한번에 전송할 수 있는 페이로드의 최대값이다. TCP헤더, IP헤더등을 포함하지 않는다.

보통 다음과 같이 계산된다
* MSS_TCP = MTU - `IP헤더사이즈` - `TCP헤더사이즈`
* 1500 - 40 = 1460

MSS를 넘어 전송하고자 할 경우  패킷이 MTU크기를 넘어서므로 fragmentation이 발생한다.
MSS는 TCP handshake 과정에서 협의된다.
* 클라이언트가 TCP 초기 협상과정에서 SYN패킷을 통해 MSS 옵션을 전달한다
* 서버는 SYN/ACK패킷을 통해 서버의 MSS옵션을 전달한다.
* 연결 후 보통 두 MSS의 최소값으로 통신한다.

### MSS for IPSec
IPSec은 암호화 전송을 위한 추가적인 오버헤드가 필요하다. MSS에 그를 반영함으로써, IP 패킷 분할을 막을 수 있다.
* IPSec 오버헤드 = `ESP header` + `ESP trailer` + `AH`
* MSS_IPSEC = MTU - `IPSec오버헤드` - `IP헤더사이즈` - `TCP헤더사이즈`

### MSS clamping
그런데 TCP 핸드셰이크를 수행하는 엔드포인트들은 중간에 MSS조정이 일어나야하는지 알 수 없다.
IPSec의 경우도 중간의 장비가 개입하여 암호화 헤더를 추가 하는 것이므로,
MSS의 조정 역시 해당 장비가 수행해주어야한다.

MSS clamping이란 엔드포인트간의 TCP handshake시에 지정된 값으로 MSS값을 고정하는 것으로, 엔드포인트에 투명하게 중간의 장비에서 수행한다.


