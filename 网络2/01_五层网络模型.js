/**
 * 网络的五层模型
 * 从上到下分别为：应用层、传输层、网络层、数据链路层、物理层。在发送消息时，消息从上到下进行打包，每一层会在上一层基础上加包，
 * 而接收消息时，从下到上进行解包，最终得到原始信息
 * 1、应用层：主要面向互联网中的应用场景，http协议、DNS、ftp
 * 2、传输层：TCP 协议是为了保证数据可靠的传输，而 UDP 协议则是一种无连接的广播
 * 3、网络层：主要解决如何定位目标以及如何寻找最优路径的问题，IP
 * 4、数据链路层：MAC 地址
 * 5、物理层：要解决二进制数据到信号之间的互转问题
 */