---
author: cwyang
comments: true
date: "2021-01-20T15:02:41Z"
excerpt: 도커허브에서 무료사용자들에 대해 pul rate limit를 부과하기 시작했다. ip별 6시간에 100번, 무료사용자 id하나에 대해
  6시간에 200번. 연구소 기계들이 NAT아래에 있다보니 이미지 몇개 당겨오다보면 금방 한계에 부딪히게 되고 만다. 쿠버네티스 파드가 뜨지 않는다.
header-img: /assets/images/harbor/harbor03.png
tags:
- blog
- docker
- dockerhub
- harbor
- container
- k8s
- kubernetes
title: 도커허브 이미지 풀 제약을 하버로 해결하기
toc: true
---

## TL; DR
- 이미지 다운이 막혔어요. 도커허브 미워요.
- 하버 짱이에요.

## 도커허브에서 무턱대고 이미지를 당기다보면 에러가 난다.

도커허브에서 무료사용자들에 대해 pul rate limit를 부과하기 시작했다

- ip별 6시간에 100번
- 무료사용자 id하나에 대해 6시간에 200번

연구소 기계들이 NAT아래에 있다보니 이미지 몇개 당겨오다보면 금방 한계에 부딪히게 되고 만다. 쿠버네티스 파드가 뜨지 않는다.

```
NAME             READY   STATUS             RESTARTS   AGE
pod/test         2/3     ImagePullBackOff   0          11m
```

        
로그를 보면 아래와 같이 도커허브에서 알려주는 `Too Many Requests` 메세지가 보인다.

```

Normal   Pulling    7m4s (x3 over 8m22s)    kubelet   Pulling image "alpine:latest"
Warning  Failed     6m50s (x2 over 8m8s)    kubelet   Failed to pull image "alpine:latest": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/alpine:latest": failed to copy: httpReaderSeeker: failed open: unexpected status code https://registry-1.docker.io/v2/library/alpine/manifests/sha256:d9a7354e3845ea8466bb00b22224d9116b183e594527fb5b6c3d30bc01a20378: 
  429 Too Many Requests - Server message: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit
Warning  Failed     6m50s (x3 over 8m8s)    kubelet   Error: ErrImagePull
Warning  Failed     3m23s (x12 over 7m18s)  kubelet   Error: ImagePullBackOff
```
이 상황을 타개하기 위해 이미지 레지스트리 서버인 [Harbor](https://goharbor.io/)를 설치하기로 했다.
                        
[다운로드 페이지](https://github.com/goharbor/harbor/releases)에서 인스톨러를 다운받은 이후 `harbor.yml.tmpl`을 `harbor.yml`로 바꾼후 안의 내용을 보고 수정한다. TCP port와 SSL인증서 값을 설정한 후 설치하면 바로 구동된다. 

```

[cwyang@jupiter harbor]$ sudo ./install.sh
[Step 0]: checking if docker is installed ...
Note: docker version: 19.03.6
...
Creating redis ...
Creating harbor-core ...
Creating nginx ...
Creating harbor-jobservice ...
✔ ----Harbor has been installed and started successfully.----
```

웹브라우저로 접속하고, admin password를 바꾼 후, proxy cache를 설정해보자.
하버 프락시 캐시를 설정하고 사용자가 프락시 캐시를 요청하면 하버는 이미지를 origin에서 받아서 제공하는 한편 그를 저장해 두고 다음부터는 저장된 이미지를 제공한다. 이미지 요청이 오면 origin 서버로 확인을 하게 되는데 다음과 같이 4가지 경우를 구분하여 처리한다.

- 이미지가 안바뀜 → 저장된 이미지 제공
- 이미지가 바뀜 → 새 이미지를 다운받아 제공
- origin에 연결안됨 → 저장된 이미지 제공
- 이미지가 삭제됨 → 이미지 제공하지 않음

하버가 매 요청마다 origin에 확인을 할 때 `HEAD` 요청을 이용하는데,
도커허브 ratelimiter가 `HEAD`는 (현재까지는) 무제한 허용을 해 주기 때문에 안심하고 사용할 수 있다.

## 하버 설정하기 

레지스트리 메뉴에서 새 엔드포인트를 생성한다

![엔드포인트 생성](/assets/images/harbor/harbor01.png)

그 다음에는 프로젝트 메뉴에서 프락시 캐시 타입의 프로젝트를 생성한다.

![프락시 캐시 프로직트  생성](/assets/images/harbor/harbor02.png)

## 설정된 주소로 컨테이너 이미지 가져오기
이제 됐다. 사용하기 위해서는 이미지 URL 앞에 `<harbor_server_name>/<proxy_project_name>/`을 붙여주어야한다. 그리고 toplevel 이미지를 당기려면 앞에 `library` path를 붙여준다.


```
​​# pull alpine:latest
​​cwyang@cwyang ~ $ docker pull jupiter.soosanint.com:4433/proxy/library/alpine:latest
​​latest: Pulling from proxy/library/alpine
​​596ba82af5aa: Pull complete
​​Digest: sha256:d9a7354e3845ea8466bb00b22224d9116b183e594527fb5b6c3d30bc01a20378
​​Status: Downloaded newer image for jupiter.soosanint.com:4433/proxy/library/alpine:latest
​​jupiter.soosanint.com:4433/proxy/library/alpine:latest
​​
​​#pull networkservicemesh/test-common:v0.2.0
​​cwyang@cwyang ~ $ docker pull jupiter.soosanint.com:4433/proxy/networkservicemesh/test-common:v0.2.0
​​v0.2.0: Pulling from proxy/networkservicemesh/test-common
​​89d9c30c1d48: Pull complete
​​139dffae8422: Pull complete
​​Digest: sha256:6ba5743738a0244d9c7f69ff2f2ac1fbd7598eb8ff2f9b40ddba8c533d918b21
​​Status: Downloaded newer image for jupiter.soosanint.com:4433/proxy/networkservicemesh/test-common:v0.2.0
​​jupiter.soosanint.com:4433/proxy/networkservicemesh/test-common:v0.2.0
​​cwyang@cwyang ~ $
```

이후 콘솔을 확인하면 아래와 같이 캐시된 것을 알 수 있다.

![저장된 컨테이너 이미지들](/assets/images/harbor/harbor03.png)

기본적으로 캐시된 이미지는 7일간 유효하다. 설치시에 `--with-trivy` 옵션을 주면 저장 이미지에 대해서 취약점 스캐닝을 하는 `trivy`가 같이 설치된다.

이제 파드 매니페스트 파일에서 이미지 레지스트리주소를 하버 주소로 바꾸고 사용하도록 하자.
