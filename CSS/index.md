### px 和 em 和 rem 的区别
* px 即像素，是相对于屏幕分辨率而言的，是一个绝对单位，但是具有一定的相对性。因为在同一设备上每个设备像素所代表的物理长度是固定不变的（绝对性），但在不同设备间每个设备像素所代表的物理长度是可以变化的（相对性）
* em 是相对单位，具体的大小要相对于父元素来计算，例如父元素的字体大小为 40px，那么子元素 1em就代表字体大小和父元素一样为 40px，0.5em就代表字体大小为父元素的一半即 20 px
* rem 是相对单位，具体的大小要相对于根元素(html)来计算，根元素的字体大小为 10px，那么子元素 10rem 就代表 100px

### 水平居中
* 水平方向居中常见的方式：
* 1、margin: 0 auto; margin-left 为 auto 时，margin-right 为 auto
* 2、弹性盒，display: flex; justify-content: center

### 垂直居中
* 通过 verticle-align: moddle 实现垂直居中
* 通过父元素设置伪元素 :before，然后设置子元素 verticle-align: middle 实现垂直居中
* 通过绝对定位实现垂直居中
* 通过 transform 实现垂直居中
* 使用弹性盒子居中

### 隐藏页面中的某个元素的方法有哪些？
* 隐藏元素可以分为3大类：
* 1、完全隐藏：元素从渲染数中消失，不占据空间
* 2、视觉上隐藏：屏幕中不可见，占据空间
* 3、语义上隐藏：读屏软件不可读，但正常占据空间
* 完全隐藏的方式有：设置 display: none、**为元素设置 hidden 属性**
* 视觉上隐藏的方式有：设置 opacity 属性为0，绝对定位的 left 和 top 值设置为 -999px、设置 margin-left 值为 -999、设置宽高为0、裁剪元素
* 语义上的隐藏方式为 aria-hidden 属性设置为 true 使读屏软件不可读

### 清除浮动的方法
* clear 清除浮动，{ clear: both; height: 0; overflow: hidden }
* 给浮动元素父级设置高度
* 父级同时浮动
* 父级设置成 inline-block，其 margin: 0 auto
* 给父级添加 overflow: hidden 清除浮动方法
* 万能清除法 after 伪类清楚浮动

### position 有哪些值，各自的用法如何？
* 目前在 css 中，有5种定位方案：
* 1、static：该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置
* 2、relative：相对定位的元素是在文档中的正常位置偏移给定的值，但是不影响其他元素的偏移
* 3、absolute：相对定位的元素并未脱离文档流，而绝对定位的元素则脱离了文档流。在布置文档流中其它元素时，绝对定位元素不占据空间。绝对定位元素相对于最近的非 static 祖先元素未定
* fixed：固定定位与绝对定位相似，但元素的包含块为 viewport 视口，该定位方式常用于创建在滚动屏幕时仍固定在相同位置的元素。
* sticky：粘性定位可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位

### BFC
* block formatting contexts，块级格式化上下文
* BFC 是一个独立的布局环境，BFC 内部的元素布局与外部互不影响
* 触发 BFC 的方式有很多，常见的有：
* 1、设置浮动
* 2、overflow 设置为 auto、scroll、hidden
* 3、position 设置为 absolute、fixed
* 常见的 BFC 应用有：
* 1、解决浮动元素令父元素高度塌陷的问题
* 2、解决非浮动元素被浮动元素覆盖问题
* 3、解决外边距垂直方向重合的问题

### CSS 中属性的计算过程是怎样的？
* 1、确定声明值：参考样式表中没有冲突的声明，作为 CSS 属性值
* 2、层叠冲突：对样式表有冲突的声明使用层叠规则，确定 CSS 属性值
* 3、使用继承：对仍然没有值的属性，若可以继承则继承父元素的值
* 4、使用默认值：对仍然没有值的属性，全部使用默认属性值

### CSS中的层叠规则
* CSS 中当属性值发生冲突时，通过层叠规则来计算出最终的属性值，层叠规则可以分为 3 块：
* 重要性：!important 设置该条属性值最重要，但是一般不推荐使用
* 专用性：专用性主要是指它能匹配多少元素，匹配得越少专用性越高
* 源代码次序：在重要性和专用性都一致的情况下，属性值取决于源代码的先后顺序

### CSS 引用的方式有哪些？
* 外联，通过 link 标签外部链接样式表
* 内联，在 head 标记中使用 style 标记定义样式
* 嵌入，在元素的开始标记里通过 style 属性定义样式

### link 和 @import 的区别
* 1、link 属于 HTML 标签，而 @import 完全是 CSS 提供的一种方式
* 2、加载顺序的差别
* 3、兼容性的差别
* 4、当使用 js 控制 DOM 去改变样式的时候，只能使用 link 标签，因为 @import 不是 DOM 可以控制的

### CSS3 中的 calc 函数
* calc()函数，主要用于指定元素的长度，支持所有CSS长度单位，运算符前后都需要保留一个空格
* calc(50% - 100px)

### 媒体查询, 视口宽度大于320px小于640px时 div 元素宽度变成 30%
* @media screen and (min-width: 320px) and (max-width: 640px) {
  div {
    width: 30%;
  }
}

### CSS3 过渡
* transition: all 1s;

### 动画
* animation: test 3s;
* 先定义，再去使用

### CSS3 变形
* transform: translate(100px, 100px)

### 什么是渐进式渲染？
* 渐进式渲染，也被称之为惰性渲染，指的是为了提高用户感知的加载速度，以尽快的速度来呈现页面的技术。
* 例如：骨架屏、图片懒加载、图片占位符、资源拆分

### 提升 CSS 的渲染性能
* 1、使用 id 选择器非常高效，因为 id 是唯一的
* 2、避免深层次的选择器嵌套
* 3、尽量避免使用属性选择器，因为匹配速度慢
* 4、使用渐进增强的方案
* 5、遵守 CSSLint 规则
* 6、不要使用 @import
* 7、避免过分重排(Reflow)
* 8、依赖继承
* 9、值缩写
* 10、避免耗性能的属性
* 11、背景图优化合并
* 12、文件压缩

### 层叠上下文
* HTML 中的根元素 HTML 本身就具有层叠上下文，称为”根层叠上下文“
* 普通元素设置 position 属性为非 static 值并设置 z-index 属性为具体数值，产生层叠上下文
* CSS3 中的新属性也可以产生层叠上下文