import PATH from "./paths";
/*
* 【按钮和牌的位置和宽高】
* */
const axis = {
  getButtons(vue){
    let percent = vue.percent;
    let w = vue.width;
    let h = vue.height;
    let btnImgMap = vue.btnImgMap;
    vue.axis.btns = {
      btnPlay:{x:(w - btnImgMap['btnPlay'].width * percent) / 2, y:h * 0.58, w:btnImgMap['btnPlay'].width * percent, h:btnImgMap['btnPlay'].height * percent},
      btnClear:{x:w * 0.75, y:h * 0.72, w:btnImgMap['btnClear'].width * percent, h:btnImgMap['btnClear'].height * percent},
      btnMenu:{x:w * 0.87, y:h * 0.025, w:btnImgMap['btnMenu'].width * percent, h:btnImgMap['btnMenu'].height * percent},
      btnSound:{x:w * 0.93, y:h * 0.025, w:btnImgMap['btnSound'].width * percent, h:btnImgMap['btnSound'].height * percent},
      chips_01:{x:w * 0.65, y:h * 0.82, w:btnImgMap['chips_01'].width * percent, h:btnImgMap['chips_01'].height * percent},
      chips_02:{x:w * 0.73, y:h * 0.82, w:btnImgMap['chips_02'].width * percent, h:btnImgMap['chips_02'].height * percent},
      chips_03:{x:w * 0.81, y:h * 0.82, w:btnImgMap['chips_03'].width * percent, h:btnImgMap['chips_03'].height * percent},
      chips_04:{x:w * 0.89, y:h * 0.82, w:btnImgMap['chips_04'].width * percent, h:btnImgMap['chips_04'].height * percent},
      deal:{x:w * 0.05, y:h * 0.85, w:btnImgMap['deal'].width * percent, h:btnImgMap['deal'].height * percent},
      double:{x:w * 0.66, y:h * 0.85, w:btnImgMap['double'].width * percent, h:btnImgMap['double'].height * percent},
      easy:{x:(w - btnImgMap['easy'].width * percent) / 2, y:h * 0.25, w:btnImgMap['easy'].width * percent, h:btnImgMap['easy'].height * percent},
      hard:{x:(w - btnImgMap['hard'].width * percent) / 2, y:h * 0.65, w:btnImgMap['hard'].width * percent, h:btnImgMap['hard'].height * percent},
      hit:{x:w * 0.18, y:h * 0.85, w:btnImgMap['hit'].width * percent, h:btnImgMap['hit'].height * percent},
      medium:{x:(w - btnImgMap['hard'].width * percent) / 2, y:h * 0.45, w:btnImgMap['hard'].width * percent, h:btnImgMap['hard'].height * percent},
      moneyBar:{x:w * 0.022, y:h * 0.025, w:btnImgMap['moneyBar'].width * percent, h:btnImgMap['moneyBar'].height * percent},
      stand:{x:w * 0.015, y:h * 0.85, w:btnImgMap['stand'].width * percent, h:btnImgMap['stand'].height * percent},
      valueBarPlayer:{x:w * 0.38, y:h * 0.45, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode0:{x:w * 0.38, y:h * 0.10, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode1_1:{x:w * 0.15, y:h * 0.15, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode1_2:{x:w * 0.60, y:h * 0.15, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode2_1:{x:w * 0.1, y:h * 0.3, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode2_2:{x:w * 0.38, y:h * 0.10, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
      valueBarMode2_3:{x:w * 0.68, y:h * 0.3, w:btnImgMap['valueBar'].width * percent, h:btnImgMap['valueBar'].height * percent},
    }
  },
  getCards(vue){
    let percent = vue.percent * 0.8;
    let w = vue.width;
    let h = vue.height;
    let cardImgMap = vue.cardImgMap;
    let names = PATH.card.name;
    let obj = {};
    obj[names[0]] = {x:(w - cardImgMap[names[0]].width * percent) * 0.98, y:h * 0.56, w:cardImgMap[names[0]].width * percent, h:cardImgMap[names[0]].height * percent};
    obj[names[1]] = {x:(w - cardImgMap[names[1]].width * percent) * 0.98, y:h * 0.56, w:cardImgMap[names[1]].width * percent, h:cardImgMap[names[1]].height * percent};
    for (let i = 2; i < names.length; i++) {
      obj[names[i]] = {x:0, y:0, w:cardImgMap[names[i]].width * percent, h:cardImgMap[names[i]].height * percent};
    }
    vue.axis.cards = obj;
  }
};
export default axis;
