---
author: cwyang
comments: true
date: "2023-02-02T21:30:00Z"
summary: 일반적인 사용자들의 패스워드는 40 비트 정도의 엔트로피를 가진다고 합니다. 40 비트 키는 매우 취약하다는 이야기 많이 들어보셨을거에요.
  랜덤하게 만들어도 72 비트 이상가기가 어렵다고 하는데요. 그래서 PBKDF2를 반복(iteration)해서 적용하여 안전한 키를 만듭니다.
header-img: /assets/images/password.jpg
tags:
- blog
- cloud
- security
- password
- pbkdf2
title: 패스워드 매니저의 위험성과 클라우드 보안
toc: true
---
[2022년 12월 LastPass의 패스워드들이 유출되었습니다.](https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/)
LastPass는 클라우드 스토리지에 패스워드들을 저장하고 있었는데
2022년 8월에 유출된 정보를 통해 이번에 패스워드들이 유출되었다고 해요.
패스워드는 [PKBDF2](Password-Based Key Derivation Function 2)(https://en.wikipedia.org/wiki/PBKDF2)<sup>[1](#footnote1)</sup>로 암호화되어 있었어요. 즉 해시만이 저장되어 있었는데요. 이게 안전하지 않다는 이야기가 많습니다.

![패스워드 과연 안전한가?](/assets/images/password.jpg)

보안을 위해 40 비트, 64 비트 키는 안전하지 않다. 128 비트 이상을 사용하라는 이야기 들어보셨을텐데요,
일반적인 사용자들의 패스워드는 40 비트 정도의 엔트로피를 가진다고 합니다.
40 비트키는 매우 취약하다는 이야기 많이 들어보셨을거에요.
랜덤하게 만들어도 72 비트 이상가기가 어렵다고 하는데요.
그래서 PBKDF2를 반복(iteration)해서 적용하여 안전한 키를 만듭니다. 반복할 때마다 패스워드가 강화되는 것이고요, 
~~+9 집행검이~~ 안전한 키가 나올때까지 계속 강화하는겁니다.

이번에 키 누출과 함께 나온 이슈가 LastPass가 PBKDF2를 설렁설렁(?) 사용했다는 것입니다.
LastPass의 주장은 PBKDF2를 100,100번 이터레이션한다는 것이지만 [그렇지 않다는 주장들을 볼 수 있어요.](https://www.reddit.com/r/Lastpass/comments/106p7le/by_default_the_number_of_password_iterations_that/) 
약한 패스워드에 대해 강화를 몇번 안돌렸으니 결과도 취약해진거고 그것이 유출된 것입니다.

[2012년에 LinkedIn 에서도 1억개 이상의 암호화된 패스워드가 유출되었었는데,](https://www.trendmicro.com/vinfo/us/security/news/cyber-attacks/2012-linkedin-breach-117-million-emails-and-passwords-stolen-not-6-5m) 그 암호화 방식이 unsalted SHA1 이어서 문제가 된 적도 있었어요. 같은 패스워드면 암호화된 패스워드도 같았고, 암호화 방식도 취약한 SHA1이었으니 말 다한 것이죠.

클라우드 스토리지에 고객 정보를 저장할때에는 항상 정보가 유출될 수 있다는 생각을 가지고 고객 데이터를 안전하게 관리해야 합니다.
공개 클라우드는 제대로 보안 관리가 되지 않으면 훔쳐가세요~하는 것과 마찬가지니까요.

1. 개인정보는 암호화하고
2. 암호는 일정수준 이상의 보안강도를 유지하며
3. 클라우드상의 리소스의 접근권한을 올바르게 관리해야합니다.

개인으로서는 세상에 절대 안전한 서비스는 없다는 것을 인지하고
(패스워드 매니저가 털리고 그것이 허술하게 관리될 줄이야 누가 알았겠어요)
복잡한 암호를 사용해서 기본적으로 높은 엔트로피를 주는 것이 중요하겠습니다.

* <a id="footnote1">[1]</a> [RFC2898](https://datatracker.ietf.org/doc/html/rfc2898)에 정의되어있으며, ISO-27001 보안규정을 준수하고 있는, 제대로 사용한다면 안전한 함수입니다.
