let imgSrcBase = "../src/static/images/";
module.exports = {
    testdata: ["https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nvxz1t2j31900u0e81.jpg", "https://wx2.sinaimg.cn/mw1024/006yVIrkgy1g81nug4qjwj31900u0b29.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81numwi9yj31900u0b29.jpg", "https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nxu0jfxj30u0190hdt.jpg", "https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81nv2m6opj30u0190e81.jpg"],
    getDataZero: function () {
        let data = new Array();
        for (let i = 0; i <= 68; i++) {
            data.push(imgSrcBase + "/doodle/0/" + i + ".png");
        }
        return data;
    },
    getDataOne: function () {
        let data = new Array();
        for (let i = 0; i <= 70; i++) {
            data.push(imgSrcBase + "/doodle/1/" + i + ".png");
        }
        return data;
    }
}
