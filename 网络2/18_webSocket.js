/**
 * 实时场景的旧处理方案
 * 由于 http 协议是请求-响应模式，请求必须在前，响应必须在后，这就导致了服务器无法主动的把消息告诉客户端
 * 短轮询和长轮询就是使用的 http 协议
 * 
 * 1、短轮询：实现短伦旭是非常简单的，客户端只需要设置一个计时器不断发送请求即可
 * 这种方案的缺陷是非常明显的：
 * - 会产生大量无意义的请求
 * - 会频繁打开关闭连接
 * - 实时性并不高
 * 
 * 2、长轮询：让每一次请求和响应都是都意义的，等有数据了，服务器才响应。
 * 但长轮询仍然存在问题：
 * - 客户端长时间收不到响应会导致超时，从而主导断开和服务器的连接，这种情况是可以处理的，但 ajax 请求因为超时而结束时，立即重新发送请求到服务器
 * - 由于客户端可能过早的请求了服务器，服务器不得不挂起这个请求直到新消息的出现。这会让服务器长时间的占用资源却没什么实际的事情可做
 * 
 * WebSocket(持久连接的协议，它利用 http 协议完成握手，然后通过 TCP 连接通道发送消息，服务器可以主动推消息)
 * - WebSocket 也是建立在 TCP 协议之上的，利用的是 TCP 全双工通信的能力
 * - 使用 WebSocket，会经历两个阶段：握手阶段、通信阶段
 * WebSocket 的缺点：
 * 1、兼容性：WebSocket 是 html5 新增的内容，因此旧版本的浏览器并不支持
 * 2、维持 TCP 连接需要消耗资源：对于那些消息量少的场景，维持 TCP 连接确实会造成资源的浪费
 * WebSocket 握手：
 * 当客户端需要和服务器使用 WebSocket 进行通信时，首先会使用 http 协议完成一次特殊的请求响应，这一次请求响应就是 WebSocket 握手
 * 在握手阶段，首先由客户端向服务器发送一个请求，请求地址格式：
 * 使用 http: ws://pumu.com/api
 * 使用 https wss://pumu.com/api
 * 请求头如下：
 * - Connection: Upgrade 后续我们别用 http 了，升级
 * - Upgrade: websocket 后续的协议升级为 websocket
 * - Set-WebSocket-Version: 13 使用 websocket 协议版本
 * - Sec-WebSocket-Key: YWjkjqwkjkjqjkk== 唯一的key
 * 服务器如果同意，就应该响应下面的消息：
 * - HTTP/1.1 101 Switching Protocols 马上换协议
 * - Connection: Upgrade 协议升级了
 * - Upgrade: websocket 升级到 websocket
 * - Sec-WebSocket-Accept: Zkjwkjwkjkejkjqkj 唯一值
 * 握手完成，后续消息收发不再使用 http，任何一方都可以主动发消息给对方
 */