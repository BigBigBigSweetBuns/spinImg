const spin = require("./spin.js");
var IntervalY = function (height, sum, y = 0) {
    this.height = height;
    this.sum = sum;
    this.y = y;
    this.lastY = 0;
    this.i = 1;
    this.lineHeight = Math.floor(this.height / this.sum);
    this.builder = function () {
        let line = Math.floor(this.height / this.sum * this.i - this.lastY);
        let obj = { y: this.lastY + y, height: line };
        this.lastY = this.lastY + line;
        this.i += 1;
        console.log("obj", obj);
        return obj;
    }
}
// 书写出入参(item,sum,num,append)函数
// item:每个元素 sum:元素全部相加总和，num:元素总数，append:附加提前量
// 参照上面对象，创建函数，返回数组


let spinnerImg = function (imgData, canvas) {
    this.imgData = imgData; //[array,array]
    this.imgWidth = imgData[0][0].width;
    this.imgHeight = imgData[0][0].height;
    this.canvasInfo = canvas; //画布信息 需要的是整个画布对象
    this.ctx = this.canvasInfo.getContext("2d"); // 画布环境
    this.cutover = 0;//默认使用第一份图  0:第一份 1:第二份 
    this.imgsIndex = 0; // 当前图片选择到到第几索引
    this.ratio = { name: "null", value: "" }; // 使用那种比值能铺满整个屏幕
    this.init = function () {
        this.ratio = this.isRatio();
    };
    // 根据方向，绘画图片
    // 0:顺时针旋转
    // 1:逆时针方向旋转
    // 需要再添加一个function 判断 裁剪 width / height ，当前只裁剪了 width 
    this.showImg = function (drection) {
        this.changeImgIndex(drection)
        this.drawImage(this.imgData[this.cutover], this.imgsIndex, this.ratio)
    };
    this.drawImage = function (imgData, imgsIndex, ratio) {
        if (ratio.name == "ratioHeight") {
            this.ctx.drawImage(imgData[imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (ratio.value * this.imgWidth - this.canvasInfo.width) / 2, - (ratio.value * this.imgHeight - this.canvasInfo.height) / 2, ratio.value * this.imgWidth, ratio.value * this.imgHeight)
        } else if (ratio.name == "ratioWidth") {
            this.ctx.drawImage(imgData[imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (ratio.value * this.imgWidth - this.canvasInfo.width) / 2, - (ratio.value * this.imgHeight - this.canvasInfo.height) / 2, ratio.value * this.imgWidth, ratio.value * this.imgHeight)
        } else {
            console.error("无法绘制图片，获取不到ratio data");
        }
    };


    // 索引是 ++ 还是 --
    // 同时根据
    // 0:--
    // 1:++
    this.changeImgIndex = function (drection) {
        let length = this.imgData[this.cutover].length;
        if (drection == 0)
            this.imgsIndex = this.imgsIndex == 0 ? length - 1 : this.imgsIndex - 1;
        else if (drection == 1)
            this.imgsIndex = this.imgsIndex + 1 == length ? 0 : this.imgsIndex + 1;
        else
            console.error("changeImgIndex输入的状态值不是 0 | 1");
    };
    // image.width proportional change with canvas.width , image.height >= canvas.width , use ratioWidth
    // image.height proportional change with canvas.height , image width >= canvas width , use ratioHeight
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
    this.spinLineBlock = function (imgs_data, imgs_index, show_height, y, cutover, drection) {  // show_height 原始图片展示高度， y 原始图片的坐标，drection 获取列表的旋转方向
        let length = drection.length;
        let imgsSpinData = [[], []]; // 分成两组是为了区分左右旋转时的计时器
        let canvasInterval = new IntervalY(Math.ceil(show_height * this.ratio.value), length, Math.ceil(y * this.ratio.value));
        let imgInterval = new IntervalY(Math.ceil(show_height), length, y);
        let one = cutover;
        let two = cutover == 1 ? 0 : 1;
        for (let i = 0; i < length; i++) {
            let data = this.getDrawimageParameters(imgs_data[one], imgs_data[two], imgs_index, drection[i], imgInterval.builder(), canvasInterval.builder());
            if (drection[i] == 1) {
                imgsSpinData[0].push(data);
            } else {
                imgsSpinData[1].push(data);
            }
        }
        return imgsSpinData;
    };
    // 通过识别drection数组，生成整个旋转图片数据
    this.spinLineBlock_recursion = function (imgs_data, imgs_index, show_height, y, cutover, drectionArr) {  // show_height 原始图片展示高度， y 原始图片的坐标，drection 获取列表的旋转方向
        let length = drectionArr.length;
        let imgsSpinData = [[], []]; // 分成两组是为了区分左右旋转时的计时器
        let canvasInterval = new IntervalY(Math.ceil(show_height * this.ratio.value), length, Math.round(y * this.ratio.value));
        let imgInterval = new IntervalY(Math.ceil(show_height), length, y);
        let one = cutover;
        let two = cutover == 1 ? 0 : 1;
        for (let i = 0; i < length; i++) {
            let canvasInter = canvasInterval.builder();
            let imgInter = imgInterval.builder();
            if (Array.isArray(drectionArr[i])) { // 识别到当前有子数组
                let data = this.spinLineBlock_recursion(imgs_data, imgs_index, canvasInter.height, imgInter.y, cutover, drectionArr[i]);
                imgsSpinData[0].push(...data[0])
                imgsSpinData[1].push(...data[1])
            } else {
                let data = this.getDrawimageParameters(imgs_data[one], imgs_data[two], imgs_index, drectionArr[i], imgInter, canvasInter);
                if (drectionArr[i] == 1) {
                    imgsSpinData[0].push(data);
                } else {
                    imgsSpinData[1].push(data);
                }
            }

        }
        return imgsSpinData;
    };
    this.clickSpin = function () {
        console.log("clickSpin");
        console.log(this.cutover);
        console.log(this.ratio);
        let arr = [1, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], 0];
        let drectionArr = [1, 0, 1, 0, 1, 0, 1, 1, 1];
        // let a = this.spinLineBlock(this.imgData, this.imgsIndex, 500, 100, this.cutover, drectionArr);
        let a = this.spinLineBlock_recursion(this.imgData, this.imgsIndex, 1060, 0, this.cutover, arr);
        console.log(a);
        // let imgsData = [[], []];
        // imgsData = this.spinLineBlock(this.imgData, this.imgsIndex, 1000, 100, this.cutover, [0, 1, 0])
        // let a = this.spinLineBlock(this.imgData, this.imgsIndex, 1000, 100, this.cutover, drectionArr);
        // console.log("a", a);
        for (let i = 0; i < a.length; i++) {
            this.drawImageFor(a[i], 2000)
        }
        // this.spinDefault(this.imgData, this.imgsIndex, this.imgHeight, this.canvasInfo.height, this.ratio, this.cutover);
        this.imgsIndex = 0;
        this.cutover = this.cutover == 1 ? 0 : 1;

    };
    this.spinDefault = function (imgs_data, imgs_index, img_height, canvasInfo_height, ratio, cutover) {  // 默认 spin 样式
        let imgsSpinData = [[], []];
        let rowTotal = 3;
        let canvasInterval = new IntervalY(img_height * ratio.value, rowTotal); // 对ratio判断，如果缩放的是宽度，装载在画布中的图片高度为画布高度，否则为，缩放后的图片高度。
        let imgInterval = new IntervalY(this.imgHeight, rowTotal, 0);
        let one = cutover;
        let two = cutover == 1 ? 0 : 1;
        console.log(1);
        for (let i = 0; i < rowTotal; i++) {
            if (i % 2 == 0)
                imgsSpinData[1].push(this.getDrawimageParameters(imgs_data[one], this.imgData[two], imgs_index, 1, imgInterval.builder(), canvasInterval.builder()));
            else
                imgsSpinData[0].push(this.getDrawimageParameters(imgs_data[one], this.imgData[two], imgs_index, 0, imgInterval.builder(), canvasInterval.builder()));
        }
        for (let i = 0; i < imgsSpinData.length; i++) {
            this.drawImageFor(imgsSpinData[i], 2000);
        }
    }
    // 负责画图
    this.drawImageFor = function (imgsData, time = 2000) {
        let index = 0;
        let length = imgsData[0].imgsData.length;
        let speed = Math.floor(time / length);
        let intarval = setInterval(() => {
            if (index == length - 1) clearInterval(intarval);
            for (let i = 0; i < imgsData.length; i++) {
                this.ctx.drawImage(imgsData[i].imgsData[index].imgContent, imgsData[i].sx, imgsData[i].sy, imgsData[i].swidth, imgsData[i].sheight, imgsData[i].x, imgsData[i].y, imgsData[i].width, imgsData[i].height);
            }
            index++;
        }, speed)
    }
    // 获取到drawImg 所需的所有数据
    this.getDrawimageParameters = function (imgDataOne, imgDataTwo, current_idx, drection, img_interval, canvas_interval) {
        let imgsData = this.forImgIndex(imgDataOne, imgDataTwo, current_idx, drection)
        if (this.ratio.name == "ratioHeight") {
            return height(imgsData, this.imgWidth, this.canvasInfo.width, img_interval, canvas_interval, this.ratio);
        } else {
            return width(imgsData, this.imgWidth, this.imgHeight, this.canvasInfo.height, img_interval, canvas_interval, this.ratio);
        }
        function height(imgsData, img_width, canvasInfo_width, img_interval, canvas_interval, ratio) { // 一组图片数据，图片宽度，画布宽度，图片组原图裁切后y轴和高度，图片组画布y轴和高度，当前宽高比值
            return {
                imgsData: imgsData,
                sx: 0,
                sy: img_interval.y,
                swidth: img_width,
                sheight: img_interval.height,
                x: -(ratio.value * img_width - canvasInfo_width) / 2, // 因为宽度大于画布宽度，需要减去多余的宽度，使画面居中
                y: canvas_interval.y,
                width: ratio.value * img_width,
                height: canvas_interval.height
            };
        };
        function width(imgsData, img_width, img_height, canvasInfo_height, img_interval, canvas_interval, ratio) { // 一组图片数据，图片宽度，画布高度，图片组原图裁切后y轴和高度，图片组画布y轴和高度，当前宽高比值
            return {
                imgsData: imgsData,
                sx: 0,
                sy: img_interval.y,
                swidth: img_width,
                sheight: img_interval.height,
                x: 0,
                y: canvas_interval.y - (ratio.value * img_height - canvasInfo_height) / 2, // 因为高度高于画布高度，需要减去多余的高度，使画面居中
                width: ratio.value * img_width,
                height: canvas_interval.height
            }
        }
    };
    // 获取图片组索引,到一半时切换下一套图
    this.forImgIndex = function (imgDataOne, imgDataTwo, current_idx, drection) {
        let arr = new Array(), loop = true;
        let length = imgDataOne.length;
        let length2 = imgDataTwo.length;
        let output = current_idx
        if (drection == 0) {
            output = output == length - 1 ? 0 : output + 1;
            loop = output - 1 > (length - 1) / 2 ? false : true;
            while (true) {
                if (output == 0) loop = true
                if (loop && output > (length - 1) / 2) break;
                arr.push({ index: output, imgContent: imgDataOne[output] });
                output = output == length - 1 ? 0 : output + 1;
            }
            output = (length2 - 1) / 2;
            while (true) {
                arr.push({ index: output, imgContent: imgDataTwo[output] });
                output = output == length2 - 1 ? 0 : output + 1;
                if (loop && output == 0) break;
            }
        } else if (drection == 1) {
            output = output == 0 ? length - 1 : output - 1;
            loop = output + 1 < (length - 1) / 2 ? false : true;
            while (true) {
                if (loop && output < (length - 1) / 2) break;
                if (output == 0) loop = true
                arr.push({ index: output, imgContent: imgDataOne[output] });
                output = output == 0 ? length - 1 : output - 1;
            }
            output = (length2 - 1) / 2;
            while (true) {
                arr.push({ index: output, imgContent: imgDataTwo[output] });
                output--;
                if (loop && output == 0) break;
            }
        }
        arr.push({ index: 0, imgContent: imgDataTwo[0] }); // 最后一张图切到第一张。该功能单独提出来的原因，后期可能将其拉出该功能外，进行调用。
        return arr;
    }

}


module.exports = spinnerImg;