---
title:  "크래시 덤프 수집"
date:   2022-03-04 16:14:00 +0900
tags: [blog, diary, tip, crashdump, libsegfault, sentry]
layout: post
comments: yes
author: cwyang
header-img: 
toc: true
---
만든 프로그램이 장애가 발생하면 한시라도 빨리 그 내용이 개발자에게 전달이 되어야겠으나,  
일터에서 만든 프로그램의 환경은 주로 폐쇄망이어서 결국 전화나 메시지로 전달을 받고 있다.  
프로그램의 버젼과 관련정보, 스택트레이스등을 자동적으로 받을 수 있는 그 날이 언제인가..

# 크래시덤프(coredump) 확보 방안

아래 내용은 C binary 기준이다.

1.  ulimit -c unlimted  
    로 코어를 생성을 활성화 한 이후 장애가 나면 코어를 보내주거나 해당 기계에 접속해서 gdb를 이용하여 크래시 덤프를 분석한다.
2.  libsegfault.so  
    `whereis libSegFault.so` 하면 gcc toolchain에 동봉된 libsegfault.so의 위치를 알 수 있다.  
    프로그램을 실행시킬 때 `env SEGFAULT_SIGNALS="abrt segv" LD_PRELOAD=${LIBSEGV_LOC} ./test` 과 같이 하면 장애가 발생할 경우 stderr로 stack trace가 출력된다. 이를 전달받아 크래시 상황을 분석한다.
3.  sentry와 같은 크래시 덤프 수집 서비스를 사용  
    [https://sentry.io/](https://sentry.io/) 와 같이 크래시 및 성능 분석 서비스를 제공하는 서비스를 이용한다.  
    아래와 같이 sdk의 api들을 호출하고 프로그램을 실행하면 장애 발생 내용을 대시보드에서 모아서 볼 수 있고 유료 플랜을 이용하면 slack notification를 받을 수 있다.

테스트 소스: [https://github.com/cwyang/my-blog/tree/master/2022-03-crashdump](https://github.com/cwyang/my-blog/tree/master/2022-03-crashdump)

```
    sentry_options_t *options = sentry_options_new();
    sentry_options_set_release(options, "my-test-project@0.0.1");
    sentry_options_set_symbolize_stacktraces(options, 1);
    sentry_options_set_environment(options, "development");
    sentry_options_set_release(options, "test-example-release");
    sentry_options_add_attachment(options, "./Makefile");
```

![](https://blog.kakaocdn.net/dn/wYEPf/btruXY7cohH/HXrErpKExKzT7Naq9sFYFk/img.png)