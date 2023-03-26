---
title:  "Linux Settings in 2023"
date:   2023-03-26 09:24:00 +0900
tags: [linux, settings, mint, ubuntu, thinkpad]
layout: post
comments: yes
author: cwyang
header-img: 
toc: true
---
잠시 사용하던 윈도우에서 다시 리눅스로 돌아가고자 한다.
랩탑에 설치하는 것은 처음이다. 윈도우와 최대한 유사하게 꾸며보기로 한다.

### 확인할 것들 / 개선필요사항
* BIOS sleep state: linux(s3) sleep vs windows modern sleep
  - modern standby가 더 신속하지만 power를 많이 먹는다고 한다.

### 기본 환경
* Thinkpad X1 Carbon Gen9
* Mint Linux 21.1 (2022년 12월 출시)
* 파티션: base(60G), swap(16G), home(100G)
* 부트로더: on hdd. windows bootmgr와 별도로 구성
* 한글: fcitx (기본)
  - 한영전환: `Ctrl+Space`(기본), `Shift+Space` (추가)
  - 사용하다보면 힌트윈도우가 떠서 거슬릴때가 있는데, `Ctrl+Alt+P`로 비활성화 가능
* 블루투스, 사운드, 웹캠 기본 정상작동

### 핫키설정
Setting >> Keyboard >> Shortcut 에서 지정한다. 윈도우와 유사하게 설정
* Run Dialog: `Super+R`
* Home Folder: `Super+E`
* Web Browser: `Super+C`
* Terminal: `Super+T`
* Setting: `Super+I`
* Lock Device: `Super+L`
* Push Tile: `Super+DIR`
* Move Tile to Other Monitor: `Shft+Super+DIR`
* Screenshot to Clipboard: `Shift+Super+S`
* ACPI성능프로파일: `Fn+L` (low) `Fn+M` (mid), `Fn+H` (high perf)
  - 확인: `cat /sys/firmware/acpi/platform_profile`

### 설치 앱
* Google Chrome
* Virtual Box
* VS Code

### 웹앱
* 특정 웹 브라우저를 앱과 같이 등록할 수가 있다. 웹 메신저등에 활용가능하다.
  실행중이 아니면 알림을 못받는 문제, 알림뱃지등이 없는 한계가 있지만 아쉬운대로 사용한다.
* `webapp-manager` 등록후 taskbar고정

### 가상환경
* default vagrant 가 vbox 7.x을 지원하지 않아 vbox 6.0을 설치하여 사용한다.

### 네트워크
* 태스크바에 네트워크 추가
  - Setting >> Startup Application >> Add Network
* VPN
  - openconnect vpn을 사용한다.
  - `apt install network-manager-openconnect network-manager-openconnect-gnome`
  - 설치 이후 Setting >> Network >> Add VPN
  - vpn typ 설정 후 게이트웨이를 지정
  - `resolvectl --status`로 vpn0에서 DNS 설정이 되어 있는지 확인한다.

### 프린터
* Sindoh D400 linux driver
  - generic PCL6
  - https://hamonikr.org/board_practice/4537#comment_73416
  - https://acehyuk.tistory.com/351
