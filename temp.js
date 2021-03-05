var load = function (schedule = 30, total = 100) {
    // let red = 5000, total = 5000 //红色区域代表的金额和总金额
    let percent = schedule / total
    let right = document.getElementsByClassName('circle-right')[0]
    let left = document.getElementsByClassName('circle-left')[0]
    if (percent <= 0.5) {  //红色区域不超过一半
        right.style.transform = `rotate(${percent * 360}deg)`
    } else {    //红色区域超过一半的情况，重点部分
        right.style.transform = `rotate(180deg)`
        right.style.transition = `opacity 0s step-end 1s, transform 1s linear` //timing-function需要设为linear来达到视觉上的平缓过渡
        right.style.opacity = 0

        left.style.transition = `transform ${(percent - 0.5) / 0.5}s linear 1s`
        left.style.transform = `rotate(${percent * 360 - 180}deg)`
    }
}
var data = {
    one: [],
    two: []
};
let testdata = ["https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nvxz1t2j31900u0e81.jpg", "https://wx2.sinaimg.cn/mw1024/006yVIrkgy1g81nug4qjwj31900u0b29.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81numwi9yj31900u0b29.jpg", "https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nxu0jfxj30u0190hdt.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81nv2m6opj30u0190e81.jpg"];
var imgsUrls = [[], []];
// 暂时以循环代替 图片数组
for (let i = 1; i < 38; i++) {
    data.one.push(i + ".jpg");
}
for (let i = 38; i <= 89; i++) {
    data.two.push(i + ".jpg");
}

window.onload = function () {
    load();
    var list = [];//加载好后的图片存放
    var imgNum = 0;
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
    function loadImage(arrUrls) {
        let num = 0;
        let img = new Image();
        img.src = "./pic/" + arrUrls[num];
        img.addEventListener("load", loadHandler);
        function loadHandler(e) {
            imgsUrls[0].push(this.cloneNode());//复制当前图片元素
            num++;
            if (num > arrUrls.length - 1) {
                ctx.drawImage(imgsUrls[0][0], 0, 0);
                return;
            }
            this.src = "./pic/" + arrUrls[num]; //修改地址继续后触发load事件
        }
    }
    // 加载第一份图
    waitImgload(testdata, (res) => {
        imgsUrls[0] = res;
        console.log(imgsUrls[0])
    });
    waitImgload(data.one, (res) => {
        imgsUrls[0] = res;
        console.log(imgsUrls[0])
    });
    第二份图
    waitImgload(data.two, (res) => {
        imgsUrls[1] = res;
        console.log(imgsUrls[1])
    });
    function waitImgload(arrUrls, callback) {
        let promiseArr = [];
        for (let i = 0; i < arrUrls.length; i++) {
            promiseArr.push(new Promise((resolve) => {
                let img = new Image();
                img.src = arrUrls[i];
                // img.src = "./pic/" + arrUrls[i];
                let timer = setInterval(function () {
                    if (img.complete) {
                        load(num, arrUrls.length);
                        clearInterval(timer);
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

    function spining(frames) {
        frames = Math.floor(frames / 10);
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
    //*********** 实现切换效果  *************//
    let qie = document.getElementById("qie");
    qie.onclick = () => {
        moveMouse.status = moveMouse.status == 1 ? 0 : 1;
        if (moveMouse.status == 0) {
            imgSpining(imgsUrls[0], imgsUrls[1], 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 0, 1900, 350, 0, 0, 1900, 350)
            })
            imgSpining(imgsUrls[0], imgsUrls[1], 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 350, 1900, 300, 0, 350, 1900, 300);
            });
            imgSpining(imgsUrls[0], imgsUrls[1], 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 650, 1900, 410, 0, 650, 1900, 410)
            })
        } else {
            imgSpining(imgsUrls[1], imgsUrls[0], 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 0, 1900, 350, 0, 0, 1900, 350)
            })
            imgSpining(imgsUrls[1], imgsUrls[0], 2, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 350, 1900, 300, 0, 350, 1900, 300);
            });
            imgSpining(imgsUrls[1], imgsUrls[0], 4, 3000, (imgContent) => {
                ctx.drawImage(imgContent, 0, 650, 1900, 410, 0, 650, 1900, 410)
            })
        }
    }
    // 旋转一周
    function ImgSpiningLeft(imgsArr, time, callback) { // 图片组，持续的总时间（ms）
        let speed = Math.floor(time / (imgsArr.length - 1));
        let i = 0;
        let interval = setInterval(() => {
            if (i > imgsArr.length - 1) {
                clearInterval(interval);
            } else if (typeof callback == "function") {
                console.log("i", i);
                callback(imgsArr[i]);
            }
            i++;
        }, speed);
    }
    function ImgSpiningRight(imgsArr, time, callback) { // 图片组，持续的总时间（ms）
        let speed = Math.floor(time / (imgsArr.length - 1));
        let i = imgsArr.length - 1;
        let interval = setInterval(() => {
            if (i < 0) {
                clearInterval(interval);
            } else if (typeof callback == "function") {
                callback(imgsArr[i]);
            }
            i--;
        }, speed);
    }
    function imgSpining(imgsArr1, imgsArr2, drection, time, callback) {
        let length = Math.min(imgsArr1.length, imgsArr2.length);
        let min = false;
        let i = imgNum;
        let speed = Math.floor(time / (length - 1 - i));
        if (drection == 2) {// 右
            if (i < imgsArr1.length / 2) { // 小于的时候加多旋转的图片
                speed = Math.floor(time / (length - 1 + i));
                min = true;
            }
            let intarval = setInterval(() => {
                if (min && i == 0) {
                    min = false;
                    i = length - 1;
                }
                if (!min && i < 0) {
                    clearInterval(intarval);
                } else if (i < (length / 2)) {
                    callback(imgsArr2[i]);
                } else {
                    callback(imgsArr1[i]);
                }
                i--;
            })
        } else if (drection == 4) { //左
            if (i > length / 2) {
                speed = Math.floor(time / (length - 1 + (length - i)));
                min = true;
            }
            let intarval = setInterval(() => {
                if (min && i == length - 1) {
                    min = false;
                    i = 0;
                }
                if (!min && i > length - 1) {
                    clearInterval(intarval);
                } else if (i > (length / 2)) {
                    callback(imgsArr2[i]);
                } else {
                    callback(imgsArr1[i]);
                }
                i++;
            });
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