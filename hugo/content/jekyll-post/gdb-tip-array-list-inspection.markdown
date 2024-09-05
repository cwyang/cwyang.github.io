---
author: cwyang
comments: true
date: "2010-07-10T23:21:00Z"
summary: null
tags:
- blog
- development
- tip
- debugging
- GDB
title: 'gdb 팁: 배열, 리스트 쫒아가기'
toc: false
---
이 팁을 배운 이후 너무 잘 쓰고 있기에, 배운자의 의무로써 널리 알린다.  
  
(1) `foo[0], foo[1], foo[2]..` 와 같이 배열을 검사하고 싶은 경우:
```
 set $i=1  
 p foo[$i++]
```
  
(2) `struct foo{ int data; struct foo *next;} *bar;` 형태의 리스트 구조를 검사하고 싶은 경우  
```
 p *bar  
 p *$.next
```