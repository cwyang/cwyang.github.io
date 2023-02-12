---
title:  "Multiqueue NIC"
date:   2010-06-10 18:46:00 +0900
tags: [blog, performance, multiqueue]
layout: post
comments: yes
author: cwyang
excerpt:
toc: false
---
10Gbps NIC이 나오게 되면서 Single-core로는 그만한 대역폭을 내기가 어렵게 되었고, 그래서 제안된 것이 multiqueue NIC이다. multiqueue NIC는 각 코어가 고유의 큐와 인터럽트를 할당받는다. RX시에는 NIC가 큐를 골라 (해싱 말고는 방법이 별로 없음) 패킷을 넣어주고, TX시에는 CPU가 큐를 고른다.

2007년 Intel. PRIO qdisc: TX의 처리를 위해 qdisc가 여러 hw 큐에 대응될 수 있도록 한다. 큐가 full일 경우 해당 netdev를 stop하는 문제를 해결하기 위한 것. 이 때 병목은 qdisc가 된다.[1]

2008,9년 David Miller (RedHat): TX의 처리를 위해 default qdisc에서 netdev가 여러 qdisc에 대응될 수 있도록 한다. 그러면 병목은 디폴트 qdisc만이 된다. forwarded 패킷의 경우 input device가 고른 RX큐가 TX큐를 고르고, locally generated 패킷의 경우 소켓을 해시해서 사용한다.[2,3]

[1] Zhu Yi and Peter P. Waskiewicz, Jr. Enabling Linux Networks Support of Hardware Multiqueue Devices, OLS2007

[2] David S. Miller, Linux TX Multiqueue Implementation, Seattle 2008

[3] David S. Miller, Linux Multiqueue Networking, NYC 2009