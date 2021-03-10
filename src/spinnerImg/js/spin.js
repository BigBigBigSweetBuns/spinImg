
//*********** 实现切换效果  *************//
module.exports = {
    // 右旋转
    // imgSpiningLeft: function (imgsArr, time, callback) { // 图片组，持续的总时间（ms）
    //     let speed = Math.floor(time / (imgsArr.length - 1));
    //     let i = 0;
    //     let interval = setInterval(() => {
    //         if (i > imgsArr.length - 1) {
    //             clearInterval(interval);
    //         } else if (typeof callback == "function") {
    //             console.log("i", i);
    //             callback(imgsArr[i]);
    //         }
    //         i++;
    //     }, speed);
    // },
    // // 左旋转
    // imgSpiningRight: function (imgsArr, time, callback) { // 图片组，持续的总时间（ms）
    //     let speed = Math.floor(time / (imgsArr.length - 1));
    //     let i = imgsArr.length - 1;
    //     let interval = setInterval(() => {
    //         if (i < 0) {
    //             clearInterval(interval);
    //         } else if (typeof callback == "function") {
    //             callback(imgsArr[i]);
    //         }
    //         i--;
    //     }, speed);
    // },
    // 旋转一周
    imgSpining: function (imgsArr1, imgsArr2, imgIndex, drection, time, callback) {
        let length = Math.min(imgsArr1.length, imgsArr2.length);
        let min = false;
        let speed = Math.floor(time / (length - 1 - imgIndex));
        document.getElementById("block").style.display = "block";
        if (drection == 2) {// 右
            if (imgIndex < imgsArr1.length / 2) { // 小于的时候加多旋转的图片
                speed = Math.floor(time / (length - 1 + imgIndex));
                min = true;
            }
            let intarval = setInterval(() => {
                if (min && imgIndex == 0) {
                    min = false;
                    imgIndex = length - 1;
                }
                if (!min && imgIndex < 0) {
                    clearInterval(intarval);
                    document.getElementById("block").style.display = "none";
                } else if (imgIndex < (length / 2)) {
                    callback(imgsArr2[imgIndex]);
                } else {
                    callback(imgsArr1[imgIndex]);
                }
                imgIndex--;
            })
        } else if (drection == 4) { //左
            if (imgIndex > length / 2) {
                speed = Math.floor(time / (length - 1 + (length - imgIndex)));
                min = true;
            }
            let intarval = setInterval(() => {
                if (min && imgIndex == length - 1) {
                    min = false;
                    imgIndex = 0;
                }
                if (!min && imgIndex > length - 1) {
                    clearInterval(intarval);
                    document.getElementById("block").style.display = "none";
                } else if (imgIndex > (length / 2)) {
                    callback(imgsArr2[imgIndex]);
                } else {
                    callback(imgsArr1[imgIndex]);
                }
                imgIndex++;
            });
        }
    }
}
