---
author: cwyang
comments: true
date: "2009-02-01T02:17:00Z"
summary: Hal Daum ́e III의 Yet Another Haskell Tutoriall을 읽고 있다.
header-img: /assets/images/book-prog-in-haskell.png
tags:
- diary
- haskell
- fp
- programming
title: Yet Another Haskell Tutorial
---
[Hal Daum ́e III의 Yet Another Haskell Tutorial](http://en.wikibooks.org/wiki/Haskell/YAHT)을 읽고 있다. SoE를 읽은 후에 다시 RWH로 넘어갔으나, 아직도 RWH는 벅찬 느낌이 많아 튜토리얼을 몇개 더 보고 RWH로 들어가려고 한다. YAHT는 Programming in Haskell과 비슷한 수준인데, 좀 더 Practical한 관점에서 기술되었다고나 할까? 아직 다 읽지는 못했지만 몇가지 기록해 둘 만한 것이 있다.

4장의 Continuation passing style에 대한 기술에서 Continuation이, 일반적으로 말해지는 Continuation이 아니고 그냥 Function을 지칭하는 기분이다. 내가 잘 모르는것인가? fold를 cfold를 이용해 설명한 부분은, 다른 책에서는 그냥 간단히 넘어갔는데 설명히 자세히 되어 있다.
Computation type class를 제시하고 success/failure/augment/combine function을 들어 설명한 부분이 이해하기 쉽게 되어 있다. 즉, Monad의 이해가 잘 되지 않을때 다시 되돌아와서 볼만하다고 여겨진다.
fold와 Monad만 잘 이해하면 다시 RWH로 갈 수 있을것 같은데, 마음과 같이 쉽지만은 않다. 


p.s. 9장  Monad는  Simple State Monad까지 읽고 또 일단 Skip.  너무 Learning Curve가 급격해! 이후,  [Haskell IO inside tutorial](http://haskell.org/haskellwiki/IO_inside)을 읽었는데, 이 튜토리얼도 (IO) Monad를 (더욱) 쉽게 설명하고 있다.
