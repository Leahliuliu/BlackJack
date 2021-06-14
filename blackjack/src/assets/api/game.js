import {createAudios, createImgs, bar, isEvent, resizeAnimation, moveAnimation, imgRotate} from './utils'
import PATH from "./paths";
import {Btn, Card} from "./objectFactory";
import axis from './axis';
import {updateGrade} from "./request";

/*
* 【游戏页面的逻辑与动画都在这里】
* 为保证页面动画及事件加载的正常进行，多使用回调函数进行处理
* */
function notNull() {
  for (let i = 0; i < arguments.length; i++) { //arguments为传进去函数中的参数数组
    if (!arguments[i]) {
      return false;
    }
  }
  return true;
}

const $ = {
  vue: null,
  /**
   * 【初始化页面宽高】
   */
  init() {
    let vue = $.vue;
    let height = vue.height; //canvas高度
    let width = vue.width;
    let w = vue.getViewportSize().width; //屏幕宽度
    let h = vue.getViewportSize().height;
    document.getElementById('app').style.height = h + 'px';
    if (h < height && w > width) { //小大
      vue.height = h;
      vue.width = h * (16 / 9);
      console.log(vue.width, vue.height)
    } else if (h > height && w < width) {
      vue.height = w * (9 / 16);
      vue.width = w;
    } else {
      let ww = h * (16 / 9);
      if (ww > w) {
        let hh = w * (9 / 16);
        vue.width = w;
        vue.height = hh;
      } else {
        vue.width = ww;
        vue.height = h;
      }
    }
    vue.percent = vue.width / 1280;
  },
  /**
   * 【把所有canvas放入map中】
   */
  putAllCanvasToMap() {
    let vue = $.vue;
    let backCanvas = document.getElementById('backCanvas'); //背景图层
    let titleCanvas = document.getElementById("titleCanvas"); //游戏logo
    let barCanvas = document.getElementById("barCanvas"); //进度条
    let cardPointsCanvas = document.getElementById('cardPointsCanvas');
    let gradeCanvas = document.getElementById("gradeCanvas"); //分数修改
    let buttonCanvas = document.getElementById("buttonCanvas"); //按钮显示图层
    let cardCanvas = document.getElementById("cardCanvas"); //按钮显示图层
    let moneyCanvas = document.getElementById("moneyCanvas"); //画金币
    let eventCanvas = document.getElementById("eventCanvas"); //捕捉事件图层
    let resultCanvas = document.getElementById("resultCanvas"); //对局结果图层
    vue.canvasMap['backCanvas'] = backCanvas;
    vue.canvasMap['titleCanvas'] = titleCanvas;
    vue.canvasMap['barCanvas'] = barCanvas;
    vue.canvasMap['gradeCanvas'] = gradeCanvas;
    vue.canvasMap['buttonCanvas'] = buttonCanvas;
    vue.canvasMap['cardPointsCanvas'] = cardPointsCanvas;
    vue.canvasMap['cardCanvas'] = cardCanvas;
    vue.canvasMap['eventCanvas'] = eventCanvas;
    vue.canvasMap['moneyCanvas'] = moneyCanvas;
    vue.canvasMap['resultCanvas'] = resultCanvas;
  },
  /**
   * 【画主页面也就是初始化界面】
   */
  drawMainPage() {
    let vue = $.vue;
    let backCtx = $.canvas('backCanvas').getContext('2d');
    let titleCtx = $.canvas('titleCanvas').getContext('2d');
    if (notNull(backCtx, titleCtx)) {
      //画背景
      let bgImg = new Image();
      bgImg.src = require("../img/background/bgMenu.png");
      //在绘制图像时，一定要确保图片被加载完成
      bgImg.onload = function () {
        backCtx.drawImage(this, 0, 0, vue.width, vue.height); //画背景
      };

      //画标题
      let titleImg = new Image();
      titleImg.src = require("../img/background/gameTitle.png");
      titleImg.onload = function () {
        let h = vue.height * 0.36;
        let w = h * (this.width / this.height);
        titleCtx.drawImage(this, (vue.width - w) / 2, vue.height * 0.16, w, h); //画游戏logo
      };
    }
  },
  /**
   * 【加载所有的图片和音频】，【绘制进入页面的进度条】
   * @param PATH 图片路径等
   * @param ck 回调
   */
  loadAllFiles(ck) {
    let vue = $.vue;
    let total = 0;
    for (let k in PATH) {
      total += PATH[k].path.length;
    }
    let sum = {count: 0};
    createImgs(vue.cardImgMap, sum, PATH['card'].path, PATH['card'].name, () => {
      createImgs(vue.btnImgMap, sum, PATH['button'].path, PATH['button'].name, () => {
        createImgs(vue.bgImgMap, sum, PATH['background'].path, PATH['background'].name, () => {
          createAudios(vue.audioMap, sum, PATH['audio'].path, PATH['audio'].name, () => {
            createImgs(vue.gameResultsImgMap, sum, PATH['gameResults'].path, PATH['gameResults'].name, () => {
            });
          });
        });
      });
    });
    let inter = setInterval(() => {
      bar(vue, sum.count / total);
      if (sum.count === total) {
        clearInterval(inter);
        axis.getButtons(vue);
        axis.getCards(vue);
        $.createObject(vue.btnImgMap, vue.btnMap, vue.axis.btns, Btn);
        $.createObject(vue.cardImgMap, vue.cardMap, vue.axis.cards, Card);
        $.canvas('barCanvas').getContext('2d').clearRect(0, 0, vue.width, vue.height);
        if (ck) ck();
      }
    }, 20);
  },
  /**
   * 【画进度条加载完成后的主页按钮】
   * */
  drawMainPageAfterLoading() {
    let vue = $.vue;
    let w = vue.width;
    let h = vue.height;
    let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
    if (notNull(buttonCtx)) {
      $.drawGrade();
      //画button
      $.drawImage(buttonCtx, vue.btnMap['btnPlay']).disabled = false;
      $.drawImage(buttonCtx, vue.btnMap['btnMenu']).disabled = false;
      $.drawImage(buttonCtx, vue.btnMap['btnSound']).disabled = false;
    }
  },
  /**
   * 【画左上角的分数】
   */
  drawGrade() {
    let vue = $.vue;
    let gradeCtx = $.canvas('gradeCanvas').getContext('2d');
    if (notNull(gradeCtx)) {
      //画grade
      let o = $.drawImage(gradeCtx, vue.btnMap['moneyBar']);
      gradeCtx.textBaseline = 'middle';
      gradeCtx.font = 'bold 30px 宋体';
      gradeCtx.fillStyle = 'rgb(255,255,255)';
      gradeCtx.fillText(vue.grade, o.x + o.w / 3, o.y + o.h / 2);
      if (vue.grade > vue.user.bestGrade) {
        vue.user.bestGrade = vue.grade;
      }
    }
  },
  /**
   * 【在画布上清除该对象】，并返回该对象
   * @param ctx 画布
   * @param o 对象
   * @returns {*}
   */
  clearImage(ctx, o) {
    ctx.clearRect(o.x, o.y, o.w, o.h);
    return o;
  },
  /**
   * 【在画布上画出该对象】，并返回该对象
   */
  drawImage(ctx, o) {
    $.clearImage(ctx, o);
    ctx.drawImage(o.img, o.x, o.y, o.w, o.h);
    return o;
  },
  /**
   * 【创建对应对象】
   * @param imgMap 图片Map
   * @param objMap 对象Map
   * @param ax 坐标
   * @param Obj 构造函数
   */
  createObject(imgMap, objMap, ax, Obj) {
    for (let key in ax) {
      if (key.indexOf('valueBar') !== -1) {
        objMap[key] = new Obj(imgMap['valueBar'], ax[key].x, ax[key].y, ax[key].w, ax[key].h);
      } else if (imgMap.hasOwnProperty(key)) {
        objMap[key] = new Obj(imgMap[key], ax[key].x, ax[key].y, ax[key].w, ax[key].h); //创建好存到对象map中
      }
    }
  },
  /**
   * 【播放音乐】
   */
  playSound(name) {
    let vue = $.vue;
    if (vue.needSound) {
      new Audio(vue.audioMap[name].src).play();//新建不同的音乐文件
    }
  },
  /*
  * 【获取画布对象】
  * */
  canvas(name) {
    let vue = $.vue;
    return vue.canvasMap[name];
  },
  /*******************************
   * 【后面开始游戏内容】
   * ********************************************/
  /*
  * 【捕捉各个button触发事件】
  * */
  initEvent() {
    let vue = $.vue;
    let eventCanvas = $.canvas('eventCanvas');
    let btnMap = vue.btnMap;
    let gradeCtx = $.canvas('gradeCanvas').getContext('2d');
    let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
    if (notNull(gradeCtx, buttonCtx)) {
      eventCanvas.onclick = (e) => {
        for (let k in btnMap) { //遍历button对象
          let btn = btnMap[k];
          if (!btn.disabled && isEvent(btn.x, btn.w, btn.y, btn.h, e.offsetX, e.offsetY)) {
            resizeAnimation($.canvas('buttonCanvas'), btn, 0.8, 100, () => {
              if (vue.needSound) {
                if (k.indexOf('chips_') !== -1) {
                  $.playSound('chipsHandle');
                  if (vue.chipsNeedClear) {
                    $.drawImage(buttonCtx, vue.btnMap['btnClear']).disabled = false;
                  }
                } else {
                  $.playSound('Click');
                }
              }
              if (k === 'btnPlay') {
                $.handleBtnPlay();
              } else if (k === 'btnMenu') {
                $.handleBtnMenu();
              } else if (k === 'btnSound') {
                $.handleBtnSound();
              } else if (k === 'easy') {
                $.play(0);
              } else if (k === 'medium') {
                $.play(1);
              } else if (k === 'hard') {
                $.play(2);
              } else if (k === 'chips_01') {
                $.handleChips(btn, 10);
              } else if (k === 'chips_02') {
                $.handleChips(btn, 20);
              } else if (k === 'chips_03') {
                $.handleChips(btn, 50);
              } else if (k === 'chips_04') {
                $.handleChips(btn, 100);
              } else if (k === 'deal') { //开始游戏
                $.handleDeal();
              } else if (k === 'btnClear') {
                $.handleBtnClear();
              } else if (k === 'stand') { //停止发牌
                $.stand();
              } else if (k === 'hit') { //加牌
                $.hit();
              }
            })
          }
        }
      }
    }
  },
  /*
  * 【处理Play按钮点击事件】
  * */
  handleBtnPlay() {
    let vue = $.vue;
    if (!vue.isLogin) {
      vue.drawer = true;
    } else {
      //登录成功
      let btn = vue.btnMap['btnPlay'];
      let titleCtx = $.canvas('titleCanvas').getContext('2d');
      let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
      if (notNull(titleCtx, buttonCtx)) {
        titleCtx.clearRect(0, 0, vue.width, vue.height);
        buttonCtx.clearRect(btn.x, btn.y, btn.w, btn.h);
        btn.disabled = true;
        titleCtx.textBaseline = 'middle';
        titleCtx.font = 'bold 30px 宋体';
        titleCtx.fillStyle = 'rgb(255,255,255)';
        titleCtx.fillText("请选择游戏模式", (vue.width - 210) / 2, vue.height * 0.15);
        $.drawImage(buttonCtx, vue.btnMap['easy']).disabled = false;
        $.drawImage(buttonCtx, vue.btnMap['medium']).disabled = false;
        $.drawImage(buttonCtx, vue.btnMap['hard']).disabled = false;
      }
    }
  },
  /*
  * 【弹出用户页面】
  * */
  handleBtnMenu() {
    let vue = $.vue;
    vue.drawer = true;
  },
  /*
  * 【是否静音】
  * */
  handleBtnSound() {
    let vue = $.vue;
    let btn = vue.btnMap['btnSound'];
    let btnCtx = $.canvas('buttonCanvas').getContext('2d');
    if (notNull(btnCtx)) {
      vue.needSound = !vue.needSound;
      if (!vue.needSound) {
        btnCtx.fillStyle = 'rgba(0,0,0,0.3)'; //静音效果
        btnCtx.fillRect(btn.x, btn.y, btn.w, btn.h); //x轴 y轴 宽度 高度（画一个矩形
      } else {
        btnCtx.clearRect(btn.x, btn.y - 10, btn.w + 10, btn.h + 20);
        btnCtx.drawImage(btn.img, btn.x, btn.y, btn.w, btn.h);
      }
    }
  },
  /*
  * 【根据选择的游戏模式0、1、2 进行开局】
  * */
  play(mode) {
    let vue = $.vue;
    vue.btnMap['easy'].disabled = true;
    vue.btnMap['medium'].disabled = true;
    vue.btnMap['hard'].disabled = true;
    let titleCtx = $.canvas('titleCanvas').getContext('2d');
    let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
    let backCtx = $.canvas('backCanvas').getContext('2d');
    let cardCtx = $.canvas('cardCanvas').getContext('2d');
    if (notNull(titleCtx, buttonCtx, backCtx, cardCtx)) {
      vue.mode = mode;
      let btnMap = vue.btnMap;
      titleCtx.clearRect(0, 0, vue.width, vue.height); //清标题
      $.clearImage(buttonCtx, btnMap['easy']);
      $.clearImage(buttonCtx, btnMap['medium']);
      $.clearImage(buttonCtx, btnMap['hard']);
      backCtx.drawImage(vue.bgImgMap['bgGame'], 0, 0, vue.width, vue.height); //换背景

      //画发牌图
      let cardMap = vue.cardMap;
      $.drawImage(cardCtx, cardMap['cards']);
      $.drawImage(buttonCtx, btnMap['deal']).disabled = false;
      for (let i = 1; i <= 4; i++) $.drawImage(buttonCtx, btnMap['chips_0' + i]).disabled = false;

      //画中间bet数字
      $.drawBetBar();
    }
  },
  /*
  * 【4种金币 押注】
  * */
  handleChips(btn, v) {
    let vue = $.vue;
    if (vue.isBetAnimAllow) {
      vue.isBetAnimAllow = false;
      vue.bet += v;
      $.drawBetBar(); //押注总额
      $.drawBetAnim(btn); //金币动画
    }
  },
  /*
  * 【处理Deal按钮点击事件】
  * */
  handleDeal() {
    let vue = $.vue;
    vue.isBetAnimAllow = false;
    vue.chipsNeedClear = false;
    let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
    let cardCtx = $.canvas('cardCanvas').getContext('2d');
    if (vue.bet === 0) {
      vue.$message.error("您还没有押注！");//开局前必须有押注
    } else {
      if (notNull(buttonCtx, cardCtx)) {
        let players = vue.players;
        let selectedPlayer = [0];
        let btnMap = vue.btnMap;
        let cardMap = vue.cardMap;
        $.clearImage(buttonCtx, vue.btnMap['btnClear']).disabled = true;

        $.clearImage(buttonCtx, btnMap['deal']).disabled = true;
        $.drawImage(buttonCtx, btnMap['stand']).disabled = false;
        $.drawImage(buttonCtx, btnMap['hit']).disabled = false;

        //画出计分板
        $.drawImage(buttonCtx, btnMap['valueBarPlayer']);
        players.grade.push(0);
        players.btns.push(btnMap['valueBarPlayer']);
        if (vue.mode === 0) { //简单模式 1v1
          $.drawImage(buttonCtx, btnMap['valueBarMode0']);
          players.btns.push(btnMap['valueBarMode0']);
          selectedPlayer.push(1);
          players.grade.push(0);

        } else if (vue.mode === 1) { //中等模式 1v2
          for (let i = 1; i <= 2; i++) $.drawImage(buttonCtx, btnMap['valueBarMode1_' + i]);
          players.btns.push(btnMap['valueBarMode1_1'], btnMap['valueBarMode1_2']);
          selectedPlayer.push(1, 2);
          players.grade.push(0, 0);

        } else if (vue.mode === 2) { //困难模式 1v3
          for (let i = 1; i <= 3; i++) $.drawImage(buttonCtx, btnMap['valueBarMode2_' + i]);
          players.btns.push(btnMap['valueBarMode2_1'], btnMap['valueBarMode2_2'], btnMap['valueBarMode2_3']);
          selectedPlayer.push(1, 2, 3);
          players.grade.push(0, 0, 0);
        }

        let c = cardMap['cardBack_red4'];
        for (let i = 0; i < players.btns.length; i++) {
          players.cards.push([new Card(c.img, c.x, c.y, c.w, c.h)]);
        }

        //resetCard
        let cardsBox = vue.cardsBox;
        cardsBox.randomArr = [];
        let grade = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 10, 10];
        for (let i = 2; i < PATH.card.path.length; i++) {
          cardsBox.cardsName.push(PATH.card.name[i]);
          cardsBox.grade.push(grade[(i - 2) % 13]);
          cardsBox.randomArr.push(i - 2);
        }

        let random = $.randomCard(selectedPlayer.length);
        vue.animObj.isAnim = true;
        $.sendCards(selectedPlayer, () => {
          $.drawCardGrade(selectedPlayer, random.grades);//画分数
          $.rotateCards(selectedPlayer, random.imgs, () => {
            $.sendCards(selectedPlayer, () => {
              random = $.randomCard(1);
              $.drawCardGrade([0], random.grades);//画分数
              $.rotateCards([0], random.imgs, () => {
                if (players.grade[0] === 21) { //玩家两张牌恰好21点时
                  let resultCtx = $.canvas('resultCanvas').getContext('2d');
                  let blackJackImg = vue.gameResultsImgMap['blackjack'];
                  let percent = vue.percent;
                  let h = blackJackImg.height * percent;
                  let w = blackJackImg.width * percent;
                  let x = (vue.width - w) / 2;
                  let y = vue.height * 0.5;
                  if (notNull(resultCtx)) {
                    $.playSound('youWin');
                    resultCtx.drawImage(blackJackImg, x, y, w, h);
                    vue.grade = vue.grade + parseInt(vue.bet * 1.5);
                    $.drawGrade();
                  }
                  $.moveAllCash(0, () => {
                    $.resetGame(false);
                    vue.animObj.isAnim = false;
                  });
                } else {
                  vue.animObj.isAnim = false;
                  vue.isBetAnimAllow = true;
                }
              });
            });
          });
        });
      }
    }
  },
  /*
  * 【Clear按钮处理——清掉开局前玩家的初始押注】
  * */
  handleBtnClear() {
    let vue = $.vue;
    if (vue.isBetAnimAllow) {
      vue.bet = 0;
      $.drawBetBar();
      $.clearBetMoney();
    }
  },
  /*
  * 【stand按钮处理——结束发牌（其他玩家开始操作）】
  * */
  stand() {
    let vue = $.vue;
    for (let k in vue.btnMap) vue.btnMap[k].disabled = true;
    vue.btnMap['btnSound'].disabled = false;
    vue.btnMap['btnMenu'].disabled = false;
    if (!vue.animObj.isAnim) {
      vue.animObj.isAnim = true;
      $.computePlayerGrade(() => {
        let players = vue.players;
        let v = -1;
        for (let i = 1; i < players.grade.length; i++) {
          if (players.grade[i] > v && players.grade[i] <= 21) {
            v = players.grade[i];
          }
        }
        let whoWin = 0;
        let resultCtx = $.canvas('resultCanvas').getContext('2d');
        let winImg = vue.gameResultsImgMap['win']; //玩家赢
        let loseImg = vue.gameResultsImgMap['lose']; //玩家输
        let pushImg = vue.gameResultsImgMap['push']; //平局

        let percent = vue.percent;
        let y = vue.height * 0.5;
        let winH = winImg.height * percent;
        let winW = winImg.width * percent;
        let winX = (vue.width - winW) / 2;
        let loseH = loseImg.height * percent;
        let loseW = loseImg.width * percent;
        let loseX = (vue.width - loseW) / 2;
        let pushH = pushImg.height * percent;
        let pushW = pushImg.width * percent;
        let pushX = (vue.width - pushW) / 2;

        if (notNull(resultCtx)) {
          if (v > 0) {
            if (players.grade[0] > v) { //玩家胜
              $.playSound('youWin');
              resultCtx.drawImage(winImg, winX, y, winW, winH);
              vue.grade += vue.bet;
              $.drawGrade();

            } else if (players.grade[0] === v) { //平局
              $.playSound('Push');
              resultCtx.drawImage(pushImg, pushX, y, pushW, pushH);

            } else { //电脑胜
              whoWin = 1;
              $.playSound('youLose');
              resultCtx.drawImage(loseImg, loseX, y, loseW, loseH);
              vue.grade -= vue.bet;
              $.drawGrade();
            }
          } else {
            $.playSound('youWin');
            resultCtx.drawImage(winImg, winX, y, winW, winH);
            vue.grade += vue.bet;
            $.drawGrade();
          }
        }
        $.moveAllCash(whoWin, () => {
          $.resetGame(false);
          vue.animObj.isAnim = false;
        });
      });
    }
  },
  /*
  * 【hit按钮事件处理——玩家要求继续发牌】
  * */
  hit(callback) {
    let vue = $.vue;
    vue.isBetAnimAllow = false;
    if (!vue.animObj.isAnim) {
      vue.animObj.isAnim = true;
      $.sendCards([0], () => {
        let random = $.randomCard(1);
        $.drawCardGrade([0], random.grades);
        $.rotateCards([0], random.imgs, () => {
          if (vue.players.grade[0] > 21) { //牌加多了，玩家爆牌
            $.playSound('youLose');
            let resultCtx = $.canvas('resultCanvas').getContext('2d');
            let loseImg = vue.gameResultsImgMap['lose'];
            let percent = vue.percent;
            let h = loseImg.height * percent;
            let w = loseImg.width * percent;
            let x = (vue.width - w) / 2;
            let y = vue.height * 0.5;
            if (notNull(resultCtx)) {
              resultCtx.drawImage(loseImg, x, y, w, h);
              vue.grade -= vue.bet;
              $.drawGrade();

              let selectedPlayer = [];
              for (let i = 1; i <= vue.mode + 1; i++) { //mode 为 0、1、2
                selectedPlayer.push(i);
              }
              let random = $.randomCard(selectedPlayer.length);
              $.drawCardGrade(selectedPlayer, random.grades);
              $.rotateCards(selectedPlayer, random.imgs);
              vue.animObj.isAnim = false;
            }
            $.moveAllCash(1, () => {
              $.resetGame(false);
              vue.animObj.isAnim = false;
              if (callback) callback();
            });
          } else {
            vue.animObj.isAnim = false;
            vue.isBetAnimAllow = true;
            if (callback) callback();
          }
        });
      });
    }
  },
  /*
  * 【其他电脑玩家操作】
  * */
  computePlayerGrade(cb) {
    let vue = $.vue;
    let players = vue.players;
    let thred1 = 15; //给电脑设置阈值（牌的值在15-18之间是，50%随机选择是否继续加牌
    let thred2 = 18;
    let cardCanvas = vue.canvasMap['cardCanvas'];
    let obj = this;

    function send(playerIndex) {
      if (playerIndex >= players.btns.length) {
        if (cb) cb();
        return;
      }
      let random = obj.randomCard(1);
      obj.drawCardGrade([playerIndex], random.grades);
      obj.rotateCards([playerIndex], random.imgs, () => {
        let grade = players.grade[playerIndex];
        let half = Math.random();
        if (grade > 21) {
          send(playerIndex + 1);
        } else if (grade >= thred2) {
          send(playerIndex + 1);
        } else if (grade >= thred1) {
          if (half > 0.5) { //不发了
            send(playerIndex + 1);
          } else { //继续发牌
            obj.sendCards([playerIndex], () => {
              send(playerIndex);
            });
          }
        } else {
          obj.sendCards([playerIndex], () => {
            send(playerIndex);
          });
        }
      });
    }

    send(1);
  },
  /**
   * 【画中间押注金额bet】
   */
  drawBetBar() {
    let ctx = $.canvas('gradeCanvas').getContext('2d');
    let vue = $.vue;
    if (ctx) {
      let betBarImg = vue.btnImgMap['betBar'];
      let percent = vue.percent;
      let h = betBarImg.height * percent;
      let w = betBarImg.width * percent;
      let x = (vue.width - w) / 2;
      let y = vue.height * 0.67;
      ctx.clearRect(x, y, w, h);
      ctx.drawImage(betBarImg, x, y, w, h);

      ctx.textBaseline = 'middle';
      ctx.font = 'bold 30px 宋体';
      ctx.fillStyle = 'rgb(255,255,255)';
      let fontWidth = ctx.measureText(vue.bet).width;
      ctx.fillText(vue.bet, (vue.width - fontWidth) / 2, y + h / 3 * 2);
    }
  },
  /*
  * 【玩家开局前的初始押注可以撤销重新押注，开局后只能加注不能撤销】
  * */
  clearBetMoney() {
    let vue = $.vue;
    let moneyCtx = $.canvas('moneyCanvas').getContext('2d');
    let buttonCtx = $.canvas('buttonCanvas').getContext('2d');
    if (notNull(moneyCtx, buttonCtx)) {
      let x = vue.width * 0.3;
      let y = vue.height * 0.8;
      let w = vue.width * 0.35;
      let h = vue.height * 0.19;
      moneyCtx.clearRect(x, y, w, h);
      $.clearImage(buttonCtx, vue.btnMap['btnClear']).disabled = true;
      vue.allBetBtn = [];
    }
  },
  /*
  * 【押注动画】
  * */
  drawBetAnim(btn) {
    let vue = $.vue;
    let moneyCtx = $.canvas('moneyCanvas').getContext('2d');
    if (notNull(moneyCtx)) {
      let percent = 0.7;
      let x = vue.width * 0.325; //押注金币显示区域
      let y = vue.height * 0.8;
      let w = vue.width * 0.325;
      let h = vue.height * 0.19;
      let allBetBtn = vue.allBetBtn;
      let imgW = btn.w * percent;
      let imgH = btn.h * percent;
      let imgX = Math.random() * (w - imgW) + x;
      let imgY = Math.random() * (h - imgH) + y;
      let tmpButton = new Btn(btn.img, (vue.width - imgW) / 2, vue.height, imgW, imgH);
      moveAnimation($.canvas('moneyCanvas'), [tmpButton], [{x: imgX, y: imgY}], 200, (state) => {
        if (state === 0) {
          moneyCtx.clearRect(x, y, w, h);
          for (let i = 0; i < allBetBtn.length; i++) {
            let btn = allBetBtn[i];
            moneyCtx.drawImage(btn.img, btn.x, btn.y, btn.w, btn.h);
          }
        } else if (state === 2) {
          allBetBtn.push(tmpButton);
          vue.isBetAnimAllow = true;
        }
      });
    }
  },
  /*
  * 【初始化随机牌堆】
  * */
  randomCard(count) {
    let vue = $.vue;
    if (count > 0) {
      let cardsBox = vue.cardsBox;
      let c = 0;
      let res = [];
      let imgs = [];
      let grades = [];
      while (c !== count) {
        let randomValue = parseInt(Math.random() * cardsBox.randomArr.length);
        let v = cardsBox.randomArr.splice(randomValue, 1)[0];
        res.push(v);
        imgs.push(vue.cardMap[vue.cardsBox.cardsName[v]].img);
        grades.push(vue.cardsBox.grade[v]);
        c++;
      }
      return {
        seq: res,
        imgs: imgs,
        grades: grades
      };
    }
  },
  /*
  * 【给指定玩家发牌动画】
  * */
  sendCards(beSendPlayer, cb) {
    let vue = $.vue;
    let players = vue.players;
    let cardCtx = $.canvas('cardCanvas').getContext('2d');
    if (notNull(cardCtx) && beSendPlayer.constructor === Array && beSendPlayer.length > 0) {
      let btns = players.btns;
      let cards = players.cards;
      let gap = 40;
      let map_cards = vue.cardMap['cards'];
      let moveCards = [];
      let moveAxis = [];
      for (let i = 0; i < beSendPlayer.length; i++) {
        let index = beSendPlayer[i];
        let btn = players.btns[index];
        let len = players.cards[index].length;
        let card = players.cards[index][0];//将初始化背朝的牌的位置
        card.x = map_cards.x;
        card.y = map_cards.y;
        moveCards.push(card);
        moveAxis.push({x: (btn.x + btn.w) + len * gap, y: btn.y});
      }
      moveAnimation($.canvas('cardCanvas'), moveCards, moveAxis, 500, (state) => {
        if (state === 0) {
          cardCtx.clearRect(map_cards.x, map_cards.y, map_cards.w, map_cards.h);
          cardCtx.drawImage(map_cards.img, map_cards.x, map_cards.y, map_cards.w, map_cards.h);
          for (let i = 0; i < players.cards.length; i++) {
            let c = players.cards[i];
            for (let j = 1; j < c.length; j++) {
              cardCtx.clearRect(c[j].x, c[j].y, c[j].w, c[j].h);
              cardCtx.drawImage(c[j].img, c[j].x, c[j].y, c[j].w, c[j].h);
            }
          }
        } else if (state === 2) {
          for (let i = 0; i < beSendPlayer.length; i++) {
            let index = beSendPlayer[i];
            let c = players.cards[index][0];
            players.cards[index].push(new Card(c.img, c.x, c.y, c.w, c.h));
          }
          if (cb) cb();
        }
      });
    }
  },
  /*
  * 【计算并画出指定玩家的当前点数】
  * */
  drawCardGrade(beSelectedPlayer, grades) {
    let vue = $.vue;
    if (beSelectedPlayer.constructor === Array && grades.constructor === Array
      && beSelectedPlayer.length > 0 && beSelectedPlayer.length === grades.length) {
      let cardPointCtx = $.canvas('cardPointsCanvas').getContext('2d');
      if (notNull(cardPointCtx)) {
        cardPointCtx.textBaseline = 'middle';
        cardPointCtx.font = 'bold 25px 宋体';
        cardPointCtx.fillStyle = 'rgb(255,255,255)';
        cardPointCtx.clearRect(0, 0, vue.width, vue.height);
        let players = vue.players;
        for (let i = 0; i < beSelectedPlayer.length; i++) {
          let index = beSelectedPlayer[i];
          if (grades[i] === 11) {
            if (players.grade[index] + grades[i] > 21) {
              players.grade[index] += 1;
              continue;
            }
          }
          players.grade[index] += grades[i];
        }
        for (let i = 0; i < players.grade.length; i++) {
          let btn = players.btns[i];
          let fontWidth = cardPointCtx.measureText(players.grade[i]).width;
          cardPointCtx.fillText(players.grade[i] + "", btn.x + (btn.w - fontWidth) / 2, btn.y + btn.h / 2);
        }
      }
    }
  },
  /*
  * 【360度旋转扑克牌动画设计】
  * */
  rotateCards(beRotatePlayer, imgs, cb) {
    let vue = $.vue;
    let players = vue.players;
    let cardCtx = $.canvas('cardCanvas').getContext('2d');
    if (notNull(cardCtx) && beRotatePlayer.constructor === Array
      && beRotatePlayer.length > 0 && beRotatePlayer.length === imgs.length) {
      $.playSound('cardShove');
      let cards = players.cards;
      for (let i = 0; i < beRotatePlayer.length; i++) {
        let index = beRotatePlayer[i];
        let btn = players.btns[index];
        let card = players.cards[index][0];//将初始化背朝的牌的位置
        imgRotate($.canvas('cardCanvas'), card, imgs[i], 10, (state) => {
          if (state === 0) {
            for (let i = 1; i < players.cards[index].length - 1; i++) {//需要剔除第一个和最后个已经放置好的
              let c = cards[index][i];
              cardCtx.clearRect(c.x, c.y, c.w, c.h);
              cardCtx.drawImage(c.img, c.x, c.y, c.w, c.h);
            }
          }
          if (state === 2) {
            let len = players.cards[index].length;
            players.cards[index][len - 1].img = imgs[i];
            if (i === beRotatePlayer.length - 1 && cb) {
              cb();
            }
          }
        })
      }
    }
  },
  /*
  * 【得出胜负时，压得注金给赢得那一方】
  * */
  moveAllCash(whoWin, cb) {
    let vue = $.vue;
    let cashBtns = vue.allBetBtn;
    let cashAxis = [];
    for (let i = 0; i < cashBtns.length; i++) cashAxis.push({
      x: vue.width / 2,
      y: whoWin === 0 ? vue.height : 0 - cashBtns[i].h
    });
    moveAnimation($.canvas('moneyCanvas'), cashBtns, cashAxis, 500, (state) => {
      if (state === 2) {
        if (cb) cb();
      }
    })
  },
  /*
  * 【重置游戏】
  * */
  resetGame(isExit) {
    let vue = $.vue;
    updateGrade(vue.grade);
    vue.chipsNeedClear = true;
    let time = isExit ? 1 : 2000;
    vue.bet = 0;
    vue.allBetBtn = [];
    for (let k in vue.players) vue.players[k] = [];
    for (let k in vue.btnMap) vue.btnMap[k].disabled = true;
    setTimeout(() => {
      for (let k in vue.canvasMap) vue.canvasMap[k].getContext('2d').clearRect(0, 0, vue.width, vue.height);
      $.canvas('backCanvas').getContext('2d').drawImage(vue.bgImgMap['bgMenu'], 0, 0, vue.width, vue.height);
      if (isExit) {
        vue.isLogin = false;
        $.drawMainPage();
        $.drawMainPageAfterLoading();
      } else {
        $.drawMainPageAfterLoading();
        $.handleBtnPlay();
      }
      vue.isBetAnimAllow = true;
    }, time);
  },

};

export default $;
