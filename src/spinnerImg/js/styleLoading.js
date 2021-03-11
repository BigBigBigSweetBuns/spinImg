module.exports = {
    scheduleOne: 0,
    scheduleTwo: 0,
    loadOne: function (total = 100) {
        this.scheduleOne++;
        let percent = this.scheduleOne / total
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
    },
    loadTwo: function (total = 100) {
        this.scheduleTwo++;
        let percent = this.scheduleTwo / total
        let right= document.getElementsByClassName('circle-right')[1]
        let left = document.getElementsByClassName('circle-left')[1]
        if (percent <= 0.5) {  //红色区域不超过一半
            left.style.transform = `rotate(${percent * 360}deg)`
        } else {    //红色区域超过一半的情况，重点部分
            left.style.transform = `rotate(180deg)`
            left.style.transition = `opacity 0s step-end 1s, transform 1s linear` //timing-function需要设为linear来达到视觉上的平缓过渡
            left.style.opacity = 0

            right.style.transition = `transform ${(percent - 0.5) / 0.5}s linear 1s`
            right.style.transform = `rotate(${percent * 360 - 180}deg)`
        }
    }
}