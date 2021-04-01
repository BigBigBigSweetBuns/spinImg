// 获得一个数组，数组包含这每帧（图片）到下一帧的时间差
let TPFlowerarr = function (last_speed, total_frames, total_time) {
    let arr = [];
    let acceleration = total_frames / total_time / total_time * 1000 * 1000; // 匀速加速度  

    console.log("arr", acceleration)
    while (last_speed < 500) {
        last_speed += acceleration;
        arr.push(last_speed);
    }
    console.log("arr", arr)
    return arr;
}
let TPF = function (total_frames, total_time) { //生成一个正加速度数组
    total_time = total_time / 2
    let arr = [];
    let last_time = 0;
    let a = total_frames / total_time / total_time * 1000 * 1000; // 匀速加速度
    for (let i = 1; i <= Math.floor(total_frames / 2); i++) { // 
        let time = Math.sqrt(2 * i / a) * 1000 // 转化为毫秒
        let interval = time - last_time;
        last_time = time;
        arr.push(Math.round(interval));
    }

    return arr;
}
// 将其生成的TPF，反转生成一个包含负加速数组
let output = function (total_frames, total_time) {
    let arr1 = [], arr = [];
    arr = TPF(total_frames, total_time)
    Object.assign(arr1, arr);
    arr1.reverse();
    if (total_frames % 2 !== 0)// 添加一个数作为补充
        arr.push(arr[arr.length - 1])
    arr.push(...arr1);
    return arr;
}
module.exports = output;
module.exports.TPFlowerarr = TPFlowerarr;