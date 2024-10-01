---
categories: hugo update
comments: true
date: "2024-10-01T13:28:09+0900"
tags:
- devel
- diary
- debug
categories:
- devel
title: Missing libSegFault.so
---

![](/assets/images/i_segv.png)

https://sourceware.org/pipermail/glibc-cvs/2022q1/076117.html

`SEGFAULT_SIGNALS="all" LD_PRELOAD=/usr/lib/libSetFault.so prog`

위와 같이 프로그램을 실행시키고 해당 프로세스 장애시 로그에 백트레이스를 기록하는 용도로 많이 사용했었던 glibc의 [libSegFault](https://www.marcusfolkesson.se/blog/libsegfault/)가 단종(deprecate)되었다.

```bash
ubuntu:~$ whereis libSegFault.so
libSegFault.so:
```

The deprecation commit에서 추천한것은 (1) sigsegv gnulib module (2) libsegfault 두 가지인데 모두 소스코드의 수정이 필요한 방식이기에 항상 적용가능하지는 않다.

찾아보니 우분투에는 glibc-tools에 libSegFault.so가 살아있었다.

```bash
ubuntu:~$ apt install glibc-tools

ubuntu:~$ whereis libSegFault.so
libSegFault.so: /usr/lib/x86_64-linux-gnu/libSegFault.so

Backtrace:
./powerplant(+0x606)[0x55d2ad5e1606]
./powerplant(+0x628)[0x55d2ad5e1628]
./powerplant(+0x639)[0x55d2ad5e1639]
/usr/lib/libc.so.6(__libc_start_main+0xea)[0x7f9852ec6f6a]
./powerplant(+0x51a)[0x55d2ad5e151a]

$ addr2line -e ./powerplant -a 0x606
    0x0000000000000606
    /tmp/segfault/main.c:3
```


