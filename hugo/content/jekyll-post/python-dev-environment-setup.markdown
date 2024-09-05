---
author: cwyang
comments: true
date: "2021-11-04T16:59:00Z"
header-img: https://blog.kakaocdn.net/dn/ev5OMS/btrjQDZRU0q/Ww1vkMwZACTFERgRAQeySK/img.png
tags:
- blog
- emacs
- python
title: Python 환경설정
toc: true
---
1.  [conda를 설치한다](https://docs.conda.io/en/latest/miniconda.html)
2.  conda venv 셋업
```bash
$ conda create -n venv_name
$ conda activate venv_name
```
4.  pip 설치 후 패키지 인스톨
```bash
(exp) $ conda install -c conda-forge pip
(exp) $ pip install package_name
(exp) $ python --version Python 3.10.0
```

개발에는 파이참이나 이맥스를 이용한다.  
이맥스 환경 설정을 정리해 보면:

1.  [use-package](https://jwiegley.github.io/use-package/installation/)
```bash
(exp) $ emacs --version
GNU Emacs 26.3
(exp) $ cat >> .emacs
(package-initialize)
(require 'package)
(add-to-list 'package-archives 
         '("melpa" . "https://melpa.org/packages/") t)
^D
```
이후 emacs 실행후에 다음과 같이 `use-package`를 설치한다.
```
M-x package-refresh-contents RET
M-x package-install RET use-package RET
```
3.  [elpy](https://github.com/jorgenschaefer/elpy) 설치
```elisp
(exp) $ cat >> .emacs
(require 'use-package)
;; elpy
(use-package elpy
  :ensure t
  :config
  (advice-add 'python-mode :before 'elpy-enable))
  ;; use flycheck instead of flymake
  (when (load "flycheck" t t)
    (setq elpy-modules (delq 'elpy-module-flymake elpy-modules))
    (add-hook 'elpy-mode-hook 'flycheck-mode))
)
;; flycheck
(use-package flycheck
  :ensure t
  :config
  (global-flycheck-mode t)
  ;; note that these bindings are optional
  (global-set-key (kbd "C-c n") 'flycheck-next-error)
  ;; this might override a default binding for running a python process,
  (global-set-key (kbd "C-c p") 'flycheck-previous-error)
)
;; flycheck-pycheckers
(use-package flycheck-pycheckers
  :after flycheck
  :ensure t
  :init
  (with-eval-after-load 'flycheck
    (add-hook 'flycheck-mode-hook #'flycheck-pycheckers-setup))
  (setq flycheck-pycheckers-checkers
    '(mypy3 pyflakes))
)
^D
```
5.  `M-x python-mode` 실행하면 아래와 같이 Elpy가 활성화 됨.  
    ![](https://blog.kakaocdn.net/dn/ev5OMS/btrjQDZRU0q/Ww1vkMwZACTFERgRAQeySK/img.png)  
    `M-x elpy-config`로 설정을 확인하고 해당 화면에서 `flake8`을 설치한다.
```
Elpy Configuration
Emacs.............: 26.3
Elpy..............: 1.35.0
Virtualenv........: None
Interactive Python: python3 3.10.0 (/home/merona/miniconda3/envs/exp/bin/python3)
RPC virtualenv....: rpc-venv (/home/merona/.emacs.d/elpy/rpc-venv)
Python...........: python 3.8.10 (/home/merona/.emacs.d/elpy/rpc-venv/bin/python)
Jedi.............: 0.18.0
Autopep8.........: 1.6.0
Yapf.............: 0.31.0
Black............: 21.10b0
Syntax checker....: Not found (flake8)
```
뭔가 꼬여서 잘 안되면 `M-x elpy-rpc-reinstall-virtualenv` 로 가상환경을 다시 셋업한다.

-   참조: [https://gist.github.com/cwyang/e4683a491fd525e9270fb36bf44ca5a4](https://gist.github.com/cwyang/e4683a491fd525e9270fb36bf44ca5a4)