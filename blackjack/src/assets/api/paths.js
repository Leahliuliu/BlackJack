//图片和音频链接
const PATH = {
  card:{
    path:[
      require('../img/cards/cards.png'),
      require('../img/cards/cardBack_red4.png')
    ],
    name:[
      'cards',
      'cardBack_red4'
    ]
  },
  gameResults:{
    path:[
      require("../img/gameResults/blackjack.png"),
      require("../img/gameResults/lose.png"),
      require("../img/gameResults/push.png"),
      require("../img/gameResults/win.png"),
    ],
    name:[
      'blackjack',
      'lose',
      'push',
      'win'
    ]
  },
  button:{
    path:[
      require("../img/icons/moneyBar.png"),
      require("../img/icons/btnPlay.png"),
      require("../img/icons/btnMenu.png"),
      require("../img/icons/btnSound.png"),
      require("../img/icons/easy.png"),
      require("../img/icons/medium.png"),
      require("../img/icons/hard.png"),
      require("../img/icons/deal.png"),
      require("../img/icons/chips_01.png"),
      require("../img/icons/chips_02.png"),
      require("../img/icons/chips_03.png"),
      require("../img/icons/chips_04.png"),
      require("../img/icons/betBar.png"),
      require("../img/icons/btnClear.png"),
      require("../img/icons/stand.png"),
      require("../img/icons/double.png"),
      require("../img/icons/hit.png"),
      require("../img/icons/valueBar.png"),
    ],
    name:[
      'moneyBar',
      'btnPlay',
      'btnMenu',
      'btnSound',
      'easy',
      'medium',
      'hard',
      'deal',
      'chips_01',
      'chips_02',
      'chips_03',
      'chips_04',
      'betBar',
      'btnClear',
      'stand',
      'double',
      'hit',
      'valueBar',
    ]
  },
  background:{
    path:[
      require('../img/background/bgGame.png'),
      require('../img/background/bgMenu.png'),
    ],
    name:[
      'bgGame',
      'bgMenu',
    ]
  },
  audio:{
    path:[
      require('../audio/Click.ogg'),
      require('../audio/chipsHandle.ogg'),
      require('../audio/cardPlace.ogg'),
      require('../audio/cardShove.ogg'),
      require('../audio/youLose.ogg'),
      require('../audio/youWin.ogg'),
      require('../audio/Push.ogg'),
    ],
    name:[
      'Click',
      'chipsHandle',
      'cardPlace',
      'cardShove',
      'youLose',
      'youWin',
      'Push',
    ]
  }
};

let types = [['方块', 'cardDiamonds'], ['梅花', 'cardClubs'], ['红桃', 'cardHearts'], ['黑桃', 'cardSpades']];
let classes = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'];
for(let index in types){
  for(let d in classes){
    let path = require('../img/cards/' + types[index][0] + '/' + types[index][1] + classes[d] + '.png');
    PATH['card'].path.push(path);
    PATH['card'].name.push(types[index][1] + classes[d]);
  }
}


export default PATH;
