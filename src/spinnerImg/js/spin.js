
//*********** 实现切换效果  *************//
var spin = {
    // 目标：
    // 实现图片以当前图片作为起始点，旋转一周，切换到下套图
    // 起始点到终点不到半圈情况下，转一圈半
    // 旋转的过程到一半时，切换下一套图。
    // 需要将定时器改为延时器，并将异步转为同步
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
    spinIdxLess: function (current_idx, max, speed, callback) { // 索引变小
        current_idx = current_idx == 0 ? current_idx = max : current_idx - 1;
        let loop = current_idx < max / 2 ? true : false;
        let output = current_idx;
        let intarval = setInterval(() => {
            if (!loop && output == 0) {
                clearInterval(intarval);
                return;
            }
            if (output == 0)
                loop = false;
            current_idx = current_idx == 0 ? current_idx = max : current_idx - 1;
            callback(output);
            output = current_idx;
        }, speed)
    },
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
    imgSpinLess: function (imgsArr1, imgsArr2, current_index, time, callback) { // 数组反顺序，图片旋转的到一半切换到第二份图 
        let length = Math.min(imgsArr1.length, imgsArr2.length);
        let loop = current_index < length / 2 ? true : false; // 是否旋转一圈多
        let num = loop ? length + current_index : length - current_index;
        let speed = Math.floor(time / num);

        this.spinIdxLess(current_index, length - 1, speed, (index) => {
            if (index == 0) {
                loop = false;
            }
            if (loop || index >= length / 2) { // 前半圈显示第一套图 
                callback(imgsArr1[index]);
            } else if (!loop && index < length / 2) { // 旋转到一半后，切换第二套图
                callback(imgsArr2[index]);
            }
        })
    },
}
module.exports = spin;