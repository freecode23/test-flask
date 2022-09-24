- [Websockets with React and Python-Flask](#websockets-with-react-and-python-flask)
  - [client](#client)
    - [Pre-requisites](#pre-requisites)
    - [Install dependencies](#install-dependencies)
    - [Run](#run)
  - [server](#server)
    - [Pre-requisites](#pre-requisites-1)
    - [Initiate Virtualenv environment and install dependencies](#initiate-virtualenv-environment-and-install-dependencies)
    - [Run](#run-1)
  - [Proxy](#proxy)
    - [Nginx](#nginx)
  - [Troubleshooting](#troubleshooting)
    - [Unable to start app.py on EC2](#unable-to-start-apppy-on-ec2)
    - [Webcam permission not asked by browser when hosted](#webcam-permission-not-asked-by-browser-when-hosted)
    - [Websocket Connection timeout](#websocket-connection-timeout)

# Websockets with React and Python-Flask

## client

Install Node.js via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Pre-requisites

```sh
cd client
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install v16.16.0
nvm use v16.16.0
npm config set registry http://registry.npmjs.org/ --global
npm cache clear --force
```

### Install dependencies

```sh
npm install --verbose
```

### Run

```sh
npm start
```

## server

### Pre-requisites

```sh
sudo apt install ffmpeg libsm6 libxext6 python3-venv python3-pip bind9
sudo ufw allow Bind9
nslookup google.com 127.0.0.1
# Server:         127.0.0.1
# Address:        127.0.0.1#53

# Non-authoritative answer:
# Name:   google.com
# Address: 172.217.160.174
# Name:   google.com
# Address: 2404:6800:4009:822::200e
```

https://ubuntu.com/tutorials/install-and-configure-nginx#2-installing-nginx


### Initiate Virtualenv environment and install dependencies

```sh
cd server/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run

```sh
python3 app.py
```

## Proxy


### Nginx

Use [server/proxy/nginx.conf](./server/proxy/nginx.conf) for nginx configuration.

```sh
```

## Troubleshooting

Helpful in context of this app:
- https://jameshfisher.com/2018/02/05/dont-use-nscd/
- https://serverspace.io/support/help/configure-bind9-dns-server-on-ubuntu/
- https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/


### Unable to start app.py on EC2

From activated virtual env:

```sh
# strace -e trace=connect,socket,bind,listen,getsockname -f bash -c 'python3 app.py'
strace: Process 3778 attached
[pid  3778] +++ exited with 0 +++
--- SIGCHLD {si_signo=SIGCHLD, si_code=CLD_EXITED, si_pid=3778, si_uid=1000, si_status=0, si_utime=0, si_stime=0} ---
strace: Process 3779 attached
[pid  3777] socket(AF_INET, SOCK_STREAM|SOCK_CLOEXEC, IPPROTO_IP) = 5
[pid  3777] bind(5, {sa_family=AF_INET, sin_port=htons(5500), sin_addr=inet_addr("127.0.0.1")}, 16) = 0
[pid  3777] listen(5, 128)              = 0
[pid  3777] getsockname(5, {sa_family=AF_INET, sin_port=htons(5500), sin_addr=inet_addr("127.0.0.1")}, [16]) = 0
strace: Process 3780 attached
[pid  3780] socket(AF_UNIX, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 6
[pid  3780] connect(6, {sa_family=AF_UNIX, sun_path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
[pid  3780] socket(AF_UNIX, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 6
[pid  3780] connect(6, {sa_family=AF_UNIX, sun_path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
^Cstrace: Process 3777 detached
strace: Process 3779 detached
strace: Process 3780 detached
KeyboardInterrupt
2022-09-24T06:24:31Z

# cat /proc/sys/net/core/somaxconn
4096
```

More aggressive suggestion at https://serverfault.com/a/1031309

### Webcam permission not asked by browser when hosted

Visit `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

https://stackoverflow.com/a/67694562

Use ngrok to serve temporarily on https and then configure an actual domain name solution for production.

```sh
ngrok http 3000
```
- https://www.freecodecamp.org/news/how-to-secure-your-websocket-connections-d0be0996c556/
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04


### Websocket Connection timeout

http://nginx.org/en/docs/http/websocket.html

> By default, the connection will be closed if the proxied server does not transmit any data within 60 seconds. This timeout can be increased with the proxy_read_timeout directive. Alternatively, the proxied server can be configured to periodically send WebSocket ping frames to reset the timeout and check if the connection is still alive.
