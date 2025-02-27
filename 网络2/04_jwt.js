/**
 * jwt(json web token)，本质就是一串字符串，保存一些数据
 * jwt 由三部分组成：header、payload、signature。主体信息在 payload
 * jwt 难以被篡改和伪造。这是因为有第三部分的签名存在
 * 
 * header 标识签名算法和令牌类型
 * payload 标识主题信息（一些数据），包括令牌过期时间、发布时间、发行者、主体内容等
 * signature 使用特定的算法对前面两部分进行加密，得到的加密结果
 * 在秘钥不被泄露的前提下，一个验证通过的 token 是值得被信任的
 */