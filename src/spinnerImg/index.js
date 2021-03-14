import "./index.scss";

import dataLoad from "./js/dataLoad";
import styleLoading from "./js/styleLoading";
import spin from "./js/spin";

import spinnerImg from "./js/spinnerImg";

var imgNum = 0;

var imgsUrls = [[], []];
// 暂时以循环代替 图片数组


window.onload = function () {
    var spinnerImgData = null;
    var box2 = document.getElementsByClassName("box2")[0];
    var speedBox = document.getElementsByClassName("speed")[0];
    var text = document.getElementsByClassName("text")[0];//测试显示内容标签，测试完后删除
    var c = document.getElementById("myCanvas");
    c.width = document.documentElement.clientWidth;
    c.height = document.documentElement.clientHeight;
    var ctx = c.getContext("2d")
    var canvasWidth = c.width;
    var canvasHeight = c.height;
    let moveMouse = {
        oldX: 0,
        oldY: 0,
        clientX: 0,// 鼠标当前X轴
        clientY: 0,
        drection: false,//1,2,3,4 上右下左
        onClick: false,
        onUp: true,
        status: 0,//当前需要旋转第几份图。0第一份，1第二份
    }
    // 加载第一份图
    // waitImgload(testdata, (res) => {
    //     imgsUrls[0] = res;
    //     console.log(imgsUrls[0])
    // });
    waitImgloadZero(dataLoad.getDataZero(), (res) => {
        imgsUrls[0] = res;
        console.log(imgsUrls[0])
        // 第二份图
        waitImgloadOne(dataLoad.getDataOne(), (res1) => {
            imgsUrls[1] = res1;
            console.log(imgsUrls[1])
            spinnerImgData = new spinnerImg([res, res1], c);
            spinnerImgData.init();
            // data.cs();
            console.log(spinnerImgData.ratio);
        });
    });
    function waitImgloadZero(arrUrls, callback) {
        let promiseArr = [];
        for (let i = 0; i < arrUrls.length; i++) {
            promiseArr.push(new Promise((resolve) => {
                let img = new Image();
                img.src = arrUrls[i];
                let timer = setInterval(function () {
                    if (img.complete) {
                        clearInterval(timer);
                        styleLoading.loadOne(arrUrls.length);
                        resolve(img);
                    }
                }, 50)
            }))
        }
        Promise.all(promiseArr).then(res => {
            callback(res)
        });
    }
    function waitImgloadOne(arrUrls, callback) {
        let promiseArr = [];
        for (let i = 0; i < arrUrls.length; i++) {
            promiseArr.push(new Promise((resolve) => {
                let img = new Image();
                img.src = arrUrls[i];
                let timer = setInterval(function () {
                    if (img.complete) {
                        clearInterval(timer);
                        styleLoading.loadTwo(arrUrls.length);
                        resolve(img);
                    }
                }, 50)
            }))
        }
        Promise.all(promiseArr).then(res => {
            callback(res)
        });
    }
    //展示图片
    function showImg(newX, newY, imgsUrl) {
        if (moveMouse.onClick && !moveMouse.onUp && Math.abs(moveMouse.oldX - moveMouse.clientX) > 15) { // 在鼠标点击后，未松开
            let num = 0;
            if (moveMouse.drection == 2) { // right 移动三个像素
                imgNum = imgNum - 1 > 0 ? imgNum - 1 : imgsUrl.length - 1;
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(imgsUrl[imgNum], 0, 0, canvasWidth, canvasHeight);
                moveMouse.oldX = newX;
            } else if (moveMouse.drection == 4) { // left 移动三个像素 
                imgNum = imgNum < imgsUrl.length - 1 ? imgNum + 1 : 0;
                ctx.drawImage(imgsUrl[imgNum], 0, 0, canvasWidth, canvasHeight);
                moveMouse.oldX = newX;
            }
            console.log("width: " + canvasWidth + " height: " + canvasHeight)
            box2.innerHTML = "X:" + newX + " Y: " + newY + "\n oldX:" + moveMouse.oldX + "oldY:" + moveMouse.oldY;
        }
    }
    // TODO:
    // 进度条动画
    // 点击进度条实现动画旋转
    // ted剩余网页

    // 每0.02秒有无松开鼠标，如果松开鼠标，记录该区间速度。将该速度衰平滑减至零
    let timeX = 0;
    let moveTime = null, slideTime = null;// 计数器
    function getMoveSpeed(imgsUrl) { // 获取鼠标移动速度
        clearInterval(moveTime)
        let moveSpeed = 0;
        moveTime = setInterval(function () {
            moveSpeed = Math.abs(moveMouse.clientX - timeX);
            timeX = moveMouse.clientX;
            if (moveMouse.onUp) {
                clearInterval(moveTime)
                transferspeed(moveSpeed, imgsUrls[0])
                // TODO 
                // 鼠标划出组件的时候，不会触发 onUp事件
            }
            speedBox.innerHTML = "speeds: " + moveSpeed;
        }, 10)
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function transferspeed(moveSpeed, imgsUrl) {
        let drection = moveMouse.drection;
        moveSpeed = Math.floor(moveSpeed / 10)
        while (moveSpeed > 1) {
            moveSpeed -= 1;
            // await sleep(500)
            speedBox.innerHTML = "speeds: " + moveSpeed
            slideTime = setInterval(spinInterval(drection, imgsUrl), Math.floor(1000 / moveSpeed))
            await sleep(Math.floor(1000 / moveSpeed))
            clearInterval(slideTime)
            console.log(moveSpeed)
            // frames(moveS)
        }
    }

    function spinInterval(drection, imgsUrl) {
        if (drection == 2) {
            imgNum = imgNum > 0 ? imgNum - 1 : imgsUrl.length - 1;
            ctx.drawImage(imgsUrl[imgNum], 0, 0);
        } else if (drection == 4) {
            imgNum = imgNum < imgsUrl.length - 1 ? imgNum + 1 : 0;
            ctx.drawImage(imgsUrl[imgNum], 0, 0);
        }
    }

    let qie = document.getElementById("qie");
    qie.onclick = () => {
        cs();
        spinleftline(600, 600, 3, 3, 0);
        spinleftline(630, 630, 3, 3, 1);
        spinleftline(660, 660, 3, 3, 0);
    }
    function getCanvasInfo() {
        return c
    }
    function cs() {
        spin.imgSpinAdd(imgsUrls[0], imgsUrls[1], imgNum, 1500, (imgContent) => {
            ctx.drawImage(imgContent, 0, 0, imgContent.width, 300, 0, 0, c.width, 300);
        });
        spin.imgSpinLess(imgsUrls[1], imgsUrls[0], imgNum, 1500, (imgContent) => {
            ctx.drawImage(imgContent, 0, 300, imgContent.width, 300, 0, 300, c.width, 300);
        })
    }
    //
    // 画布大于 16:9 时，确保图片 width  100%
    // 画布小于 16:9 时，确保图片 height 100%

    // 参数化 设置一行的图片在画布中的展示
    function spinleftline(sy, y, img_height, canvasHeight, direction) {
        let canvas = getCanvasInfo();
        if (direction == 0) { // 左 
            spin.imgSpinAdd(imgsUrls[0], imgsUrls[1], imgNum, 1500, (imgContent) => {
                ctx.drawImage(imgContent, 0, sy, imgContent.width, img_height, 0, y, canvas.width, canvasHeight);
            });
        } else if (direction == 1) { // 右
            spin.imgSpinLess(imgsUrls[0], imgsUrls[1], imgNum, 1500, (imgContent) => {
                ctx.drawImage(imgContent, 0, sy, imgContent.width, img_height, 0, y, canvas.width, canvasHeight);
            });
        }
    }
    function minWidth() {
        // 首先需要获取到图片长宽比，和画布长宽比（高度固定100%）
        let height = c.height;// 画布高度
        let width = c.width; // 画布宽度
        let oneline = Math.floor(height * 0.3); // 显示第一行的高度
        let twoline = Math.floor(height * 0.3); // 显示第二行的高度
        let threeline = height - oneline - twoline; // 显示第三行的高度
        moveMouse.status = moveMouse.status == 1 ? 0 : 1;
        if (moveMouse.status == 0) {
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 4, 3000, (imgContent) => {
                let widthRatio = imgContent.width / width;
                let heightRatio = imgContent.height / height;
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), 0, width, Math.floor(imgContent.height * 0.3), 0, 0, width, oneline);
            })
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), Math.floor(imgContent.height * 0.3), width, Math.floor(imgContent.height * 0.3), 0, oneline, width, twoline);
            });
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), Math.floor(imgContent.height * 0.6), width, Math.floor(imgContent.height * 0.4), 0, oneline + twoline, width, threeline)
            })
        } else {
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), 0, width, Math.floor(imgContent.height * 0.3), 0, 0, width, oneline)
            })
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), Math.floor(imgContent.height * 0.3), width, Math.floor(imgContent.height * 0.3), 0, oneline, width, twoline);
            });
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, Math.floor((imgContent.width - width) / 2), Math.floor(imgContent.height * 0.6), width, Math.floor(imgContent.height * 0.4), 0, oneline + twoline, width, threeline);
            })
        }
    }


    // 鼠标点击
    c.onmousedown = function (event) {
        event = event || window.event;
        moveMouse.onClick = true;
        moveMouse.onUp = false;
        moveMouse.oldX = event.clientX;
        moveMouse.oldY = event.clientY;
        getMoveSpeed(imgsUrls[0]);
    }
    // 鼠标松开
    c.onmouseup = function () {
        moveMouse.onClick = false;
        moveMouse.onUp = true;

        // showImgSlide(moveSpeed, event.clientX);
    }
    // c.onmouseover = function () {
    //     moveMouse.onClick = false;
    //     moveMouse.onUp = true;
    // }
    // 绘制图片
    c.onmousemove = function (event) {
        event = event || window.event;
        moveMouse.clientX = event.clientX;
        if (Math.abs(event.clientX - moveMouse.oldX) > 15) {
            console.log("abs");
            moveMouse.drection = event.clientX - moveMouse.oldX > 0 ? 1 : 0;
            spinnerImgData.showImg(moveMouse.drection);
            moveMouse.oldX = event.clientX;
        }
        if (moveMouse.status == 0) {
            // showImg(event.clientX, event.clientY, imgsUrls[0]);
        }
        if (moveMouse.status == 1) {
            // showImg(event.clientX, event.clientY, imgsUrls[1]);
        }
    }
}