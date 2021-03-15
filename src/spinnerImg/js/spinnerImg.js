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
        this.drawImage(this.cutover, this.imgsIndex, this.ratio)
    };
    this.drawImage = function (cutover, imgsIndex, ratio) {
        if (ratio.name = "ratioHeight") {
            this.ctx.drawImage(this.imgData[cutover][imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (ratio.value * this.imgWidth - this.canvasInfo.width) / 2, - (ratio.value * this.imgHeight - this.canvasInfo.height) / 2, ratio.value * this.imgWidth, ratio.value * this.imgHeight)
        } else if (ratio.name = "ratioWidth") {
            this.ctx.drawImage(this.imgData[cutover][imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (ratio.value * this.imgWidth - this.canvasInfo.width) / 2, - (ratio.value * this.imgHeight - this.canvasInfo.height) / 2, ratio.value * this.imgWidth, ratio.value * this.imgHeight)
        }
    }
    // 索引是 ++ 还是 --
    // 同时根据
    // 0:--
    // 1:++
    this.changeImgIndex = function (status) {
        let length = this.imgData[this.cutover].length;
        if (status == 0)
            this.imgsIndex = this.imgsIndex == 0 ? length - 1 : this.imgsIndex - 1;
        else if (status == 1)
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
            console.log("ratioWidth");
            return { name: "ratioWidth", value: ratioWidth };
        } else if (ratioHeight * this.imgHeight == this.canvasInfo.height && ratioHeight * this.imgWidth > this.canvasInfo.width) {
            console.log("ratioHeight");
            return { name: "ratioHeight", value: ratioHeight };
        } else {
            console.error("isRatio 判断出错,没有找到合适的Ratio");
        }
    }
    this.cs = function () {
        console.log("width:" + this.canvasInfo.width + " height:" + this.canvasInfo.height);
        console.log("ratio");
        console.log("ratioWidth:", this.ratioWidth() * imgData.zero[0].width, this.ratioWidth() * imgData.zero[0].height,);
        console.log("ratioHeight:", this.ratioHeight() * imgData.zero[0].width, this.ratioHeight() * imgData.zero[0].height,);
    };

}
module.exports = spinnerImg;