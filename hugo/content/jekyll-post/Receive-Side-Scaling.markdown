---
author: cwyang
comments: true
date: "2023-02-22T20:00:00Z"
summary: null
tags:
- tech
- performance
- multiqueue
- Receive Side Scaling
title: Receive Side Scaling
---
RSS에 대해서 다시 자료를 보고 있는데
[10년전에도 Multiqueue NIC에 대해서 썼었다는 것을 발견했다.]({{< relref "multiqueue-nic" >}})
아 세월의 무상함이여..

각설하고, 여러 자료들을 바탕으로 RSS에 대해서 정리한다.
- [Scaling in the Linux Networking Stack](https://www.kernel.org/doc/Documentation/networking/scaling.txt)

## RSS

패킷스트림을 분산하지 않고 처리하기는 어려운 시대가 되었다.
네트워크 인터페이스 카드(NIC)이 패킷을 메모리로 전달할 때,
큐를 여러개 두고 패킷을 분산하되 동일한 플로우에 대해서는 동일한 큐로 전달한다.
이를 Receive Side Scaling (RSS)라고 지칭한다.

보편적인 하드웨어 구현방법은 4-tuple (src/dst IP/port)에 대하여 128bucket 해시를 적용하고
해시 버켓에 대응되는 큐로 패킷을 전송하는 것이다.
주로 Toeplitz 해시값의 아래 7bit를 사용한다.

지능형 NIC은 단순 해시가 아닌 계산에 의한 큐 지정 기능을 지원하기도 한다.
`ethtool --config-ntuple` 을 참조한다.

Linux 커널에서 드라이버 구동시 num_queue를 지정할 수 있다.
CPU, 아니면 최소한 각 메모리 도메인마다 하나의 rx queue를 설정하는 것이 보통이다. 

## VPP 

