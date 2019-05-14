# 微信小程序开发经验+

> 在开发微信小程序过程中遇到问题的一些解决方式/经验分享，另外共享几个通用组件

----
### # cache
为什么需要cache工具？
 - 微信api提供了[storage](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setStorage.html), 类似 localStorage `永久性存储?` (除用户主动删除或超一定时间被自动清理)
 - 希望可以提供类似 sessionStorage 的模拟，当次打开小程序/热启动内(本次使用期间)有效（冷启动清理）
 - 希望某个缓存一定时间内有效，类似 expire cookie
 - 可以更新expire缓存，但不改变其过期时间

``` javascript
import $cache, * as caches from 'path/to/./libs/cache.js'

 // localstorage 
 $cache.set('key', 1)
 $cache.get('key')   // 1
 
 // localstorage expire
 $cache.set('key', 1, 10000)
 $cache.get('key')   // 1, 10s内访问有效
 
 // localstorage  延续上次缓存时间，若上次没缓存，此次设置也将取消
 $cache.set('key', 1, true)
 $cache.get('key')   // 1
 
 // sessionstorage 
 $cache.session.set('key', 1)
 $cache.session.get('key')   // 1
 
 // remove 
 $cache.remove('key')
 $cache.session.remove('key')
```
----
### # PageModal

路由页面间的相互通信（限已存在路由历史记录中的路由）
: App 已注入   pages: new PageModal()

``` javascript
// page A
Page({
	data: {
		log: 'ori log content'
	},
	//..
	changeLog () {
		this.setData({ log: 'log changed.' })
	},
	onLoad() {
		// 页面栈, 建议：仅需要通信的页面加入栈中
		getApp().pages.add(this)
	},
	onUnload() {
	  	// 页面卸载关闭
		getApp().pages.delete(this)
	}
})

// page B
Page({
	//...
	doSomething() {
	 	// ..
	  	// 调起 page A  / changeLog
		getApp().pages.get('path/to/A').changeLog()
	},
})
```

----
### # page decorator

Page 装饰器实例，可扩展为mixin （组件已提供behaviors，不必要时不用mixin）
: App 已引用  import 'libs/pageDecorator.js'

``` javascript
// Page 装饰器实例 pageDecorator.js
const oriPage = Page

export default Page = (data) => {

  // PV统计
  const onLoad = data.onLoad;
  data.onLoad = function(...args) {
    RecordPV.call(this)
	// do something before oriPage onLoad
	// ..
    return onLoad && onLoad.call(this, ...args)
  }

  oriPage(data)
}

// Record PV
function RecordPV() {
  console.log('view the page : ', this.route)
  // sync serve..
  // fetch(apis.pv, data: { page: this.route })
}
```
----
### # fetch

封装请求，api模块化
_tip: 目的只是为了简化wx.request，统一作部分rule code拦截，以及error处理; _
_因业务场景不同，已取消 promise风格化、重试机制、auth请求加锁、请求取消等。_

``` javascript
// req
import fetch, { apis } from 'path/to/./core/fetch.js'

Page({
	req () {
		 fetch({
		  ...apis.order.getOrderList,
		  data: {
			page: 1,
			page_size: 10
		  },
		  succ: (res) => {
			console.log(res)
		  },
		  fail: (err) => {
			console.log(err)
		  },
		  done: () => {
			console.log('done')
		  }
		})
	}
})

```
----
### # 倒计时组件

提供简易倒计时功能

| Props | Description                    |
| ------------- | ------------------------------ |
| `time`      | 时间（秒）      |
| `format`   | 格式化显示， 默认：dd天hh时mm分ss秒     |
| `timeStyle`   | 时间style样式；默认： '' (::font/color 等可继承父级，一般不用配置)     |
| `symbolStyle`   |  时间symbol样式：默认：'' (::font/color 等可继承父级，一般不用配置)     |
| `sign`   |同时使用多个 countdown 组件时，需要 **sign** 标注唯一，通知时会回传sign     |
  
| Event | Description                    |
| ------------- | ------------------------------ |
| `running()`      | 倒计时进行中,  返回：**{ sign, time } **// time: 实时计时(s)      |
| `end()`   |倒计时结束后执行，返回:** { sign }**     |

----
### # 级联选择组件

提供弹窗形式cascader

| Props | Description                    |
| ------------- | ------------------------------ |
| `display`      | 显示/隐藏      |
| `options`   | 源数据     |
| `props`   | 可配置 级联 属性名， 默认：{ label: 'label', value: 'value', children: 'children' }   |
| `_default`   |  可设置默认选择项； 默认 []    |

| Event | Description                    |
| ------------- | ------------------------------ |
| `close()`      | 选择器关闭触发     |

``` javascript
 *  close
 *  @return
 *  { 
 *    type: 'cancel',  // cancel: 取消选择/点击遮罩层； submit: 确认
 *    valueIns: [],     // 返回已选择的下标；(深度层级)
 *    valueArr: [],     // 返回已选择的下标对应 option 内容
 *  }
```

----
### # 自定义navigationBar

组件为自定义navigationBar实例，暂无复杂配置；
提供了三种模式参考，`自定义单点` `模拟微信后退` `模拟微信菜单`  可依据自身业务自行定义。

| Props | Description                    |
| ------------- | ------------------------------ |
| `background`      | 背景色     |

![](https://www.mdeditor.com/images/logos/markdown.png)
> bar跟随滚动淡出实例.

----
### # 预检授权组件

提前检查授权状态，(已)授权后将完成原有操作

----
### # 生成海报组件

配置生成海报

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

![](https://www.mdeditor.com/images/logos/markdown.png)
> 海报实例.
