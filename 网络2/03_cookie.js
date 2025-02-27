/**
 * http 协议无状态，没有状态就不知道这次请求的人是谁，需要保存
 * 每个 cookie 就相当于是属于某个网站的一个卡片，它记录了下面的信息：
 * key：键
 * value： 值
 * domain：域，表达这个 cookie 是属于哪个网站的
 * path：路径，表达这个 cookie 是属于该网站的哪个基路径
 * secure：是否使用安全传输
 * expire：过期时间，表示该 cookie 在什么时候过期
 * 
 * 当浏览器向服务器发送一个请求的时候，如果一个 cookie 同时满足以下条件，则这个 cookie 会被附带到请求中
 * 1、cookie 没有过期
 * 2、cookie 中的域和这次请求的域是匹配的，子域可以匹配主域
 * 3、cookie 中的 path 和这次请求的 path 是匹配的
 * 4、验证 cookie 的安全传输，secure 属性是 true，则请求协议必须是 https
 * 如果一个 cookie 满足了上述的所有条件，则浏览器会把自动加入到这次请求中
 * 
 * 如何设置 cookie
 * 由于 cookie 是保存在浏览器端，同时，很多证件又是服务器颁发的
 * Cookie 的设置有两种模式：
 * 1、服务器响应，set-cookie，自动保存
 * 2、客户端自行设置
 */