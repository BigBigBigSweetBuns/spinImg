# note

#### 素材

两组图片，相似但不同的图片。

#### 代码细分 0318

* [ ] 区间块，等比行旋转，代码优化 ( spin_interval_block )
* [ ] 分割 spin 对象
* [ ] 实现 慢-快-慢 速度曲线
* [ ] interval 函数优化

### 实现目标

* [x] 鼠标点击后移动，图片切换
* [x] 点击切换按钮，图片组切换到另一组图
* [ ] 不同组图，不同的切换效果

#### animation

##### 鼠标移动

* [x] 拖拽鼠标，以移动速度，作为图片切换速度。
* [x] 当鼠标停止移动时，仍然有惯性，降速旋转图片到速度为零。

##### 切换组图

* [ ] 图片分割复数左右两个方向，以慢-快-慢节奏切换。
* [ ] 到一半的时候切换到第二份图，继续旋转到初始图。

切换想法

* [ ] 图片分割为三部分，上下两层为同一方向。中间为另一方向。（默认切换状态）
* [ ] 中间，复数细分，( max-height : 10px ) ，并拉伸图片像素。不同方向旋转
* [ ] 晶体化图片，分割复数部分旋转。
* [ ] 底部，分割复数，拉伸高度。

#### 思路

#### bug情况

TODO:

* [x]  进度条动画
* [x] 点击进度条实现动画旋转
* [x] 每0.02秒有无松开鼠标，如果松开鼠标，记录该区间速度。将该速度衰平滑减至零（待优化）
* [ ] 每块图片缩放到画布时，有小数点，导致每块图片衔接出现一像素的缺失。

创建的spinnerimg对象，为静止对象，当加载完网页后，再改变页面，不会改变参数

### 难点

#### 图片展示

要在不同显示屏，图片居中，切割范围相同。要使中间的内容完全展示、

假设：图片 2:1  画布 4:3 / 3:4 

画布 4:3 的情况，图片宽度 100% 显示，裁剪高度

画布 3:4 的情况，图片高度 100% 显示，裁剪宽度

#### 图片加载

图片加载的过程为异步加载，限制于http请求的数量。

image 事件没有监听加载进度，只能获取到图片加载完成时的事件。

##### 问题2：需要等待 图片组的加载完成 后再执行其他内容

解决1：绑定事件，当单个图片加载完成时，自动加载下一张图。

优点：代码书写简洁，易阅读，没有使用监听，性能优越。

缺点：复数图片组时，需要书写重复代码。

​			难以获取加载好的图片赋值。

解决2：使用 `setInterval` 和 `new Promise()` 监听图片加载完成事件，将异步操作改写成同步操作。

​				`promise.all()` 当全部图片加载完成后，再获取加载好的图片数据组。

优点：适用于复数图片组。

缺点：性能差，计时器的数量为图片组的数量，性能消耗大。

#### **进度条等待图片加载**

所有图片一起请求，导致大部分图片在一起加载完成（疑问：http请求同时提供几条）

load animation 过程， 无法平滑。

情况：开头并不这么动，然后一下子加载完成。

​			动画效果在持续的过程中，突然加载好下一份图，动画速度改变

##### 初步解决：

使用计时器 `setInterval(()=>{},speed)` ，实时监听每张图片加载进度。

#### 每块图片缩放后，出现小数点，图片衔接缺失一像素

##### 初步解决：（ 03 - 17 ）

设置每块固定值 block ，最后一块  last_block = canvas - block * x

出现的问题

当块的数量多后，last_block 高度比平均高度 高 x 像素

##### 目前解决：

1. 快速编写解决方法：

构建一个**类**来处理。计算每个元素高度，并存放到数组中。

单个**元素高度** :  `Math.floor ( 总高度 / 已存放元素数量  -  已存放的元素高度 )`

这样获取到的数据，单个元素高度 **± 1**。不会将向下取整的小数点高度，堆给最后的元素。

class

```javascript
let Obj = function (height, sum, y) { // 总高度( height )，元素总数量( sum )，提前量( y )
    this.height = height;
    this.sum = sum;
    this.y = y;
    this.lastY = 0;
    this.lineHeight = Math.floor(this.height / this.sum);
    this.iterator = function () {
    let line = this.lastY + this.lineHeight;
    let arr = [[this.lastY + y, line + y]];
    this.lastY = line;
    for (let i = 2; i <= this.sum; i++) {
        line = Math.floor(this.height / this.sum * i - this.lastY);
        arr.push([this.lastY + 1 + y, this.lastY + 1 + line + y]);
        this.lastY = this.lastY + 1 + line;
    }
    arr[this.sum - 1][1] -= 1;
    return arr
    }
}

// return
[[star,end],[star,end]]
```

2. 优化成为一个方法

```javascript
function (item,sum,num){ //item:每个元素 sum:元素全部相加总和，num:元素总数

} 
```

#### 获取 慢-快-慢 速度曲线分段值

### canvas drawImages() 的理解

##### 注意点：

sx 和 sy 裁剪的坐标为 **原始图片** 坐标

swidth 和 sheight 裁剪的宽高为 **原始图片**  宽高

width 和 height 设置 sx 和 sy ，裁剪的是原始图片，失去**等比缩放**功能。

##### 简写用法：

```javascript
context.drawImage(img,x,y); // 画布定位图像
```

```javascript
context.drawImage(img,x,y,width,height);  // 定位图像，图像宽高（可以等比例缩放图片）
```

##### 参数值

| 参数      | 描述                                     |
| --------- | ---------------------------------------- |
| *img*     | 规定要使用的图像、画布或视频。           |
| *sx*      | 开始剪切的 x 坐标。（原始图片的 x 坐标） |
| *sy*      | 开始剪切的 y 坐标。（原始图片的 y 坐标） |
| *swidth*  | 被剪切图像的宽度。（原始图片宽度）       |
| *sheight* | 被剪切图像的高度。（原始图片高度）       |
| *x*       | 在画布上放置图像的 x 坐标。              |
| *y*       | 在画布上放置图像的 y 坐标。              |
| *width*   | 图像展示的宽度（变形图像）。             |
| *height*  | 图像展示的高度（变形图像）。             |

### 代码优化

#### 绘制一行图片组旋转

```javascript
spinIdxAdd: function (current_idx, max, speed, callback) { // 索引变大
        current_idx++;
        let loop = current_idx > max / 2 ? true : false;
        let output = current_idx % max;
        let intarval = setInterval(() => {
            if (!loop && output == 0) {
                clearInterval(intarval);
                return;
            }
            if (output == 0)
                loop = false;
            current_idx++;
            callback(current_idx % max);
            output = current_idx % max;

        }, speed);
    },
```

```javascript
imgSpinAdd: function (imgsArr1, imgsArr2, current_index, time, callback) { // 图片旋转的到一半切换到第二份图 
	let length = Math.min(imgsArr1.length, imgsArr2.length);
	let loop = current_index > length / 2 ? true : false;
	let num = loop ? length + (length - current_index + 1) : length - current_index; // 切换的图片数量
	let speed = Math.floor(time / num);
	this.spinIdxAdd(current_index, length - 1, speed, (index) => {
		if (index == 0) {
			loop = false;
		}
		if (loop || index <= length / 2) { // 前半圈显示第一套图 
			callback(imgsArr1[index]);
        } else if (!loop && index > length / 2) { // 旋转到一半后，切换第二套图
			callback(imgsArr2[index]);
        }
    })
},
```

```javascript
this.isRatio = function () {
        let ratioWidth = this.canvasInfo.width / this.imgWidth;
        let ratioHeight = this.canvasInfo.height / this.imgHeight;
        console.log("isRatio");
        if (ratioWidth * this.imgWidth == this.canvasInfo.width && ratioWidth * this.imgHeight > this.canvasInfo.height) {
            return { name: "ratioWidth", value: ratioWidth };
        } else if (ratioHeight * this.imgHeight == this.canvasInfo.height && ratioHeight * this.imgWidth > this.canvasInfo.width) {
            return { name: "ratioHeight", value: ratioHeight };
        } else {
            console.error("isRatio 判断出错,没有找到合适的Ratio");
        }
    };
```

```javascript
    this.drawImageLine = function (imgContent, ratio, sy, y, height) {
        if (ratio.name = "ratioHeight") {
            this.ctx.drawImage(imgContent, 0, y / ratio.value, this.imgWidth, height / ratio.value, -(ratio.value * this.imgWidth - this.canvasInfo.width) / 2, y, ratio.value * this.imgWidth, height);
        } else if (ratio.name = "ratioWidth") {
            this.ctx.drawImage(imgContent, 0, sy, this.imgWidth, height / rtaio.value, - (ratio.value * this.imgWidth - this.canvasInfo.width) / 2, y, ratio.value * this.imgWidth, height)
        }
    };
```

调用

```javascript
spin.imgSpinAdd(imgDataOne, imgDataTwo, this.imgsIndex, time, (imgContent) => {
	this.drawImageLine(imgContent, this.ratio, sy, y, showHeight);
});
```

