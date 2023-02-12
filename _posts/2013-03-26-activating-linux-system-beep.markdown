---
title:  "Linux 시스템 비프 활성화"
date:   2013-03-26 11:01:00 +0900
tags: [blog, diary, beep, bell, linux, xkbset]
layout: post
comments: yes
author: cwyang
excerpt:
toc: false
---
Arch Linux설치후 오년여 만족하며 사용하고 있었으나, 최근들어 x-server가 자주 비정상 종료하는 경우가 발생했다. pacman update시에 의존성 문제로 업데이트가 안되어 의존성을 무시하도록 했더니, 업데이트후 부팅조차 불가한 상태가 되어, ubuntu기반의 mint linux 13으로 새로 설치했다. 

우분투 기반은 설치 및 사용이 편하다. 쓸데 없는 프로세스들 때문에 Arch linux때보다 무거워진 느낌이 확연하지만, 그냥그냥 게으른 맛에 쓰기는 괜찮다.

현재의 문제점은 USB sound card를 깔끔하게 인식시키는 방법을 모르겠다는 것. 잘 될 때는 잘 되는데, 갑자기 시스템에서 카드를 미인식하기 시작하면 리붓을 해야한다.

xterm에서 ^G (BELL)이 작동하지 않길래 여러가지 찾아보았다. /etc/modprobe.d/blacklist 화일에서 pcspkr 모듈을 해제해 주었더니 consoled 모드에서는 비프가 활성화되나 xterm에서는 마찬가지. xset b 하여도 묵묵부답이다. 검색 결과 어느 순간 xset이 안먹게 되었다는 것. 아무도 신경 쓰지 않는 버그이겠지.

`xkbset b` 로  시스템 비프를 활성화 해 주었다. 

삑, 삑삑. 크 좋네.
