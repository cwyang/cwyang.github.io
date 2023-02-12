---
title:  "Haskell의 폴드(Fold)란 무엇인가요"
date:   2009-02-17 09:39:00 +0900
tags: [diary, haskell, fp, programming, fold]
layout: post
comments: yes
author: cwyang
excerpt: 폴드는 reduce라고도 불리우는 연산자로써 리스트의 각 요소에 대해 연산을 수행하여 하나의 결과값을 반환한다. Map & reduce 처럼 map과 같이 흔히 일컬어 지는, 함수형 프로그래밍 방식의 좌청룡 우백호 중의 하나인데, 사실 map 역시도 폴드로 정의가 가능하므로 폴드가 좀 더 파워풀 한 연산자이다.
---
폴드는 reduce라고도 불리우는 연산자로써 리스트의 각 요소에 대해 연산을 수행하여 하나의 결과값을 반환한다. Map & reduce 처럼 map과 같이 흔히 일컬어 지는, 함수형 프로그래밍 방식의 좌청룡 우백호 중의 하나인데, 사실 map 역시도 폴드로 정의가 가능하므로 폴드가 좀 더 파워풀 한 연산자이다. 더 파워풀하다는 것은 더 이해하기가 어렵다는 것을 나타내기도 한다. 폴드 자체가 재귀호출을 추상화해버린 연산자이기 때문이다. Haskell 책을 읽다보면 으례 초반에 나오는 것이 함수형 프로그래밍에 대한 설명인데, 거기서 딱 막혀버리는 것이 폴드, 자세히 말하면 우폴드 (foldr: fold from right) 이다.

```haskell
foldl :: (acc -> x -> acc) -> acc -> [x] -> acc

foldl step zero (x:xs) = foldl step (step zero x) xs

foldl _ zero [] = zero

foldr :: (x -> acc -> acc) -> acc -> [x] -> acc

foldr step zero (x:xs) = step x (foldr step zero xs)

foldr _ zero [] = zero
```

좌폴드와 달리 우폴드의 경우 폴드의 재귀호출이 전체를 감싸지 않고, step함수의 두번째 인자라는 점이 독특하며, 이것은 폴드를 통해 리스트를 생성할 필요가 있을 때 활용할 수 있다. 즉, 리스트의 전반부만 필요한 경우 혹은 무한 리스트에 대한 폴드를 하는 경우를 생각해 볼 수 있다.

여기까진 그러려니 할 수 있는데, 많은 경우에 바로 뒤이어서 따라오는 이야기, 즉 좌폴드를 우폴드로 정의하기를 들여다보면 생각이 꼬이기 쉽상이다.

```haskell
my-foldl :: (acc -> x -> acc) -> acc -> [x] -> acc

my-foldl f z xs = foldr step id xs z

where step x g a = g (f a x)
```

[RWH](http://book.realworldhaskell.org/)에서도 '이 정의는 non-trivial하니 옆에 두통약과 커피를 가져다 놓고 읽어라' 라고 말하고 있다. 여기서 처음 머리를 아프게 하는것은 where절이다. 즉 step 함수는 인자가 두 개인데 where절의 step의 정의에서는 인자가 세 개가 붙어있다는 점이다. 그런데 사실 타입들을 관찰해 볼때,

```haskell
step :: x -> acc -> acc 이고

id :: a -> a 이므로

step :: x -> (a -> a) -> (a -> a) = x -> (a -> a) -> a -> a
```

와 같이 되므로, step은 인자를 세 개 취하며 my-foldl이 원하는 accumulator를 반환한다고 볼 수도 있다. 이 경우, `foldr step id xs z => step x (foldr step id xs') z` 가 되므로, where절에 의하여 left folding효과를 얻게 되는 것이다.

또한 "좌폴드의 경우 foldl은 lazy evaluation에 의해 비능률적이므로 strict evaluation 버젼인 foldl'을 쓰는 것이 좋다."임을 기억하는 것이 좋다. 즉, Haskell에서는 (1 + 2 + 3 + 4) 가 10으로 저장되는 것이 아니고 (1 + 2 + 3 + 4)라는 thunk로 저장된다는 것이다. 

```haskell
foldl (+) 0 [1..100000]
```

이 스택 오버플로우를 내는 이유가 그것이다. 나도 처음에는 + 연산자정도는 워낙 프리미티브하니까 양쪽 인자를 모두 evaluation한 상태에서 더하기가 수행될 것이라고 짐작했었지만 그렇지 않다는 것.

Haskell의 '초보'딱지를 떼기 위해서는 폴드와 lazy evaluation, 이 두가지를 정확히 짚고 넘어가는 것이 필요하다.