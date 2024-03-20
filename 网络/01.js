/**
 * 完整的 url 地址
 * 协议 + 主机 + 端口 + 路径 + 参数 + hash
 * http://www.hhh.com:8080/ww?page=10&limit=10#jj
 */

/**
 * 请求行、请求头、请求体
 * 
 * 请求行是整个 http 报文的第一行字符串，它包含三个部分：请求方法 路径+参数+hash 协议和版本
 * 重点是请求方法：GET、POST，在 http 协议中，并没有规定只能使用 get post两种动作，甚至没有规定每种动作会带来怎样的变化
 * 而在实际的应用中，我们逐渐有了一些约定俗成的规范：
 * 1、动作通常有：GET、POST、PUT、DELETE，其中，GET和POST最为常见。
 * 2、GET和DELETE请求不能有请求体，而 POST 和 PUT 请求可以有请求体
 * 浏览器遵循了上面的规范，这带来了 GET 和 POST 的诸多区别。比如：由于 GET 请求没有请求体，所以要传递数据只能把数据放到 url 的参数中
 * 在浏览器中，获取数据一般使用的都是 GET 请求，比如：
 * 1、在地址栏输入地址并按下回车
 * 2、点击了某个 a 元素
 * 3、获取 css、js、字体等文件
 * 事实上，浏览器自动发出的请求基本都是 GET 请求，而 POST 请求需要开发者手动处理，比如在 form 表单中设置 method 为 POST
 * 
 * 请求头 header
 * 请求头是一系列的键值对，里面包含了诸多和业务无关的信息
 * 浏览器每次请求服务器都会自动附带很多的请求头，其实这些请求头大部分服务器是不需要的
 * 我们只需要关注以下几个请求头即可：
 * 1、Host：url地址中的主机
 * 2、User-Agent：客户端的信息描述
 * 3、Content-Type：请求体的消息是什么格式，如果没有请求体，这个字段是无意义的
 * 该字段的常见取值为：
 * 1、application/x-www-form-urlencoded，表示请求体的数据格式和 url 地址中参数的格式一样，比如：name=ww&age=18
 * 2、application/json 表示请求体的数据是 json 格式，比如 {"name": "ww", "age": 18}
 * 3、multipart/form-data 一种特殊的请求体格式，上传文件一般选择该格式
 * 
 * 请求体 body
 * 理论上，请求体可以是任意格式的字符串，但习惯上，服务器普遍能识别一下格式：
 * 1、application/x-www-form-urlencoded：属性名=属性值&属性名=属性值
 * 2、application/json：{"属性名": "属性值", "属性名": "属性值"}
 * 3、multipart/form-data：使用某个随机字符串作为属性之间的分隔符，通常用于上传文件
 * 由于请求体格式的多样性，服务器在分析请求体时可能无法知晓具体的格式，从而不知道如何解析请求体，
 * 因此，服务器往往要求在请求头中附带一个属性 Content-Type 来描述请求体使用的格式。
 * 列：Content-Type: application/x-www-form-urlencoded、Content-Type: application/json
 */