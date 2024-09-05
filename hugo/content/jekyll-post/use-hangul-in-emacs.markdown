---
author: cwyang
comments: true
date: "2013-04-09T10:50:00Z"
summary: null
tags:
- blog
- emacs
- tip
- 한글
title: emacs 내장 입력기 사용하기 (XIM 비활성화)
toc: false
---
emacs사용시 IBUS/nabi등의 XIM 외장입력기보다 내장입력기를 사용하는 것이 간단하다. 

다음 방법을 사용하여왔는데 OS재설치 이후에 원하는 대로 안 움직였다.

-   Emacs.useXIM: off 를 Xresource에 추가
-   emacs실행시 XMODIFIERS="" emacs로 실행

그래서 다음 코맨드로 실행하여 성공.

-   LANG=C emacs

ko_KR 로케일에서 XMODIFIERS건 useXIM이건 무시하고 무조건 XIM을 받도록 되어 있는 듯?