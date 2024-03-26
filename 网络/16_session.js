/**
 * cookie 的缺陷
 * cookie  是保存在客户端的，虽然为服务器减少了很多压力，但某些情况下，会出现麻烦，比如，验证码，就要使用 session
 * session 也是键值对，它保存在服务器端，通过 sessionid 和客户端关联
 * 
 * cookie 和 session 的区别是什么？
 * 1、cookie 的数据保存在浏览器，session 的数据保存在服务器
 * 2、cookie 的存储空间有限，session 的存储空间不限
 * 3、cookie 只能保存字符串，session 可以保存任意类型的数据
 * 4、cookie 中的数据容易被获取，session 中的数据难以获取
 * 
 * 如何消除 session
 * 1、过期时间：当客户端长时间没有传递 sessionid 过来时，服务器可以在过期时间之后自动清除 session
 * 2、客户端主动通知：可以使用 js 监听客户端页面关闭或其他退出操作，然后通知服务器清除 session
 */
