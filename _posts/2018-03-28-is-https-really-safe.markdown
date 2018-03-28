---
title:  "HTTPS를 쓴다고 안심할 수 만은 없다는데, 왜?"
date:   2018-03-28 17:15:00 +0900
tags: [blog, tls, work, https, interception]
layout: post
comments: yes
author: cwyang
excerpt: 주소창에 녹색 자물쇠가 보이면 안전하다구?
header-img: /assets/images/life-of-pix-free-stock-photos-spain-door-padlock.jpg
---

인터넷 사용시 HTTP를 이용하면 도청이 가능하고, 변조가 가능하며, 인증이 결여되어 있기 때문에 최근 브라우저들은 HTTP사이트를 방문하면 안전하지 않은 연결이라고 안내하는 추세입니다. 전자입찰을 한다고 보았을때, 입찰가가 유출되고(도청), 입찰가를 해커가 바꿀 수 있으며(변조), 입찰을 제대로 했다고 생각했지만 그게 아니라 (인증결여) 입찰에 탈락할 수가 있는거죠. 그렇기 때문에 안전한 HTTPS, 즉 암호화 통신경로로 많은 서비스들이 옮겨가고 있죠. 인터넷 사용시 주소창에 녹색 자물쇠가 나타나면 아, 나의 통신은 안전하구나.. 하고 안심하면 되는 것이죠.

![주소창에 자물쇠가 보이면 안전하다구?]({{ "/assets/images/life-of-pix-free-stock-photos-spain-door-padlock.jpg"| absolute_url }})

그/러/나 꼭 그렇지만도 않습니다!

암호화 통신이라는 것은 양날의 검이어서 나도 안전하게 이용할 수 있지만, 해커들도 검문없이 드나들 수가 있게됩니다. 자유는 위험을 수반하고 보안은 불편이 따라붙죠. 그래서 우리들이 이용하는 암호화 통신은 통신 경로상에서 암호화를 벗겨서 내용을 검사하는 과정, 즉 복호화 과정을 거칩니다. 이게 꼭 나쁜것만은 아니에요. 보안은 불편을 수반한다니까요. 그럼 어떤 녀석들이 복호화를 하는가 하는지 볼까요?

* Anti-Virus S/W: PC나 휴대폰에 설치된 Avast나 AVG등의 앤티바이러스 소프트웨어들. PC 및 휴대기기를 지키기 위해서 외부와 주고받는 암호화 통신을 검사합니다.
* 회사 내의 보안 장비: 회사, 학교, 단체들은 외부로부터의 보안위협, 즉 악성코드나 랜섬웨어들로부터 내부를 지키기 위하여 암호화 통신을 검사합니다. 보안등급이 높은 단체는 내부의 귀중한 자료, 예를 들면 반도체 설계도면 등이 밖으로 유출되지 않도록 지키기 위하여 검사하기도 합니다.
* ISP 장비: ISP, 특히 모바일 ISP의 경우 트래픽 분석/최적화를 위하여 통신을 검사합니다. 
* 악성코드: 위의 3가지 분류는 좋은 목적(?)으로 통신 검사를 하지만, 반대로 개인정보를 유출하기 위해 통신을 검사하는 악성 코드가 존재합니다.

암호화 통신이 정말 저렇게 많이 중간에 검사가 될까요? 그렇습니다. 2017년 NDSS 심포지움에서 발표된 "The Security Impact of HTTPS Interceptions"<sup>[1](#footnote1)</sup> 논문의 내용을 간단히 소개해드리겠습니다.

* HTTPS 트래픽 중 5~10%가 경로 중간에서 복호화 되고 있다(Interception)
* Antivirus S/W, Bluecoat 기기, Mobile api등이 주된 녀석들
* 과테말라가 15%, 그린랜드가 10%, 그리고 한국이 8.8%로 복호화 율 최고!

뭐 좋은 의미로 중간에서 복호화 할 수도 있겠죠. 내 암호화 데이터를 중간에서 나도 모르게 들여다본다니 기분은 상할 수도 있겠지만요. 하지만 문제는 중간에 난입한 저 장비들이 보안을 망쳐버릴수 있다는 것입니다. 잘 포장된 선물을 경비원이 검문한다음에 대충 스카치테이프로 붙여서 돌려준다고나 할까요?

* 중간의 장비들 때문에 원래의 보안 수준이 망쳐지는 비율이 굉장히 많다라는 것이 [1]에 조사되어 있습니다. A등급 보안이 F등급으로 변하는 비율이 8~36%입니다. 중간에 끼어들지 않으면 완벽한 보안이, 중간의 복호화장비가 잘못 하여 누구나 도청할 수 있는 보안수준으로 망가진다는 이야기입니다.

왜 그럴까요? 보안장비 만드는 사람들의 월화수목금금금 스케쥴 때문에 그럴 수도 있겠지만.. :-) 원래 보안 프로그래밍이 어려운 것이다라는 이야기가 더 맞겠지요. Texas Austin에서 2012년에 발표한 논문<sup>[2](#footnote2)</sup>의 연구결과를 보시지요.

* 보안 API가 원래 쓰기가 어렵게 만들어져 있어서 보안 프로그래밍을 제대로 하기가 어렵다.
* Google, MS, Mozilla들이 만드는 브라우저들은 품질을 맞추지만, 그렇지 않은 경우, 즉 브라우저가 아닌 보안제품의 경우는 품질이 떨어질 수 밖에 없는데, 예를 들면
  - Amazon Payment, Paypal, Lynx, Apache Client, Trillian 메신저, Rackspace 관리도구, TextSecure 안드로이드 앱, Apache Axis, Pusher, Chase mobile banking, Amazon Elastic LB API, 여러 Shopping cart, Google Admob, AIM등, 괜찮을 것 같은 앱들도 다 부실하게 만들어 놓았더라.

그러면 어떻게 해야 할까요? 일부 보안강도가 높은 서비스들은 고정 공개 키(Public Key Pinning)등의 기법들을 사용하여 중간에 복호화하는 기기가 있으면 아예 서비스를 중단하도록 하기도 해요. 모든 서비스들에 대해서 중간에 복호화 하지 말도록 해야 할까요? 이 경우  중간에 복호화 장비의 순기능을 없애버리게 되는것이죠. 결국 한쪽 극단은 해답이 되기 어렵고요, 중용의 묘를 살려야 하겠습니다.

오늘의 결론은 다음과 같습니다.

* 인터넷 주소창에 초록 자물쇠가 뜬다해도 중간에 복호화 장비가 **삽질**을 하는 경우 내 데이터는 여전히 위험해요.
* 그렇다고 복호화 장비나 Anti-Virus를 *안쓰면 또 위험해져요*.
* 따라서 **삽질**을 하는 복호화 장비, **삽질**을 하는 안티바이러스를 쓰지 말고 좋은 제품을 골라서 사용해야 합니다.

감사합니다.


* <a id="footnote1"> [1]</a> [Zakir Durumeric et al, The Security Impact of HTTPS Interception, NDSS '17](https://jhalderm.com/pub/papers/interception-ndss17.pdf)
* <a id="footnote2"> [2]</a> [Martin Georgiev et al, The Most Dangerous Code in the World: Validating SSL Certificates in Non-Browser Software, CCS '12](http://www.cs.columbia.edu/~suman/docs/suman_ccs12.pdf)
