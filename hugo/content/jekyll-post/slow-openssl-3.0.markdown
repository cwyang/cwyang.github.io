---
author: cwyang
comments: true
date: "2023-02-03T20:00:00Z"
summary: OpenSSL 3.0의 큰 설계방향은 개발의 편의성을 위해서 모듈화/추상화를 만들어 넣은 건데, 반대급부로 성능이 많이 떨어졌습니다.
  모듈이 복잡해지면 공유자원 사용을 위한 락이 많이 사용되는 경향이 있기 때문에, 스레드(코어)가 많아질수록 CPU 락 경합때문에 발생하는 성능
  저하 현상이 문제가 됩니다.
header-img: /assets/images/OpenSSL_logo.png
tags:
- blog
- ssl
- openssl
- haproxy
title: HAProxy, 그리고 OpenSSL3 성능
toc: true
---
[2022년 12월 HAProxy 2.7이 나왔습니다.](https://www.haproxy.com/blog/announcing-haproxy-2-7/)

여러 개선중에 최대 스레드 지원이 기존 64개에서 4096개로 늘어난 것이 눈에 띕니다.

> However, due to the fast, atomic operations involved at many places, HAProxy was previously limited to 64 threads, and therefore 64 CPU cores, on 64-bit machines. This limit is now raised to 4096 threads by the introduction of thread groups.

사실 HA-Proxy는 이미 성능이 충분히 좋아서 최대 스레드를 저렇게 늘릴 까닭은 별로 없습니다... SSL 처리를 위해서가 아니라면요.

![OpenSSL](/assets/images/OpenSSL_logo.png)

문제는 HAProxy가 사용하고 있는 OpenSSL 3.0이 그렇게 성능이 좋지가 않다는 겁니다.
OpenSSL 3.0의 큰 설계방향은 개발의 편의성을 위해서 모듈화/추상화를 만들어 넣은 건데, 반대급부로 성능이 많이 떨어졌습니다.
모듈이 복잡해지면 공유자원 사용을 위한 락이 많이 사용되는 경향이 있기 때문에, 스레드(코어)가 많아질수록 CPU 락 경합때문에 발생하는 성능 저하 현상이 문제가 됩니다.
[공식 github사이트에 30배 CPU부하증가, 3배/10배/80배 느려짐, 95% CPU 등](https://github.com/openssl/openssl/issues/17627#issuecomment-1060123659) 여러 성능 이슈가 보고되고 있고, 개선되고 있습니다.

HAProxy나 그밖의 OpenSSL을 사용하는 시스템이 다중 스레드에서 높은 처리성능을 발휘해야한다면 앞으로도 당분간은 openssl-3보다는 openssl-1.1.1을 사용하시는 것을 권해드립니다.

