let imgSrcBase = "../src/static/images/";
module.exports = {
    data: {
        one: [],
        two: []
    },
    testdata: ["https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nvxz1t2j31900u0e81.jpg", "https://wx2.sinaimg.cn/mw1024/006yVIrkgy1g81nug4qjwj31900u0b29.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81numwi9yj31900u0b29.jpg", "https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nxu0jfxj30u0190hdt.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81nv2m6opj30u0190e81.jpg"],
    getDataOne: function () {
        for (let i = 1; i < 38; i++) {
            this.data.one.push(imgSrcBase + i + ".jpg");
        }
        return this.data.one;
    },
    getDataTwo: function () {
        for (let i = 38; i <= 89; i++) {
            this.data.two.push(imgSrcBase + i + ".jpg");
        }
        return this.data.two;
    }
}
