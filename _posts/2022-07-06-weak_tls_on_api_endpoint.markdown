---
title:  "API endpoint들의 취약한 TLS 버젼"
date: 2022-07-06 08:58:00 +0900
tags: [blog, ssl, tls]
layout: post
comments: yes
author: cwyang
excerpt: TLS 1.2 미만 (SSL*, TLS1.0, TLS1.1)은 그 보안취약점으로 인해 IETF가 2021년 3월에 정식으로 관뚜껑에 못질을 하였습니다.
toc: true
header-img: /assets/images/unlocked.jpg
---
내년 6월부터 모든 AWS API에서 TLS1.2 미만을 지원중지한다는 소식을 접하여, TLS 버젼 이야기 짧게 드립니다.
https://aws.amazon.com/ko/blogs/security/tls-1-2-required-for-aws-endpoints/

![TLS 1.0, 1.1은 아주 취약해요!]({{ site.url }}/assets/images/unlocked.jpg)

TLS 1.2 미만 (SSL*, TLS1.0, TLS1.1)은 그 보안취약점으로 인해 IETF가 2021년 3월에 정식으로 관뚜껑에 못질을 하였습니다.
https://datatracker.ietf.org/doc/rfc8996/

이 때 AWS는 FIPS 엔드포인트에서 TLS1.2 미만을 지원중지하였습니다.
https://aws.amazon.com/ko/blogs/security/tls-1-2-required-for-aws-fips-endpoints/

그리고 내년 6월부로 모든 AWS API에서 TLS1.2 미만을 지원중지하는 것입니다.

AWS에서는 서비스 마이그레이션을 위해 클라우드트레일에서 접속 TLS 버젼을 확인하고 취약한 TLS1.0, 1.1을 사용하면 해당 클라이언트를 업데이트하도록 권장하고 있습니다.


브라우저벤더들이 (MS, Google, Apple, Mozilla) 2020~2021년에 걸쳐서 해당 버젼 지원을 중지하였기 때문에 TLS1.2 이상으로 통신을 강제하여도 대부분 문제가 없겠으나
레거시/커스텀 소프트웨어가 TLS통신을 할 경우 취약한 버젼으로 연결이 맺어질 수 있어 보안에 문제가 있는 것입니다.

* * *

신규 서비스 TLS 엔드포인트를 만들때에는 TLS1.2 이상으로 지정하도록 해야하고요,
기존 서비스 엔드포인트에 대해서도 취약한 TLS버젼에 어떻게 대처할 지 고민이 필요하겠지요?

감사합니다.

```
$ bin/openssl s_client -connect ncloud.apigw.ntruss.com:443 -tls1
CONNECTED(00000003)
depth=3 C = GB, ST = Greater Manchester, L = Salford, O = Comodo CA Limited, CN = AAA Certificate Services
verify error:num=19:self signed certificate in certificate chain
...
중략
...
SSL-Session:
Protocol  : TLSv1
Cipher    : ECDHE-RSA-RC4-SHA
```