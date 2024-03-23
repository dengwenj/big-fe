/**
 * 为什么需要 cookie？
 * 客户端和服务器的传输使用的事 http 协议，http 协议是无状态的，什么是无状态，就是服务器不知道这一次请求的人，跟之前登录请求成功的人是不是同一个人
 */

/**
 * cookie 的组成
 * cookie 是浏览器中特有的一个概念，它就像浏览器的专属卡包，管理着各个网站的身份信息。
 * 每个cookie 就相当于是属于某个网站的一个卡片，它记录了下面的信息：
 * 1、key：键，比如【身份编号】
 * 2、value：值
 * 3、domain：域，表达这个 cookie 是属于哪个网站的，比如：dengwj.vip，表示这个 cookie 是属于 dengwj.vip 这个网站的
 * 4、path：路径，表达这个 cookie 是属于该网站的哪个基路径的，比如：/news，表示这个 cookie 属于 /news 这个路径的
 * 5、secure：是否使用安全传输
 * 6、expire：过期时间，表示该 cookie 在什么时候过期
 * 
 * 如果一个 cookie 同时满足一下条件，则这个 cookie 会被附带到请求中
 * 1、cookie 没有过期
 * 2、cookie 中的域和这次请求的域是匹配的，比如 cookie 中的域是 dengwj.vip，则可以匹配的请求域是 pro.dengwj.vip、www.dengwj.vip等
 * 比如 cookie 的域是 www.dengwj.vip ，则只能匹配 www.dengwj.vip 这样的请求域，cookie 是不在乎端口的，只要域匹配即可
 * 3、cookie 中的 path 和这次请求的 path 是匹配的，比如：/news，可以匹配 /news, /new/detail，不能匹配 /blogs
 * 4、验证 cookie 的安全传输，如果 cookie 的 secure 属性是 true，则请求协议必须是 https，否则不会发送该 cookie，如果 cookie 的 secure
 * 属性是 false，则请求协议可以是 http 或 https
 * 
 * 如果一个 cookie 满足了上述的所有条件，则浏览器会把它自动加入到这次请求中。
 * 具体加入的方式是，浏览器会将符合条件的 cookie 自动放置到请求头中。
 * cookie 中包含了重要的身份信息，永远不要把你的 cookie 泄漏给别人，否则，他人就拿到了你的证件，有了证件，就可以操作很多事情。
 */

/**
 * 如何设置 cookie
 * 由于 cookie 是保存在浏览器端的，同时，很多证件有事服务器颁发的
 * 所以，cookie 的设置有两种模式：
 * 1、服务器响应：这个模式是非常普遍的，当服务器决定给客服端颁发一个证件时，它会在响应的消息中包含 cookie，浏览器会自动的把 cookie 保存到卡包中。
 * 2、客户端自行设置：这种模式少见一些，不过也有可能会发生，比如用户关闭了某个广告，并选择了【以后不要再弹出】，此时就可以把这种小消息直接通过
 * 浏览器的 js 代码保存到 cookie 中，后续请求服务器时，服务器会看到客户端不想要再次弹出广告的 cookie，于是就不会再发送广告过来了。
 * 
 * 服务器端设置 cookie
 * 服务器可以通过设置响应头，来告诉浏览器应该如何设置 cookie
 * 响应头的格式设置：set-cookie: cookie1，set-cookie: cookie2
 * 通过这种模式，就可以在一次响应中设置多个 cookie 了，具体设置了多少个 cookie，设置什么 cookie，根据需要自行处理，
 * cookie的格式：键=值; path=?; domain=?; expire=?; max-age=?; secure; httponly
 * 每个 cookie 除了键值对时必须要设置的，其他的属性都是可选的，并且顺序不限
 * 当这样的响应头到达浏览器后，浏览器会自动的将 cookie 保存起来，如果 cookie 中已经存在一模一样的卡片，则会自动的覆盖之前的设置。
 * 1、path：设置 cookie 的路径，如果不设置，浏览器会将其自动设置为当前请求的路径。比如，浏览器请求的地址是 /login，服务器响应了一个 set-cookie: a=1,
 * 浏览器会将该 cookie 的path设置为请求的路径 /login
 * 2、domain：设置 cookie 的域，如果不设置，浏览器会自动将其设置为当前的请求域，比如浏览器请求的地址是 http://www.dengwj.vip，浏览器 cookie 的
 * domain 是http://www.dengwj.vip，如果服务器响应了一个无效的域，浏览器是不认的
 * 3、expire：设置 cookie 的过期时间。绝对时间
 * 4、max-age：设置 cookie 的相对有效时间，比如设置 max-age 为 1000，浏览器在添加 cookie 时，会自动设置它的 expire 为当前时间加上 1000秒，作为过期时间
 * 5、secure：设置 cookie 是否是安全连接，如果设置了该值为 true，则表示该 cookie 后续只能随着 https请求发送，不设置都可以发送
 * 6、httponly：设置 cookie 是否仅能用于传输。如果设置了该值，表示该 cookie 仅能用于传输，而不允许在浏览器通过 js 获取，这对防止跨站脚本攻击（xss）会很有用
 * 
 * 列：set-cookie: token=123; path=/; max-age=3600; httponly
 * 浏览器会创建的 cookie 是
 * key: token
 * value: 123
 * path: /
 * domain: dengwj.vip
 * expire: 当前时间加上3600秒
 * secure: false 只要满足要求，任何请求都可以携带这个 cookie
 * httponly: true 不允许 js 获取该 cookie
 * 
 * 请求头里: cookie: token=123; 
 */

/**
 * 如何删除浏览器的 cookie？
 * 如果要删除浏览器的 cookie，只需要让服务器响应一个同样的域、同样的路径、同样的key，max-age=-1 表示该cookie过期了，就删除了
 * 
 * 无论是修改还是删除，都要注意 cookie 的域和路径，因为完全可能存在域或路径不同，但 key 相同的 cookie，因此无法仅通过 key 确定是哪个 cookie
 */

/**
 * 客户端设置 cookie
 * 既然 cookie 是存放在浏览器的，所以浏览器向 JS 公开了接口，让其可以设置 cookie
 * document.cookie = "键=值; path=?; domain=?; expire=?; max-age=?; secure"
 * 可以看出，在浏览器设置 cookie，和服务器设置 cookie 的格式一样，只是有下面的不同
 * 1、没有 httponly，因为 httponly 本来就是为了限制在客户端访问的，既然是在客户端配置，自然失去了限制的意义。
 * 2、 path 的默认值。在服务器端设置 cookie 时，如果没有写 path，使用的是请求的 path。而在客户端设置 cookie时，
 * 也许根本没有请求发生，因此，path 在客户端设置时的默认值是当前网页的 path
 * 3、domain的默认值，和 path 同理
 */
