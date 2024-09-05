---
author: cwyang
comments: true
date: "2011-08-19T16:22:00Z"
summary: null
tags:
- blog
- diary
- emacs
- erlang
- firefox
- haskell
- rebar
- scim
- xmobar
- xmonad
title: '여러가지 해묵은 문제 해결: Erlang, Firefox, Xmonad, Xmobar, Haskell'
toc: false
---
어제오늘 오늘 그동안 게으름때문에 미뤄두고 살았던 여러가지 묵은 숙제들을 해결했다.  
  
(1) Erlang Makefile  
소스화일이 몇개 안되기 때문에 배치파일로 컴파일을 해왔었다. 하지만 디렉토리 구조는 OTP형식이었기 때문에 emacs compilation window에서 에러가 났을 경우 엔터를 눌러 바로 그 지점으로 점프하는 compile-goto-error를 사용하기가 힘들었다. emacs가 해당 화일이 어느 디렉토리에 있는지 알 수 없었기 때문.  
  
그래서 makefile을 만들려고 찾아보다가 rebar라는 erlang전용의 maketool이 있다는 것을 발견. 하지만 설명서를 자세히 읽을 시간은 없어서 대충 설정해보니 빌드 설정까지는 잘 되는데, rebar가 디렉토리 들어가고 나가고 할 때의 상황을 마찬가지로 emacs가 모르기 때문에 compile-goto-error문제가 있었다.  
  
그래서, top level에 subdir을 돌아가며 make해주는 makefile을 만들었고, 각 subdir에서 rebar를 호출하는 makefile을 만들었더니 깨끗이 해결되었다.  
  
(2) Firefox 한글입력  
Firefox한글 입력이 안되기 시작한 것은 몇달전. scim-bridge 패키지를 깔면 된다하여 깔았으나 입력이 잘 안되길래 한구석으로 치워놓고 웹브라우징은 vmware혹은 노트북으로 하고 있었다.  
  
묵은 설정 해결을 위해 열심히 뒤졌더니 GTK\_IM\_MODULE 설정을 "scim"이 아니라 "scim-bridge"로 해야했었다고. 그 전에 이것저것 뒤져보고 패치했으나 안되던게 이 설정하니 입력이 잘 된다... 아이고야.. 파이어폭스로 직접 입력하니 좋구나. 오랜만에 Kinesis키보드로 이렇게 글을 길게 입력하니 기분이 나쁘지 않다.  
  
(3) Xmonad 얼어버리는 (멈추는) 문제  
Xmonad는 Haskell로 작성된 타일형식의 윈도우 매니저이다. 쓰기 시작한지는 이삼년정도 됐다. 그런데 한 일이년정도 전부터인가 어느 시점부터 Xmonad가 얼어버리는 현상이 나타나기 시작했다. 시스템은 살아있으나 윈도우매니저만 얼어버리는 것. 얼어버리면 X죽이고 다시 띄우고 하면사 이 상태로 무려 일이년을 그대로 쓰다니... 나도 참 어지간하다. erlang작업하며 윈도우 여러개를 계속 왔다갔다하면 일을하니 몇일도 아니고 하루에도 몇번씩 얼어버려서 도저히 참을수 없어 해결책을 찾아봤다.  
  
이유는 Xmonad가 window들의 아웃풋을 받아 그를 로깅을 위해 파이프로 출력하는데 파이프가 다 차버렸기 때문에 블럭된것이었다. 그래서 한 윈도우(emacs등)에서 진드감치 작업하면 며칠에 한번씩 블럭되고 여러 윈도우를 왔다갔다 하면 얼마 지나지 않아 얼어버리고 하는 것이었다. 그런데 원래 Xmonad의 상태바인 xmobar에는 stdin을 읽어 화면에 출력해주는 StdinReader 설정을 했다. 그 StdinReader가 죽어버려서 문제였던것.  
  
StdinReader가 왜 죽느냐 또 찾아봤더니 UTF8 코드를 hGetLine()이 처리를 못해서 그렇다고 한다. 넷에는 System.IO.UTF8.hGetLine으로 처리하면 된다고 하는데, 실제로 해보니 죽기는 마찬가지. 이리저리해보다 결국 xmobar의 StdinReader 처리부에서 해당 핸들을 latin1인코딩으로 세팅해버렸다. 그랬더니 안죽는다. 아래 실험 코드에서 bar.txt에 UTF8문자열이 있다했을때 latin1으로 x를 설정하기 전에는 계속 _hGetLine_: _invalid_ argument (_Invalid_ or **....** multibyte or wide character) 에러를 냈던 것이다.

```haskell
import IO
import System.IO
import System.IO.UTF8

main = do x <- openFile "/tmp/bar.txt" ReadMode
          hSetEncoding x System.IO.latin1
          y <- System.IO.UTF8.hGetLine x
          IO.putStr y
```	  

이러다보니 이틀이 지나버렸다. :-(
