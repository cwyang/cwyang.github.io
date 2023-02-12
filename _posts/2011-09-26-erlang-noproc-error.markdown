---
title:  "erlang noproc error"
date:   2011-09-26 17:24:00 +0900
tags: [blog, erlang, noproc]
layout: post
comments: yes
author: cwyang
excerpt:
toc: false
---
요즘 간단한 프락시 서버를 만들고 있다. 만들기 시작한지는 한달전인데 너무 게으르게 진행을 하다보니 아직도 한참 남은 상태다.  
  
소켓에서 요청을 받은 다음 그를 프록시하는 do_proxy()라는 함수를 만들었었는데, 오늘은 그것을 gen_server로 바꾸어보았다. Logan 책이 워낙 예제가 잘 되어 있다. 많은 부분 보고 타이핑했다. 자 이제 돌려보는데, 처음 보는 error가 나타났다. noproc 에러, no process오류이다.  

```
** Reason for termination ==  
** {noproc,{gen_server,call,  
                       [sb_proxy_sup,  
                        {start_child,[<0.38.0>,  
```  
언제 봐도 이 메세지는 기분이 나쁘다. 무슨 이야기인지도 잘 모르겠고.. sb_proxy_sup의 start_child를 하려고 했더니 no process 에러가 났다는 이야기였다. 찍어보았더니 supervisor까지는 잘 뜨는데 child의 start_link가 불리지 않는다. 여기서 supervisor를 못 찾는구나라는데에 생각이 미쳐야했는데, 그만 no process가 supervisor의 process를 말하는 것이 아니라 child의 process가 없다라고 생각해버려, "뭔가 뜨자마자 죽어서 start한다음에 link하렸더니 process가 이미 없어져버려 나는 에러인가?" 라고 오바해 버렸다. 결국 그래서 두세시간 허무하게 이거찾고 저거 찾으며 고역을 치루었다.  
  
예제의 supervisor 소스를 살펴보다보니 어떤 부분은 start_link/3을 쓰고 어떤 부분을 start_link/2를 쓰는것을 발견, 매뉴얼을 읽어 보니 start_link의 결과값을 저장해두고 그것을 쓰지 않을 때에는 start_link/3을 써야만 한다는 것을 결국 발견, 아무 생각 없이 긁어 붙였던 start_link/2를 start_link/3로 고쳐서 문제를 해결했다.  
  
완벽히 이해하지 못한채 긁어다 붙이는 초보자는 가끔 이런 봉변을 치르게 마련이다. 그러나 이로 인해 function_clause 에러외에 noproc에러의 대처방법도 인벤토리에 추가하게 되었다.