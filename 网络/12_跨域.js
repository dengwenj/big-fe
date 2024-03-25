/**
 * 解决跨域
 * 1、代理适用的场景是：生产环境不发生跨域，但开发环境发生跨域，只需要在开发环境使用代理解决跨域即可，这种代理又称之为开发代理
 * 
 * 2、CORS是基于 http1.1 的一种跨域解决方案，它的全称是 Cross-Origin-Resource-Sharing，跨域资源共享
 * 它的总体思路是：如果浏览器要跨域访问服务器的资源，需要获得服务器的允许
 * 针对不同的请求， CORS 规定了三种不同的交互模式，分别是：简单请求、需要预检的请求、附带身份凭证的请求
 * 
 * 简单请求的判定：当浏览器同时满足以下条件时，浏览器会认为它是一个简单请求
 * 一、请求方法属于下面的一种：GET、POST、head
 * 二、请求头仅包含安全的字段，常见的安全字段：Accept、Accept-Language、Content-Type、DPR、Downlink、Save-Data、Viewport-Width、Width
 * 三、请求头如果包含 Content-Type，仅限下面的值之一：text/plain、multipart/form-data、application/x-www-form-urlencoded
 * 如果以上三个条件同时满足，浏览器判定为简单请求
 * 如果是简单请求就进入这个一个规则，简单请求的交互规范：
 * 当浏览器判定某个 ajax 跨域请求是简单请求时，会发生以下的事情
 * 一、请求头中会自动添加 Origin 字段 Origin: http://demo.com
 * 二、服务器响应头中应包含 Access-Control-Allow-Origin，该字段的值可以是： 1、* 表示都能访问、1、具体的源
 * 服务器也可以维护一个可被允许的源列表，如果请求的 Origin 命中该列表，才响应 * 或具体的源
 * 请求体：Origin: http://demo.com、响应体：Access-Control-Allow-Origin: http://demo.com
 * 
 * 需要预检的请求
 * 如果浏览器不认为是一种简单请求，就会按照下面的流程进行
 * 1、浏览器发送预检请求，询问服务器是否允许
 * 预检请求，它的目的是询问服务器，是否允许后续的真实请求，预检请求没有请求体，它包含了后续真实请求要做的事情
 * 预检请求有以下特征：请求方法为 OPTIONS、没有请求体、请求头中包含 Origin: 请求的源，Access-Control-Request-Method: 后续真实请求将使用的请求方法，Access-Control-Request-Headers: 后续的真实请求会改动的请求头
 * 2、服务器允许
 * 服务器收到预检请求后，可以检查预检请求中包含的信息，如果允许这样的请求，需要响应下面的消息格式
 * 对于预检请求，不需要响应任何的消息体，只需要在响应头中添加
 * Access-Control-Allow-Origin: http://demo.com，表示允许的源
 * Access-Control-Allow-Methods: POST，表示允许的后续真实的请求方法
 * Access-Control-Allow-Headers: a, b, content-type，表示允许改动的请求头
 * Access-Control-Max-age: 40000，告诉浏览器，多少秒内，对于同样的请求源、方法、头、都不需要再发送预检请求了
 * 3、浏览器发送真实请求
 * 4、服务器完成真实的响应
 * 
 * 附带身份凭证的请求（要预检）
 * 默认情况下，ajax 的跨域请求并不会附带 cookie，这样一来，某些需要权限的操作就无法进行，不过可以通过简单的配置就可以实现附带 cookie
 * Access-Control-Allow-Credentials: true
 * 对于一个附带身份凭证的请求，若服务器没有明确告知，浏览器仍然视为跨域被拒绝
 * 对于附带身份凭证的请求，服务器不得设置 Access-Control-Allow-Origin 的值为 *
 * 
 * 在跨域访问时，JS 只能拿到一些最基本的响应头，如：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，
 * 如果要访问其他头，则需要服务器设置本响应头
 * Access-Control-Expose-Headers 响应头让服务器把允许浏览器访问的头放入白名单：Access-Control-Expose-Headers: authorization, a, b
 * 这样 JS 就能够访问指定的响应头了
 * 
 * 3、JSONP
 * 在 CORS 出现之前，人们想了一种奇妙的办法来实现跨域，就是 JSONP
 * JSONP的做法是：当需要跨域请求时，不使用 AJAX，转而生成一个 script 元素去请求服务器，由于浏览器并不阻止
 * script 元素的请求，这样请求可以到服务器。服务器拿到请求后，响应一段 JS 代码，这段代码实际上是一个函数的调用，
 * 调用的是浏览器预先生成好的函数，并把浏览器需要的数据作为参数传递到函数中，从而间接的把数据传递给浏览器。
 * JSONP 有着明显的缺点，只能支持 GET 请求
 */
 