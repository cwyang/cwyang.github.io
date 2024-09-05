---
author: cwyang
comments: true
date: "2018-03-24T10:15:00Z"
summary: HTTP 사이트가 HTTPS 사이트로 전환되고 있는 추세에 대해서는 잘 아시고 계시지요? 웹 트래픽 중 양적으로나 수적으로 60%정도
  사용되고 있고, 계속 증가 추세입니다. 그 추세는 점유율이 어느정도가 되면 완만하게 꺾일 것이라고 저도, 그리고 여러분도 생각하고 있을 텐데요,
  그 어느 정도가 어느 정도 일까요? HTTPS의 실질적 사용이 100%에 근접하지는 않을까요?
tags:
- blog
- tls
- work
- https
title: HTTPS 사용이 100%가 된다면?
---
HTTP 사이트가 HTTPS 사이트로 전환되고 있는 추세에 대해서는 잘 아시고 계시지요? 웹 트래픽 중 양적으로나 수적으로 60%정도 사용되고 있고, 계속 증가 추세입니다. 그 추세는 점유율이 어느정도가 되면 완만하게 꺾일 것이라고 저도, 그리고 여러분도 생각하고 있을 텐데요, 그 어느 정도가 어느 정도 일까요? HTTPS의 실질적 사용이 100%에 근접하지는 않을까요?

초기에 HTTPS의 사용이 증가한 이유는 유튜브 등의 일부 OTT 사이트가 HTTPS 사이트로 전환되었기 때문입니다. 그러나 최근의 증가 추세는 주요 브라우저 벤더들이 HTTPS를 밀어주고 있기 때문입니다. 어떤 관리자가 자신의 웹 페이지를 방문하면 브라우저에 보안이 취약하다고 난리(?)를 치는데 그냥 둘까요? 브라우저 변화와 HTTPS의 점유<sup>[1](#footnote1)</sup>의 상승에 대한 흥미로운 자료<sup>[2](#footnote2)</sup>가 있습니다. 다음을 보시지요.

	|Date     | HTTPS | 사건
	|2013     |  25%  | NSA에서 정보 감청을 하고 있음이 알려짐
	|2014 Dec |  32%  | Google - 크롬에서 HTTP를 몰아낼 계획발표 - HTTP방문시 적색경고 예정
	|2015 Apr |  35%  | Mozilla - Firefox에서 HTTP를 몰아낼 계획 발표
	|2015 Oct |  38%  | 무료 인증서 Let's Encrypt가 주요 브라우저에서 인식
	|2016 Jun |  45%  | Apple - 앱들은 ATS 의무장착. ATS는 HTTPS만을 사용
	|2017 Jan |  52%  | 크롬56부터 HTTP사이트에서 패스워드/카드정보를 입력할 경우 취약성 경고.  
			    Firefox에서도 HTTP사이트에서 사용자명/패스워드를 입력시 경고
	|2017 Apr |  56%  | Google - 10월부터 크롬에서 다음 두가지 상황에서 취약성 경고 예고.  
			    (1) HTTP페이지에서 데이터 입력시 
			    (2) 비밀브라우징모드에서 HTTP페이지 방문시
	|2018 Jan |  70%  | Mozilla - HTTP방문시 새로운 웹 기능들을 제공하지 않는다고 예고
	|2018 Feb |  70%  | Google - 7월부터 모든 HTTP사이트에 대하여 취약하다고 경고

Google과 Mozilla는 현재의 "HTTPS:안전, HTTP:보통"의 자세에서 "HTTPS:보통, HTTP:취약"으로 태세 전환을 예고했습니다. Google은 또 인터넷 주소 입력시 HTTPS를 먼저 방문하겠다는 계획도 발표했습니다. www.naver.com 을 주소창에 입력할 때 지금은 http://www.naver.com 으로 접속되지만 (실제로 해 보시면 https사이트로 유도되는데요, 그것은 처음에 http로 접속이 완료된 후 웹 사이트 설정으로 인해 https://www.naver.com으로 유도되기 때문입니다), 어느 순간부터는 https://www.naver.com 으로 바로 접속이 된다는 것입니다. 

Let's Encrypt와 같이 무료 인증서를 발급하는 CA도 늘어날 것으로 예상되기 때문에, 인증서 비용은 HTTPS 보급에 진입 장벽이 되지 않을 것으로 생각됩니다.

메이저 브라우저들이 HTTPS를 이렇게 밀고 있으니 HTTPS 실질적 사용이 지속적으로 올라가지 않겠습니까? 그 때 어떤 변화와 기회와 위기가 기다리고 있을까요? 

* <a id="footnote1">[1]</a> Firefox의 텔레메트리 데이터와 Let's Encrypt에 기인한 수치입니다.
* <a id="footnote2">[2]</a> [https://blog.cloudflare.com/https-or-bust-chromes-plan-to-label-sites-as-not-secure/](https://blog.cloudflare.com/https-or-bust-chromes-plan-to-label-sites-as-not-secure/)
