const spin = require("./spin.js");
var IntervalY = function (height, sum, y) {
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
    this.spinLine = function (imgDataOne, imgDataTwo, sy, y, showHeight, time, drection) {
        if (drection == 0) {
            spin.imgSpinAdd(imgDataOne, imgDataTwo, this.imgsIndex, time, (imgContent) => {
                this.drawImageLine(imgContent, this.ratio, sy, y, showHeight);
            });
        } else if (drection == 1) {
            spin.imgSpinLess(imgDataOne, imgDataTwo, this.imgsIndex, time, (imgContent) => {
                this.drawImageLine(imgContent, this.ratio, sy, y, showHeight);
            });
        }
        this.imgsIndex = 0;
    };
    this.clickSpin = function () {
        console.log("clickSpin");
        console.log(this.cutover);
        console.log(this.ratio);
        let imgsSpinData = [[], []];
        let canvasInterval = this.ratio.name == "ratioHeight" ? new IntervalY(this.canvasInfo.height, 7, 0) : new IntervalY(this.imgHeight * this.ratio.value, 7, 0);
        let imgInterval = new IntervalY(this.imgHeight, 7, 0);
        imgsSpinData[0].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 0, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[1].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 1, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[0].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 0, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[1].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 1, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[0].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 0, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[1].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 1, imgInterval.builder(), canvasInterval.builder()));
        imgsSpinData[0].push(this.getDrawimageParameters(this.imgData[0], this.imgData[1], this.imgsIndex, 0, imgInterval.builder(), canvasInterval.builder()));
        console.log("imgsSpinData", imgsSpinData);
        this.drawImageFor(imgsSpinData[0], 2000);
        this.drawImageFor(imgsSpinData[1], 2000);
        this.imgsIndex = 0;
    };
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
        return arr;
    }

}


module.exports = spinnerImg;