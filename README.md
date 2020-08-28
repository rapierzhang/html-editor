# 开发目的
为了在运营活动中开发活动页面以及落地页，特此开发了html生成的器，用以节省运营活动页面的开发成本

# 目录

* 简介
* [页面布局简介](https://git.sogou-inc.com/bfo/html-editor/tree/master#%E4%B8%80-%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E7%AE%80%E4%BB%8B)
* 操作方式
* [元素插入](https://git.sogou-inc.com/bfo/html-editor/tree/master#1-%E5%85%83%E7%B4%A0%E6%8F%92%E5%85%A5)
* [元素删除](https://git.sogou-inc.com/bfo/html-editor/tree/master#2-%E5%85%83%E7%B4%A0%E5%88%A0%E9%99%A4)
* [元素更改位置](https://git.sogou-inc.com/bfo/html-editor/tree/master#3-%E5%85%83%E7%B4%A0%E6%9B%B4%E6%94%B9%E4%BD%8D%E7%BD%AE)
* [元素选择系统](https://git.sogou-inc.com/bfo/html-editor/tree/master#4-%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E7%B3%BB%E7%BB%9F)
* [事件](https://git.sogou-inc.com/bfo/html-editor/tree/master#5-%E4%BA%8B%E4%BB%B6)
* [特殊组件使用方法](https://git.sogou-inc.com/bfo/html-editor/tree/master#6-%E7%89%B9%E6%AE%8A%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
* [反馈元素（Toast, Dialog）的调用方法](https://git.sogou-inc.com/bfo/html-editor/tree/master#7-%E5%8F%8D%E9%A6%88%E5%85%83%E7%B4%A0toast-dialog%E7%9A%84%E8%B0%83%E7%94%A8%E6%96%B9%E6%B3%95)
* [注意事项](https://git.sogou-inc.com/bfo/html-editor/tree/master#8-%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

## 一. 页面布局简介
- 选中元素前
![页面布局1](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/1.png)
- 选中元素后
![页面布局2](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/2.png)

## 二. 操作方式
### 1. 元素插入

- 插入到根元素
![插入到根](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/3.png)
**右击**左侧元素列表，展示菜单**插入到Root**，点击插入
- 插入到其他元素内部
![插入到其他元素](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/4.png)
先选中需要被插入的元素，再**右击**需要插入的元素，最后点击插入
> 注：只有后面有**□**的，才能被插入
- 快捷插入
当插入之后，默认会选中新添加的元素，用以编辑，但如果想要连续向一个节点插入元素，可在插入时，按住<kbd>Alt</kbd>键，再插入

### 2. 元素删除

**双击**左侧元素或者右侧树，选中元素到可编辑状态，点击**删除节点**
![删除节点1](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/5.png)
![删除节点2](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/6.png)

### 3. 元素更改位置

- 如图
![更改元素位置](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/7.png)

### 4. 元素选择系统

- 选中模式
	单击选中元素，再次单击打开编辑**属性**菜单
	在选中元素的状态，按住<kbd>Alt</kbd>键,直接打开编辑**样式**菜单
- 取消选择
	![取消选择](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/8.png)

### 5. 事件

事件分两种：初始加载事件，绑定事件
- 初始加载事件：
	1. 双击Root元素到元素编辑模式
	2. 写入初始化执行的js(可绑定Toast，Dialog)
- 绑定事件：
	1. 双击选中View元素到元素编辑模式
	2. 填写触发事件后执行的js
	![事件绑定](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/9.png)

### 6. 特殊组件使用方法

- Swiper(滑动框)
	1. 插入滑动框
	2. 点击**+**
	3. 插入图片
	注：保存后刷新才生效
- Icon(图标)
	1. 插入Icon组件
	2. 打开 <https://www.iconfont.cn/> -> 图标管理 -> 我的项目 -> 复制代码
	
	![Icon1](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/10.png)
	3. 选中Icon组件到可编辑状态，输入复制的iconfont地址，点击上传，成功后下面会展示可用的图标，点击图标便可使用
	
	![Icon2](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/11.png)
	- 注：iconfont网站中，最好新建一个自己的项目，更新图标库后，要重新生成地址，并上传
- Form(表单)
	1. 插入表单组件，并填写表单属性
	2. 插入需要提交的元素，并填写其属性
	3. 插入提交按钮（必须是Form下一级子元素）
- Dialog(弹窗)
    1. 插入dialog元素（默认展开状态）
    2. 插入子元素
    3. 给其中一个按钮绑定关闭函数，详见下
    4. 将展示属性置为关闭，防止挡住其他元素
	    
### 7. 反馈元素（Toast, Dialog）的调用方法

- Toast 
    在需要绑定事件的地方写入
    ```javascript
     toast.show("需要设置的文字");
    ```
    默认展示三秒后消失，若三秒内重复调用，则下一个取代前一个
- Dialog
    在需要绑定事件的地方写入
    ```javascript
    // 打开dialog
    dialog.show("dialog的id");
	// 关闭dialog
	dialog.hide("dialog的id");
	```
	例： 
	1. 打开展示，复制id
	![Dialog](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/12.png)
	2. 按钮绑定click事件，以及dialog展示方法
	![Dialog](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/13.png)
	3. 按钮绑定click事件，以及dialog关闭方法
	![Dialog](https://git.sogou-inc.com/bfo/html-editor/raw/master/readme-image/14.png)

### 8. 注意事项

- 页面必须先保存再生成
- 生成完才能打开
- 上传图片之前必须先生成页面













