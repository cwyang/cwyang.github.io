---
title: "Azure VNET 라우팅"
date: 2023-02-08 20:00:00 +0900
tags: [CloudNetwork, Azure, VNET, Subnet, UDR, VPC, L2-domain]
layout: post
comments: yes
author: cwyang
excerpt:
toc: true
header-img: /assets/images/azure-routing-example.png
---
Azure의 VNET(Virtual Network)은 클라우드상의 네트워크 환경이다.
AWS의 VPC (Virtual Private Cloud)에 대응한다.
VNET에 할당된 주소범위(CIDR)를 구분하여 서브넷을 만들고, 서브넷간의 라우팅이 가능하다.
VNET은 독립된 네트워크인데 주소범위가 겹치지 않는다면 여러 VNET을 연결(peering)하여 구성이 가능하다.
이러면 VPC사이에서도 라우팅이 가능하다.

라우팅 테이블은 서브넷마다 부여된다.
서브넷이란 원래 L2도메인, 즉 같은 네트워크상에서는 라우팅이 필요없이 목적지로 연결되는 의미인데
클라우드에서는 그렇지 않으며 단순히 VNET을 세분화한 네트워크 영역이다.
L2 도메인과 유사하게 동작하기 위해서 라우팅 테이블에
`서브넷 CIDR --> VNET` 이라는 라우팅을 넣어야 한다.
편의를 위해 라우팅 테이블 생성시에 `VPC CIDR --> VNET` 항목이 기본적으로 등록된다.

클라우드 네트워크 구현에 따라 서브넷이 L2도메인일 수도 있겠으나,
만약 라우팅 엔트리가 필요없이 서브넷간의 통신이 된다면
해당 클라우드의 네트워크가 SDN이 아닌 종래의 네트워크 구조에 기반하기 때문일 것이다.
복잡하고 큰 네트워크를 구성하기 위해서는 SDN구성이 좋고,
SDN구성에서는 서버들이 L2가 아닌 오버레이 L3로 연결되어있다.

Azure 의 라우팅 목적지 타입으로는
(1) 로컬 VNET안의 서버로 보내기 위한 *VNET*
(2) 인터넷 영역, 즉 인터넷 게이트웨이로 보내기 위한 *Internet*
(3) 통신을 차단하기 위한 *Drop*
(4) 연결된 다른 VNET으로 보내기 위한 *VNET Peering*
(5) 연결된 다른 네트워크 (BGP나 VPN)로 보내기 위한 *VNET Gateway*
(6) 허용된 특정 클라우드 서비스로 보내기 위한 *VNETServiceEndpoint* 가 있다.

![Azure 라우팅 구성예<br>https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview]({{ site.url }}/assets/images/azure-routing-example.png)

Azure는 사용자가 서브넷 라우팅을 생성하는 기능을 제공하는데 이를 UDR (User-Defined Routing) 이라고 한다.
정적static 라우팅, 커스텀 라우팅 모두 동일한 의미이다.
UDR에서는 침입탐지 시스템 등의 보안장비를 연동하기 위한 *Virtual Appliance* 라우팅 목적지를 제공한다.

등록된 서브넷 라우팅 엔트리에 대해 *Longest Prefix Match*를 이용하여 라우팅을 결정한다.
주소매칭이 동일한 경우 (1) UDR (2) BGP (3) 시스템라우팅 순서로 우선한다.
다만 BGP라우트는 VNET, VNET Peering, VNETServiceEndpoint보다 우선순위가 낮다.



