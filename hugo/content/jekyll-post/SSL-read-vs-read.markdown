---
author: cwyang
comments: true
date: "2009-10-21T14:48:00Z"
summary: 네트워크 프로그래밍시에 SSL 연결과의 자료전송도 필요하게 되면 SSL_read()와 SSL_write()를 써야하기 마련이다. 많은
  경우 SSL연결 뿐만이 아닌 일반 전송도 필요하므로, 프로그래머는 대개 아래와 같이 연결 종류에 무관한 wrapping API를 만들어서 진행하는데,
  이 경우 SSL_read()와 read()의 차이점을 알아야한다.
tags:
- diary
- SSL
- openssl
- programming
title: SSL_read()와 read()는 같은가요?
---
네트워크 프로그래밍시에 SSL 연결과의 자료전송도 필요하게 되면 SSL_read()와 SSL_write()를 써야하기 마련이다. 많은 경우 SSL연결 뿐만이 아닌 일반 전송도 필요하므로, 프로그래머는 대개 아래와 같이 연결 종류에 무관한 wrapping API를 만들어서 진행하는데, 이 경우 SSL_read()와 read()의 차이점을 알아야한다.

```c
ssize_t my_read(CONN_t conn, void *buf, size_t count)
{
	if (is_ssl(conn))
	   return SSL_read(get_ssl(conn), buf, count);
	else
	   return read(get_fd(conn), buf, count);
} 
```

SSL_read()는 이리 하여도 무관하나 SSL_write()는 count가 0일 경우의 행동이 결정되어 있지 않다. 즉 그리하여서는 안된다는 것이다. 따라서 SSL_write()는 아래와 같이해야한다.

```c
ssize_t my_write(CONN_t conn, void *buf, size_t count)
{
	if (is_ssl(conn))
	   return count ? SSL_write(get_ssl(conn), buf, count) : 0;
	else
	   return write(get_fd(conn), buf, count);
} 
```

이는 Blocking I/O의 경우이며, Non-blocking I/O일 경우에는 그냥 return value를 반환해서는 안되고, SSL_read(), SSL_write()후 SSL_get_error()를 통해 I/O결과를 검사하여 적절한 처리를 해야 한다. SSL_ERROR_WANT_READ, SSL_ERROR_WANT_WRITE 두가지 경우가 SSL_read(), SSL_write() 각각의 경우 모두 일어날 수 있는데, 이는 각각 해당 fd에 read가 가능해지는경우, write가 가능해지는 경우, 원래의 operation을 다시 호출하라라는 의미이다.

