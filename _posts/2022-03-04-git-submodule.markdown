---
title:  "git submodule"
date:   2022-03-04 15:54:00 +0900
tags: [blog, diary, tip, git, submodule]
layout: post
comments: yes
author: cwyang
header-img: 
toc: true
---
`parent` project에서 `child` project를 git submodule로 사용할 때,  
`child`의 hash를 바꾼 `parent`를 체크아웃해도 로컬 `child`는 변하지 않는다.

이 때에는 `git submodule init`를 실행하여 로컬의 `child`가 `parent`에서 요구하는 버젼으로 업데이트한 후 사용하면 됨.