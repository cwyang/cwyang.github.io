---
author: cwyang
comments: true
date: "2022-01-03T15:45:00Z"
summary: 2022년을 맞이하여 새로운 분야인 NFT/디파이/블럭체인을 공부해볼까 마음을 먹고 신년 첫날 알고랜드 디파이 LP풀에 $30를 예치해보았는데...
header-img: /assets/images/tinyman3.jpg
tags:
- blog
- defi
- algorand
- tinyman
- exploit
- security
title: 디파이의 위험
toc: true
---

2022년을 맞이하여 새로운 분야인 NFT/디파이/블럭체인을 공부해볼까 마음을 먹고
신년 첫날 알고랜드 디파이 서비스인 [tinyman.org](https://tinyman.org)의 LP풀에 $30를 예치해보았는데...

그 다음날인 1월 2일 smart contract exploit 공격이 있었다.
대부분의 LP풀은 자산 가격이 다른 두 개의 토큰을 쌍으로 예치하는 방식인데,
smart contract의 헛점을 이용하여 LP풀에서 서로 다른 쌍의 토큰을 인출하는 게 아니고
같은 종류의 토큰을 인출할 수 있었다고 한다.

예를 들면 100원짜리와 1원짜리를 합쳐서 101원씩 인출해야하는데
100원짜리 2개씩 인출할 수 있었던 것 같다.
![알립니다: 망했어요. 털렸어요.](/assets/images/tinyman3.jpg)

그 결과로 LP pool의 대부분이 탈취되어,
나의 자산도 **$30**에서 **$0.16**으로 **1/200**토막이 나버렸다.
![$60이 되라고 $30을 넣었는데 (나 부자되나..)](/assets/images/tinyman1.jpg)
![$0.16이 되어 1/200토막이 나버렸다. (이게뭐야!!!)](/assets/images/tinyman2.jpg)

블럭체인/NFT는 자산이 움직이는 세계이고, 이 세계에서는 사이버 보안이 매우 중요하다.. 
는 것을 온 몸 바쳐서 경험한 새해 벽두.
