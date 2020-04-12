# HTTPS

HTTPS = HTTP + TLS(Transport Layer Security)/SSL(Secure Sockets Layer)

## 层次

HTTP
TLS/SSL
TCP

## 优势

信息加密
完整性校验
身份认证

## 主要算法

散列函数（MD5 SHA）：验证信息的完整性
对称加密（AES DES RC4）：采用协商的密钥对数据加密
非对称加密（RSA ECC DH）：实现身份认证和密钥协商

# 对称加密

对称加密时最快速、最简单的一种加密方式，加解密用的是同样的密钥（sercet key）  
主流的有 AES 和 DES

## AES

加密算法是 128，对应的密钥是 16 位  
加密算法是 256，对应的密钥是 32 位

# 非对称加密

单向函数顺向计算起来非常容易，求逆非常困难。 x f(x)

## RSA 加密算法

公钥加密 私钥解密： 传输数据

A( A 的公钥 A 的私钥 B 的公钥)
B( B 的公钥 B 的私钥 A 的公钥)
传输数据时，A 用 B 的公钥加密数据，传给 B，B 用自己的私钥解密

# 哈希

作用：
给一个任意长度的数据生成一个固定长度的数据

安全性：
可以根据数据 X 计算出哈希值 Y，但是无法反推

没有加解密的功能

## 哈希碰撞

长度固定，所以会碰撞，增大哈希值的取值空间，可以防止哈希碰撞

## 哈希分类

哈希= 摘要（digest） = 校验值（chunksum） = 指纹（fingerPrint）

哈希分 2 种

1. 普通哈希用来做完整性校验，流行的是 MD5
2. 加密哈希用来做加密，目前最流行的是 SHA256（Secure Hash Algorithm）系列

# 数字签名

私钥加密 公钥解密： 数据签名

# 数字证书

可信的第三方颁发的，证明所有人身份以及所有人拥有某个公钥的电子文档

1. 服务器把公钥注册到数字认证机构（CA）
2. CA 用自己的私钥将服务器的公钥进行数字签名证书，并颁发数字证书
3. 服务器把证书发布给客户端
   （CA 公钥已经事先置入到浏览器或操作系统中）
4. 客户端拿到服务器的数字证书后，使用 CA 公钥确认服务器的数字证书的真实性
5. 把数据用服务器公钥加密后发送

# Diffie-Hellman 算法

密钥交换协议，可以让双发在不泄露密钥的情况下协商出一个密钥

# http

## 风险

1. 窃听风险 信息加密 对称加密 AES
2. 密钥传递 密钥协商 非对称加密 RSA ECC（椭圆曲线加密算法）
3. 信息篡改 完整性校验 散列算法 MD5 SHA
4. 身份冒充 CA 权威结构 散列算法 + RSA 签名

密钥的共享问题：非对称加密传输公钥，协商私钥，对称加密传输数据
证书：解决信任链的问题

# https 过程

http 握手在前

加密套件:TLS(协议)\_ECDHE(密钥交换协议)\_RSA(签名算法)\_WITH_AES_256_CBC(对称加密算法)\_SHA(消息认证码 hash 摘要)

1. client hello
   client 发送随机数 （随机数用于保证每次连接是唯一的）

2. server hello ， certificate， server key exchange， server hello done
   server 发送随机数，并告知自己用的加密套件
   server 发送服务器端证书
   server 把服务器的 DH 参数签名后发送给客户端

3. client key exchange, change cipher spec, encrypted handshark message
   client 把客户端 DH 参数（DH 算法所需要的参数）发送给服务器
   change cipher spec：客户端已经得到了连接参数的足够信息，已生成加密密钥，并切换到加密模式
   encrypted handshark message： 验证协商密钥是否正确

4. change cipher spec, encrypted handshark message

# session

session ID 的思想很简单，就是每一次对话都有一个编号（session ID）。如果对话中断，下次重连的时候，只要客户端给出这个编号，且服务器有这个编号的记录，双方就可以重新使用已有的"对话密钥"，而不必重新生成一把。

它的缺点在于 session ID 往往只保留在一台服务器上。

session ticket 就是为了解决这个问题而诞生的，目前只有 Firefox 和 Chrome 浏览器支持。客户端不再发送 session ID，而是发送一个服务器在上一次对话中发送过来的 session ticket。这个 session ticket 是加密的，只有服务器才能解密，其中包括本次对话的主要信息，比如对话密钥和加密方法。当服务器收到 session ticket 以后，解密后就不必重新生成对话密钥了
