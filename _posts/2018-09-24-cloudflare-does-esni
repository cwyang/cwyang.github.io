---
title:  "Encrypted SNI"
date:   2018-09-24 09:40:00 +0900
tags: [blog, sni, tls, ssl, filtering]
layout: post
comments: yes
author: cwyang
excerpt: 얼마전에 H2O개발자인 Kazuho Oku씨가 IETF hackerthon에서 암호화 SNI 구현을 했다는 소식을 들었습니다. 그리고 오늘 Cloudflare에서 모든 서비스에 full support를 한다고 발표를 했네요.
header-img: /assets/images/esni_cloudflare.png
---
얼마전에 H2O개발자인 Kazuho Oku씨가 IETF hackerthon에서 [암호화 SNI](https://tools.ietf.org/html/draft-ietf-tls-esni-01) 구현을 했다는 소식을 들었습니다. 그리고 오늘 Cloudflare에서 모든 서비스에 full support를 한다고 [발표를 했네요.](https://blog.cloudflare.com/encrypted-sni/)

![ESNI]({{"/assets/images/esni_cloudflare.png"| absolute_url }})

> 이제 SNI 차단은 안된다는 것이에요.  

정확히 말하면 SNI 차단을 막아주는 환경을 제공하는 사업자가 생겼다라는 것입니다.

DNS over TLS와 함께 SSL/TLS통신을 쓰면 대부분이 암호화 통신이 되고 있었지만, 유일하게 암호화 되지 않았던 부분이 요청시의 SNI필드 `나 www.naver.com에 방문하고 싶어요`와 함께 응답시의 인증서필드 `알았어요. 우선 www.naver.com인증서를 보낼테니 확인해보세요`  였습니다.

TLS 1.3부터는 인증서도 암호화해서 보냅니다. 그래서 진짜 남은게 요청시의  SNI 필드였는데, 그것도 저 인터넷 드래프트의 구현으로 해결한거죠. 저 인터넷 드래프트는 RFC로 등록이 될 것이라고 생각해요.

DNS로 퍼블릭 키를 배포하고, 퍼블릭 키를 이용하여 DH (Diffie-Hellman)로 공유키를 만듭니다. DH를 이용하기 때문에 매 세션마다 공유키가 바뀌니까 암호화된 공유키로 원본을 특정할 수가 없구요, 퍼블릭 키를 주기적으로 바꾸게 되면 암호화 메카니즘이 완전히 안전해지는거에요.

기술은 점점 더 익명화를 지향하는 쪽으로 나아가고 있는 것이 맞는데, 그게 좋은 건지 생각해보게 됩니다. 

