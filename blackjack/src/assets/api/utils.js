//通用工具包

/*
* 【生成UUID】
* */
export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/**
 * @return {boolean} 【捕捉事件】
 */
export function isEvent(x, w, y, h, offsetX, offsetY) {
  return (offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h);
}

/*
* 【重新绘制按钮】
* */
export function redrawBtn(canvas, btn, callback) {
  let ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(btn.x, btn.y, btn.w, btn.h);
    setTimeout(() => { //延时器，只执行一次
      ctx.drawImage(btn.img, btn.x, btn.y, btn.w, btn.h);
      if (callback) {
        callback();
      }
    }, 50);
  }
}

/**
 * 【移动动画】
 * @param canvas 画布
 * @param target 数组，包含目标动画对象（里面有x y w h等信息）
 * @param axis 数组，包含对象，有x坐标和y坐标
 * @param duration 动画时间
 * @param callback 回调,一个参数，如果是0表示执行这次动画之前，1表示执行这次动画之后，2表示完成动画
 */
export function moveAnimation(canvas, target, axis, duration, callback) {
  if(target.constructor === Array && target.length > 0){
    let animArr = [];
    let axisArr = [];
    for(let i = 0;i < target.length;i++){
      if(!target[i].anim){//判断没有在动画的放入动画list数组中
        target[i].anim = true;
        animArr.push(target[i]);
        axisArr.push({x:axis[i].x, y:axis[i].y});
      }
    }
    if(animArr.length > 0){
      let ctx = canvas.getContext('2d');
      let eachTime = 16.7;
      let times = duration / eachTime;
      let animMoveArr = [];
      let count = 0;
      for(let i = 0;i < animArr.length;i++){
        let target = animArr[i];
        let targetX = axisArr[i].x;
        let targetY = axisArr[i].y;
        let x = targetX - target.x;
        let y = targetY - target.y;
        let moveX = x / times;
        let moveY = y / times;
        animMoveArr.push({moveX:moveX, moveY:moveY, targetX:targetX, targetY:targetY});
      }
      let inter = setInterval(() => {
        for(let i = 0;i < animMoveArr.length;i++) ctx.clearRect(animArr[i].x, animArr[i].y, animArr[i].w, animArr[i].h);//把所有对象清除
        if(callback) callback(0);//清除后回调一个函数
        for(let i = 0;i < animMoveArr.length;i++){
          animArr[i].x += animMoveArr[i].moveX;
          animArr[i].y += animMoveArr[i].moveY;
        }
        if(count >= times){
          for(let i = 0;i < animMoveArr.length;i++){
            animArr[i].x = animMoveArr[i].targetX;
            animArr[i].y = animMoveArr[i].targetY;
            clearInterval(inter);
            animArr[i].anim = false;
            ctx.drawImage(animArr[i].img, animArr[i].x, animArr[i].y, animArr[i].w, animArr[i].h);
          }
          if(callback) callback(2);
        }else{
          for(let i = 0;i < animMoveArr.length;i++)ctx.drawImage(animArr[i].img, animArr[i].x, animArr[i].y, animArr[i].w, animArr[i].h);
          count++;
        }
      }, eachTime);
    }
  }
}

/**
 * 【缩小还原效果（用于按钮被点击后的动画】
 * @param canvas 画布
 * @param target 目标
 * @param sizePercent 放大或者缩小的比例
 * @param duration 一共花费的时间
 * @param callback 回调,一个参数，如果是0表示执行这次动画之前，1表示执行这次动画之后，2表示完成动画
 */
export function resizeAnimation(canvas, target, sizePercent, duration, callback) {
  if (sizePercent < 0) return;
  let ctx = canvas.getContext('2d');
  if (ctx) {
    let originX = target.x;
    let originY = target.y;
    let originW = target.w;
    let originH = target.h;
    let targetW = target.w * sizePercent;
    let targetH = target.h * sizePercent;
    let targetX = target.x + (target.w - targetW) / 2;
    let targetY = target.y + (target.h - targetH) / 2;
    let x = targetX - target.x;
    let y = targetY - target.y;
    let w = targetW - target.w;
    let h = targetH - target.h;
    let eachTime = 16.7;
    let times = duration / eachTime / 2;
    let moveX = x / times;
    let moveY = y / times;
    let moveW = w / times;
    let moveH = h / times;
    let count = 0;
    let interval = setInterval(() => {
      ctx.clearRect(target.x, target.y, target.w, target.h);
      target.x += moveX;
      target.y += moveY;
      target.w += moveW;
      target.h += moveH;
      if (count >= times) {
        target.x = targetX;
        target.y = targetY;
        target.w = targetW;
        target.h = targetH;
        clearInterval(interval);
        ctx.drawImage(target.img, target.x, target.y, target.w, target.h);
        interval = setInterval(() => {
          ctx.clearRect(target.x, target.y, target.w, target.h);
          target.x -= moveX;
          target.y -= moveY;
          target.w -= moveW;
          target.h -= moveH;
          if (count >= times * 2) {
            target.x = originX;
            target.y = originY;
            target.w = originW;
            target.h = originH;
            ctx.drawImage(target.img, target.x, target.y, target.w, target.h);
            clearInterval(interval);
            if (callback) callback(2);
            return;
          }
          ctx.drawImage(target.img, target.x, target.y, target.w, target.h);
          count++;
        }, eachTime);
        return;
      }
      ctx.drawImage(target.img, target.x, target.y, target.w, target.h);
      count++;
    }, eachTime);
  }
}

/**
 * 【创建Img对象】
 * @param map 存放图片的map
 * @param sum 用于统计已经多少个图片加载好了
 * @param paths 图片路径
 * @param names 图片名字
 * @param callback 回调
 * @param step 步数
 */
export function createImgs(map, sum, paths, names, callback, step = 0) { //download 图片
  if (step >= paths.length) {
    callback();//完成
    return;
  }
  let path = paths[step];
  let name = names[step];
  let img = new Image();
  img.src = path;
  img.onload = () => {
    sum.count++;
    createImgs(map, sum, paths, names, callback, step + 1);
  };
  map[name] = img;
}

/*
* 【创建Audio对象】
* */
export function createAudios(map, sum, paths, names, callback, step = 0) { //download 音频
  if (step >= paths.length) {
    callback();
    return;
  }
  let path = paths[step];
  let name = names[step];
  let audio = new Audio(path);
  sum.count++;
  createAudios(map, sum, paths, names, callback, step + 1);
  map[name] = audio;
}

/*
* 【图片旋转（用于扑克牌翻转】
* */
export function imgRotate(canvas, target, img, duration, callback) // 图片旋转
{
  let ctx = canvas.getContext('2d');
  let width = target.w;
  let x = target.x;
  if (ctx) {
    let interval = setInterval(() => {
      if (width <= target.w * 0.3) {
        clearInterval(interval);
        let interval2 = setInterval(() => {
          if (width >= target.w) {
            ctx.clearRect(target.x, target.y, target.w, target.h);
            ctx.drawImage(img, target.x, target.y, target.w, target.h);
            clearInterval(interval2);
            if(callback)callback(2);
            return;
          }
          width += 10;
          x -= 5;
          ctx.clearRect(target.x, target.y, target.w, target.h);
          if(callback)callback(0);
          ctx.drawImage(img, x, target.y, width, target.h);
        }, duration);
        return;
      }
      width -= 10;
      x += 5;
      ctx.clearRect(target.x, target.y, target.w, target.h);
      if(callback)callback(0);
      ctx.drawImage(target.img, x, target.y, width, target.h);
    }, duration);
  }
}

/*
* 【进度条】
* */
export function bar(vue, percent) {
  let canvas = vue.canvasMap['barCanvas'];
  let ctx = canvas.getContext('2d');
  if (ctx) {
    let w = vue.width * 0.65;
    let h = vue.height * 0.025;
    let x = (vue.width - w) / 2;
    let y = vue.height * 0.65;
    ctx.clearRect(0, 0, vue.width, vue.height);
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.strokeRect(x, y, w, h);
    let gap = 3;
    let loadW = w * percent;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    let wid = w * percent;
    ctx.fillRect(x + gap, y + gap, loadW - 2 * gap, h - 2 * gap);
  }
}
