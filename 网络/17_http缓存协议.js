/**
 * 这里的缓存跟服务器有关系，它们两方(浏览器和服务器)自己协商，然后得到这个缓存
 * 缓存的基本原理
 * 在一个 C/S 结构中，最基本的缓存分为两种：
 * 1、客户端缓存 2、服务器缓存
 * 
 * 所谓客户端缓存，是将某一次的响应结果保存在客户端（比如浏览器）中，而后续的请求仅需要从缓存中读取即可，极大的降低了服务器的处理压力
 * 
 * 来自服务器的缓存指令
 * 当客户端发出一个 get 请求到服务器，服务器可能有以下的内心活动：你请求的这个资源，我很少会改动它，干脆你把它缓存起来，以后就不要来烦我
 * 服务器在响应头中药加入一下内容：
 * Cache-Control: max-age=3600：希望把这个资源缓存起来，缓存时间是 3600 秒
 * ETag: W/"121-171jkakjkf"：这个资源的编号是 W/"121-171jkakjkf"
 * Date: Thu, 30 Apr 2024 12:33:11：响应这个资源的服务器时间是格林威治时间
 * Last-Modified: Thu, 30 Apr 2024 12:33:11：这个资源的上一次修改时间是格林威治时间
 * 如果客户端是其他应用程序，可能并不会理会服务器的愿望，也就是说，可能根本不会缓存任何东西。
 * 如果是浏览器的话，当看到服务器的这个响应头就会忙起来：
 * 1、浏览器把这次请求得到的响应体缓存到本地文件中
 * 2、浏览器标记这次请求的请求方法和请求路径！！！！！！
 * 3、浏览器标记这次缓存的时间是 3600 秒
 * 4、浏览器记录服务器的响应时间是格林威治时间
 * 5、浏览器记录服务器给予的资源编号
 * 6、浏览器记录资源的上一次修改时间是格林威治时间（上次 文件修改时间）
 * 这次记录非常重要，它为以后浏览器要不要去请求服务器提供了各种依据
 * 
 * 来自客户端的缓存指令(协商缓存 请求服务器带缓存的请求)
 * 准备再次请求 GET /index.js 时，想起我需要的东西在不在缓存里？此时，客户端会到缓存中去寻找是否缓存的资源
 * 1、缓存中是否有匹配的请求方法和路径？
 * 2、如果有，该缓存资源是否还有效
 * 以上两个验证会导致浏览器产生不同的行为
 * 缓存有效
 * 当浏览器发现缓存有效时，完全不会请求服务器，直接使用缓存即可得到结果。此时，如果断开网络，资源仍然可用，这种情况
 * 会极大的降低服务器压力，但当服务器更改了资源后，浏览器是不知道的，只要缓存有效，它就会直接使用缓存
 * 缓存无效
 * 当浏览器发现缓存已经过期，它并不会简单的把缓存删除，而是问问服务器，这个缓存还能不能继续使用。于是，浏览器向服务器发出了一个带缓存的请求，又称之为协商缓存。
 * 所谓带缓存的请求，无非就是加入了以下的请求头：
 * If-Modified-Since: Thu, 30 Apr ...：这个资源上一次修改时间是Thu, 30 Apr，请问这个资源在这个时间之后有发生变动吗？
 * If-None-Match: W/"121-171jjkkj"：这个资源的编号是 W/"121-171jqwjqj"，请问这个资源的编号发生了变动吗？
 * 服务器可能会产生两种情况：
 * 1、缓存已经失效
 * 2、缓存仍然有效
 * 如果是缓存已经失效，那么服务器再次给予一个正常的响应（响应码 200 带响应体），同时可以附带上新的缓存指令，这样依赖客户端就会重新缓存新的内容
 * 如果服务器觉得缓存仍然有效，可以通过一种方式告诉浏览器：
 * 一、响应码为 304 Not Modified
 * 二、无响应体
 * 三、乡响应头带上新的缓存指令
 * 这样一来，就相当于告诉浏览器，缓存资源仍然可用，给你一个新的缓存时间，你那边更新一个就可以了
 */