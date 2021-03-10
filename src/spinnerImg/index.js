import "./index.scss";

import dataLoad from "./js/dataLoad";
import styleLoading from "./js/styleLoading";
import spin from "./js/spin";
var list = [];//加载好后的图片存放
var scheduleOne = 0; // 加载顺序
var scheduleTwo = 0; // 加载顺序
var imgNum = 0;

var imgsUrls = [[], []];
// 暂时以循环代替 图片数组


window.onload = function () {
    var box2 = document.getElementsByClassName("box2")[0];
    var speedBox = document.getElementsByClassName("speed")[0];
    var text = document.getElementsByClassName("text")[0];//测试显示内容标签，测试完后删除
    // loadImage(data.one);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d")
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
    waitImgloadOne(dataLoad.getDataOne(), (res) => {
        imgsUrls[0] = res;
        console.log(imgsUrls[0])
    });
    // 第二份图
    waitImgloadTwo(dataLoad.getDataTwo(), (res) => {
        imgsUrls[1] = res;
        console.log(imgsUrls[1])
    });
    function waitImgloadOne(arrUrls, callback) {
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
    function waitImgloadTwo(arrUrls, callback) {
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
                ctx.drawImage(imgsUrl[imgNum], 0, 0);
                moveMouse.oldX = newX;
            } else if (moveMouse.drection == 4) { // left 移动三个像素 
                imgNum = imgNum < imgsUrl.length - 1 ? imgNum + 1 : 0;
                ctx.drawImage(imgsUrl[imgNum], 0, 0);
                moveMouse.oldX = newX;
            }
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
        moveMouse.status = moveMouse.status == 1 ? 0 : 1;
        if (moveMouse.status == 0) {
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 0, 1900, 350, 0, 0, 1900, 350)
            })
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 350, 1900, 300, 0, 350, 1900, 300);
            });
            spin.imgSpining(imgsUrls[0], imgsUrls[1], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 650, 1900, 410, 0, 650, 1900, 410)
            })
        } else {
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 0, 1900, 350, 0, 0, 1900, 350)
            })
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 350, 1900, 300, 0, 350, 1900, 300);
            });
            spin.imgSpining(imgsUrls[1], imgsUrls[0], imgNum, 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 650, 1900, 410, 0, 650, 1900, 410)
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
        moveMouse.drection = moveMouse.clientX - moveMouse.oldX > 0 ? 2 : 4;
        if (moveMouse.status == 0) {
            showImg(event.clientX, event.clientY, imgsUrls[0]);
        }
        if (moveMouse.status == 1) {
            showImg(event.clientX, event.clientY, imgsUrls[1]);
        }
    }
}