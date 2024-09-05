---
author: cwyang
comments: true
date: "2019-12-19T11:33:00Z"
excerpt: 벌써 연말이다. 2020년에는 OpenSSL 3.0이 발표 예정이다. OpenSSL 1.1.1 작업을 한 지도 얼마 안되었는데...
header-img: /assets/images/openssl30-component.png
tags:
- blog
- openssl
- SSL
title: OpenSSL 3.0
toc: false
---
벌써 연말이다.

2020년에는 OpenSSL 3.0이 발표 예정이다. OpenSSL 1.1.1 작업을 한 지도 얼마 안되었는데...

원래 스케쥴대로라면 2020년 2Q 릴리즈 예정이었으나 현재로썬 4Q 릴리즈가 예상된다.

OpenSSL 3.0은 OpenSSL 1.x대의 내부 구성을 들어엎는 것이다. libcrypto쪽에서는 EVP 인터페이스로 통합되고 provider라는 모듈 개념이 등장하여 변화가 제법 있는데, libssl쪽은 큰 변화 없이 사용할 수 있다. libssl쪽은 1.1.1로 올라가면서 이미 많은 변화를 겪었기 때문이다. 

> The changes required for existing users of OpenSSL 1.0.2 to upgrade to OpenSSL 3.0 are more significant. For existing users of OpenSSL 1.0.2 we recommend upgrading to our newest LTS (Long Term Support) release 1.1.1, in order to ease the future migration to OpenSSL 3.0.

![Conceptual Component of OpenSSL3.0 (https://www.openssl.org/docs/OpenSSL300Design.html)](/assets/images/openssl30-component.png)



