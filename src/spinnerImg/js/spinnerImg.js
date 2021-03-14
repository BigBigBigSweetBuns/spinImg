let spinnerImg = function (imgData, canvas) {
    this.imgData = imgData; //[array,array]
    this.imgWidth = imgData[0][0].width;
    this.imgHeight = imgData[0][0].height;
    this.canvasInfo = canvas; //画布信息 需要的是整个画布对象
    this.ctx = this.canvasInfo.getContext("2d"); // 画布环境
    this.cutover = 0;//默认使用第一份图  0:第一份 1:第二份 
    this.imgsIndex = 0; // 当前图片选择到到第几索引
    this.ratio = null; // 使用那种比值能铺满整个屏幕
    this.init = function () {
        this.ratio = this.isRatio();
    };
    // 根据方向，绘画图片
    // 0:顺时针旋转
    // 1:逆时针方向旋转
    // 需要再添加一个function 判断 裁剪 width / height ，当前只裁剪了 width 
    this.showImg = function (drection) {
        console.log("drection", drection);
        if (drection == 0) {
            this.changeImgIndex(0)
            this.ctx.drawImage(this.imgData[this.cutover][this.imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (this.ratio * this.imgWidth - this.canvasInfo.width) / 2, - (this.ratio * this.imgHeight - this.canvasInfo.height) / 2, this.ratio * this.imgWidth, this.canvasInfo.height)
        } else if (drection == 1) {
            this.changeImgIndex(1)
            this.ctx.drawImage(this.imgData[this.cutover][this.imgsIndex], 0, 0, this.imgWidth, this.imgHeight, - (this.ratio * this.imgWidth - this.canvasInfo.width) / 2, - (this.ratio * this.imgHeight - this.canvasInfo.height) / 2, this.ratio * this.imgWidth, this.canvasInfo.height)
        }
    };
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
            return ratioWidth;
        } else if (ratioHeight * this.imgHeight == this.canvasInfo.height && ratioHeight * this.imgWidth > this.canvasInfo.width) {
            console.log("ratioHeight");
            return ratioHeight;
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