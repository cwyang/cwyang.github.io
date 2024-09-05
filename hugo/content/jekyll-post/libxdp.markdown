---
author: cwyang
comments: true
date: "2022-03-11T09:36:43Z"
excerpt: eBPF를 꼭 커널 프로그래머들만 사용해야하는가? 꼭 그렇지많은 않다. 커널의 주요 실행 포인트들에서 eBPF를 위한 후킹 포인트를
  제공하고 있기 때문에 종래의 top, iostat, vmstat, perf등보다 상세한 시스템 모니터링을 위해 사용할 수 있다. 넷플릭스 SRE팀의
  브렌단 그렉이 eBPF를 이용한 여러가지 도구를 만들어 발표한 이후 SRE, 데브옵스 직무로부터 많은 관심을 받고 있다.
header-img: /assets/images/eBPF.png
tags:
- blog
- ebpf
- sre
- xdp
- libbpf
title: eBPF와 libbpf
toc: true
---
## eBPF
![eBPF](/assets/images/eBPF.png)

[eBPF](https://ebpf.io/)는 커널의 여러 부분에서 프로그래밍을 쉽고 안전하게 할 수 있게 해 준다.

BPF는 버클리 패킷 필터에서 나온 약자이지만 현재의 eBPF (extended BPF)는 패킷 필터라는 개념을 넘어섰고
커널 모드에서 코드를 안전하게 구동시키기 위한 도구로 진화했다. C와 유사한 문법으로 코드를 작성하면
안전 실행 여부를 확인한 후에 적재할 수 있도록 한다.

eBPF를 꼭 커널 프로그래머들만 사용해야하는가? 꼭 그렇지많은 않다.
커널의 주요 실행 포인트들에서 eBPF를 위한 후킹 포인트를 제공하고 있기 때문에
종래의 top, iostat, vmstat, perf등보다 상세한
시스템 모니터링을 위해 사용할 수 있다. 넷플릭스 SRE팀의 브렌단 그렉이 eBPF를 이용한 여러가지 도구를 만들어 발표한 이후 [^1]
SRE, 데브옵스 직무로부터 많은 관심을 받고 있다. 

## BCC
eBPF 프로그래밍을 하기위해서는 [BCC (BPF Compiler Collection)](https://github.com/iovisor/bcc)을 사용했었다.
BCC는 eBPF 소스코드를 실행시에 native binary로 바꾸어준다.
이 때  target machine에 CLang과 커널헤더가 필요하다.
eBPF에서 커널과 인터페이스하려면 stable interface가 필요한데 커널은 항상 변하기 때문이다.
그래서 결과적으로 바이너리가 크고, 실행시 로딩타임이 있고, 타겟 머신에 커널 헤더가 있어야한다는 부담이 있다.

## libbpf
최근 커뮤니티에서 인기를 얻는 것이 [libbpf](https://github.com/libbpf/libbpf)이다. [^2][^3][^4]
실행시 [BPF Type Format (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html#:~:text=1.-,Introduction,info%20for%20source%2Fline%20information.)가 필요하기 때문에, 그의 지원을 위하여  커널 컴파일시 `CONFIG_DEBUG_INFO_BTF=y`
옵션을 넣어줘야한다.
libbpf는 해당 정보를 이용해서 타겟 호스트의 커널에 맞도로 컴파일된 BPF코드를 수정해서 로딩해준다.

최근 커널은 자신을 설명하는 BTF를 제공한다.
아래 명령을 수행하면 모든 커널 타입을 포함하는 vmlinux.h가 생성된다.
이것과 libbpf의 `bpf_helpers.h`만 가지면 eBPF에서 커널의 웬만한 것은 다 접근할 수 있다.
다만 [USDT support](https://lwn.net/Articles/753601/)등과 같이 아직 BCC가 필요한 부분도 남아있다.

    $ bpftool btf dump file /sys/kernel/btf/vmlinux format c > vmlinux.h

## libbpf BPF프로그램의 작성순서

- vmlinux.h 만들고
- Clang 10이상의 버젼으로 BPF 프로그램을 컴파일하고
- 컴파일된 오브젝트 파일에서 BPF 스켈리톤을 만들고
- BPF 스켈리톤헤더를 userspace 코드에 포함하여
- 컴파일한 BPF 오브젝트코드를 사용한다.

## 참고

[^1]: <https://www.amazon.com/Performance-Tools-Addison-Wesley-Professional-Computing/dp/0136554822>
[^2]: <https://nakryiko.com/posts/bcc-to-libbpf-howto-guide/>
[^3]: <https://nakryiko.com/posts/bpf-portability-and-co-re/>
[^4]: <https://www.brendangregg.com/blog/2020-11-04/bpf-co-re-btf-libbpf.html>
