---
author: cwyang
comments: true
date: "2020-12-09T18:12:00Z"
excerpt: null
header-img: /assets/images/osx_gatekeeper_bad.png
tags:
- blog
- macos
- osx
- code-sign
- notarization
title: 맥OS 앱 코드사인 및 공증하기
toc: true
---
윈도우즈와 마찬가지로 맥 생태계에서도 인터넷으로 다운 받는 앱에 대해서는 보안검증이 이루어진다.
앱을 누가 만들었는지를 알 수 없거나 악성 코드 체크가 이루어지지 않는 경우 아래 그림과 같이
사용자에게 물어보거나, 설정에 따라서 실행을 아예 막아버리기도 한다.

![앱이 의심스러워 실행을 금지합니다!](/assets/images/osx_gatekeeper_bad.png)


따라서 앱의 배포를 위해서는 코드사인과 공증 작업이 필요하다. 
Xcode앱인 경우 Xcode에서 대부분 알아서 해 줄 것인데, 수작업으로 작업을 진행해야 할 때도 있다.
당신(이라고 쓰고 미래의 나 라고 읽자)은 수작업으로 진행해야 하기 때문에 이 글을
읽고 있으리라.
자세한 내용은 아래 관련정보에서 얻을 수 있지만, 미래의 나에게 요약하는 의미로
중요한 것을 별도로 정리한다.
[관련정보](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution)

# 코드사인 (Code-sign)

앱에 제작자를 새겨 넣는 작업이다.
1. 맥 개발자 프로그램이 필요하다. 가입한다. (유료. 연간 $99)
2. https://developer.apple.com/ 에 방문하여 Developer-ID 인증서를 만든다.
   만든 인증서는 다운받아 컴의 Keychain access에 저장한다.
   Keychain access에서 해당 인증서의 Private-key를 찾을 수 없다면 뭔가 잘못된 것.
3. 코드사인을 한다.

   `codesign --options=runtime -s 'Developer ID Application' MyApp.app`
4. 코드사인이 잘 안된다면 앱의 모든 화일을 대상으로 extended attribute를 지우고 다시 시도한다.

   `find MyApp.app | xargs xattr -xc`


# 공증 (Notarization)

코드사인된 앱을 애플에 보내서 기본적인 검사를 진행하고 OK도장을 받는 작업이다.

1. Xcode command toolset을 설치한다. `xcrun altool` 명령어가 성공해야한다.
2. 다음 명령어를 이용하여 공증을 시도한다. 잘 되었으면 UUID가 반환된다.
```
% xcrun altool --notarize-app
               --primary-bundle-id "com.example.ote.zip"
               --username "AC_USERNAME"
               --password "@keychain:AC_PASSWORD"
               --asc-provider <ProviderShortname>
               --file OvernightTextEditor_11.6.8.zip
```
  - username: 개발자 ID
  - password: 개발자 ID 비밀번호가 **아니고** 앱개발 전용 비밀번호이다. [애플아이디 설정페이지](https://appleid.apple.com) 에서 지정하는 앱개발용 암호이다.
  - asc-provider: `xcrun altool --list-providers -u "AC_USERNAME" -p "@keychain:AC_PASSWORD"`을 이용하여 얻어낸 provider id를 사용한다.

3. 공증 상태를 체크하기 위해서는 아래 명령어를 사용한다.
```
% xcrun altool --notarization-history 0 -u "AC_USERNAME" \
    -p "@keychain:AC_PASSWORD"
% xcrun altool --notarization-info \
    2EFE2717-52EF-43A5-96DC-0797E4CA1041 -u "AC_USERNAME"
```

4. 공증이 잘 끝났으면 `xcrun stapler staple "Overnight TextEditor.app"` 명령어를 이용하여 공증 결과를 화일에 첨부한다.

이제 해당 파일을 웹 서버에 올리고 다운을 받아보자. 다음과 같이 실행할 것인지 물어본다면 성공!

![인터넷에서 받은 앱을 실행하시겠어요?](/assets/images/osx_gatekeeper_ok.png)

하얗게 불타버린 오늘 하루였다. 커피한잔 사주실분!!!

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="cwyang" data-color="#FFDD00" data-emoji="" data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>

<br><br>
