---
author: cwyang
comments: true
date: "2023-09-04T19:00:00Z"
excerpt: null
draft: true
tags:
- Linux
- routing
title: Linux 라우팅
---
라우팅은 패킷을 전달할때 패킷을 내보낼때
어느 인터페이스로 어느 Next-hop 주소로 보낼지를 결정한다.

목적 IP만을 보고 결정하는 것이 종래의 라우팅이고,
소스 IP, 포트등 다른 정보까지 보고 결정하는 것이 
Policy-based routing (PBR)로써
`fib_lookup()`은 PBR기능을 수행한다.

`ip rule`을 통해 Routing Policy DB (RPDB)를 설정하는데,
RPDB는 priority, selector, action으로 이루어져 있고
3개의 라우팅 테이블이 기본 설정되어 있다.
```
0     : from all lookup local
32766 : from all lookup main
32767 : from all lookup default
```

local테이블에는 default `0.0.0.0/0` 라우트 설정이 없다.

