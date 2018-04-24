'use strict'

const REF = {
  load: 'loaded',
  clss: 'lazy-slider',
  list: 'slide-list',
  item: 'slide-item',
  next: 'slide-next',
  prev: 'slide-prev',
  navi: 'slide-navi',
  curr: 'current',
  actv: 'slide-navi-active',
  cntr: 'slide-center',
  itmc: 'slide-item-center',
  dupi: 'duplicate-item',
  grab: 'grabbing'
}

const UTILS = {
  /**
     * prefixを付与したプロパティを返す
     * @param {Object} elm イベント登録する要素
     * @param {Object} cb コールバック関数
     */
  GetPropertyWithPrefix: (prop) => {
    const bodyStyle = document.body.style
    let resultProp = prop
    let tmpProp = prop.slice(0, 1).toUpperCase() + prop.slice(1)

    if (bodyStyle.webkitTransform !== undefined) resultProp = 'webkit' + tmpProp
    if (bodyStyle.mozTransform !== undefined) resultProp = 'moz' + tmpProp
    if (bodyStyle.msTransform !== undefined) resultProp = 'ms' + tmpProp

    return resultProp
  },
  /**
     * 対象の要素にtransitionendイベントを登録する
     * @param {Object} elm イベント登録する要素
     * @param {Object} cb コールバック関数
     */
  SetTransitionEnd: (elm, cb) => {
    const transitionEndWithPrefix = (/webkit/i).test(navigator.appVersion) ? 'webkitTransitionEnd'
      : 'opera' in window ? 'oTransitionEnd'
        : 'transitionend'

    elm.addEventListener(transitionEndWithPrefix, (e) => {
      if (e.target === elm && e.propertyName.match('transform') !== null) {
        cb()
      }
    })
  },
  /**
     * 指定した要素に複数のイベントと同じ引数付きの関数を登録する
     * @param {Object} obj object型の引数。
     * @param {String} obj.target イベントを登録する要素
     * @param {Array} obj.events 登録するイベント配列
     * @param {Object} obj.func 実行する関数
     * @param {Object} obj.args 関数に渡す引数
     */
  addElWithArgs: function (obj) {
    let target = (typeof obj.target.length === 'undefined') ? [ obj.target ] : [].slice.call(obj.target)

    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < obj.events.length; j++) {
        target[i].addEventListener(obj.events[j], (e) => {
          obj.func.call(this, e, obj.args)
        })
      }
    }
  },
  /**
     * 指定した要素から複数のイベントと同じ引数付きの関数を排除する
     * @param {Object} obj object型の引数。
     * @param {String} obj.target イベントを登録する要素
     * @param {Array} obj.events 登録するイベント配列
     * @param {Object} obj.func 実行する関数
     * @param {Object} obj.args 関数に渡す引数
     */
  removeElWithArgs: function (obj) {
    let target = (typeof obj.target.length === 'undefined') ? [ obj.target ] : [].slice.call(obj.target)

    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < obj.events.length; j++) {
        target[i].removeEventListener(obj.events[j], (e) => {
          obj.func.call(this, e, obj.args)
        })
      }
    }
  }
}

const ELM = class Element {
  /**
     * スライダー毎に必要な値、要素のクラス
     * @param {Object} args object型の引数。
     * @param {Object} args.elm スライダー要素
     * @param {Object} args.list 画像のul要素
     * @param {Object} args.item 画像のli要素
     * @param {Number} args.itemLen 画像の枚数
     * @param {Number} args.itemW 画像の幅
     * @param {Number} args.dupItemLen 複製した要素の数
     * @param {Number} args.dupItemLeftLen 複製した要素のうち、左に配置した数
     * @param {Number} args.showW 表示領域の幅
     * @param {Number} args.autoID 自動スライド用のタイマーID
     * @param {Number} args.current 表示中の画像の位置
     * @param {Object} args.navi ナビゲーションのul要素
     * @param {Object} args.naviChildren ナビゲーションの子要素
     * @param {Object} args.actionCb Actionメソッドのコールバック
     * @param {Boolean} args.dir スライドする方向。true = 右
     */
  constructor (elm, showItem) {
    this.elm = elm
    this.showItem = showItem
    this.list = this.elm.children[0]
    this.listW = 0
    this.listPxW = 0
    this.item = [].slice.call(this.list.children)
    this.itemLen = this.item.length
    this.itemW = 100 / this.itemLen
    this.dupItemLen = 0
    this.dupItemLeftLen = 0
    this.showW = this.itemW * this.showItem
    this.current = 0
    this.actionCb = []
    this.dir = true
    this.adjustCenter = 0
    this.Init()
  }

  Init () {
    this.elm.classList.add(REF.load)
    this.listW = this.list.style.width = 100 / this.showItem * this.itemLen + '%'
    this.listPxW = this.list.offsetWidth
  }
}

const BUTTON = class Button {
  /**
     * prev、nextボタンの生成、イベント登録などを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.hasPrev = this.lazySlider.prev !== ''
    this.hasNext = this.lazySlider.next !== ''
    this.Init()
  }

  Init () {
    this.createButton()

    this.btnLiPrev.addEventListener('click', () => {
      this.ButtonAction(false)
    })
    this.btnLiNext.addEventListener('click', () => {
      this.ButtonAction(true)
    })
  }

  createButton () {
    if (!this.hasPrev) {
      this.btnLiPrev = document.createElement('div')
      this.btnLiPrev.classList.add(REF.prev)
      this.classElm.elm.appendChild(this.btnLiPrev)
    } else {
      this.btnLiPrev = this.classElm.elm.querySelector(this.lazySlider.prev)
    }

    if (!this.hasNext) {
      this.btnLiNext = document.createElement('div')
      this.btnLiNext.classList.add(REF.next)
      this.classElm.elm.appendChild(this.btnLiNext)
    } else {
      this.btnLiNext = this.classElm.elm.querySelector(this.lazySlider.next)
    }
  }

  ButtonAction (dir) {
    if (this.lazySlider.actionLock) return
    this.classElm.dir = dir
    const nextCurrent = (dir) ? ++this.classElm.current : --this.classElm.current
    this.lazySlider.Action(nextCurrent, this.classElm, false)
  }
}

const NAVI = class Navi {
  /**
     * Dotナビゲーションの生成、イベント登録などを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.naviWrap = document.createElement('div')
    this.naviUl = document.createElement('ul')
    this.fragment = document.createDocumentFragment()
    this.tmpNum = Math.ceil(this.classElm.itemLen / this.lazySlider.slideNum)
    this.num = (this.tmpNum > this.lazySlider.showItem + 1 && !this.lazySlider.loop) ? this.tmpNum - (this.lazySlider.showItem - 1) : this.tmpNum
    this.Init()
  }

  Init () {
    this.naviWrap.classList.add(REF.navi)

    for (let i = 0; i < this.num; i++) {
      const naviLi = document.createElement('li')
      const naviLiChild = document.createElement('span')
      naviLi.appendChild(naviLiChild)
      naviLi.classList.add(REF.curr + i)
      this.fragment.appendChild(naviLi)
      naviLi.addEventListener('click', (e) => {
        [].slice.call(e.currentTarget.classList).forEach((value) => {
          if (value.match(REF.curr) !== null) {
            const index = Math.ceil(parseInt(value.replace(REF.curr, '')) * this.lazySlider.slideNum)
            this.classElm.dir = true
            this.lazySlider.Action(index, this.classElm, true)
          };
        })
      })
    }

    this.naviUl.appendChild(this.fragment)
    this.naviWrap.appendChild(this.naviUl)
    this.classElm.elm.appendChild(this.naviWrap)
    this.classElm.navi = this.naviUl
    this.classElm.naviChildren = this.naviUl.querySelectorAll('li')

    this.SetCurrentNavi(this.classElm)

    this.classElm.actionCb.push((cbObj) => {
      this.SetCurrentNavi(cbObj)
    })
  }

  /**
     * current要素にクラスを付与する
     * @param {Object} obj Elementクラス
     */
  SetCurrentNavi (obj) {
    let index = Math.ceil(obj.current / this.lazySlider.slideNum)

    if (index < 0) index = obj.naviChildren.length - 1
    if (index > obj.naviChildren.length - 1) index = 0

    for (let i = 0; i < obj.naviChildren.length; i++) {
      obj.naviChildren[i].classList.remove(REF.actv)
    }

    obj.naviChildren[index].classList.add(REF.actv)
  }
}

const AUTO = class Auto {
  /**
     * LazySliderクラスのActionをsetTimeoutで起動し、自動スライドを行う
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.Init()
  }

  Init () {
    const timer = () => {
      this.classElm.autoID = setTimeout(() => {
        this.classElm.dir = true
        this.lazySlider.Action(++this.classElm.current, this.classElm, false)
      }, this.lazySlider.interval)
    }

    timer()

    UTILS.SetTransitionEnd(this.classElm.list, () => {
      if (this.classElm.dragging) return false
      clearTimeout(this.classElm.autoID)
      timer()
    })
  }
}

const LOOP = class Loop {
  /**
     * ループ処理のための要素作成、イベント登録などを行う
     * @param {Object} this.classElm Elementクラス
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.fragment = document.createDocumentFragment()
    this.dupArr = []
    this.Init()
  }

  Init () {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.classElm.item.length; j++) {
        const dupNode = this.classElm.item[j].cloneNode(true)
        dupNode.classList.add(REF.dupi)
        this.fragment.appendChild(dupNode)
        this.dupArr.push(dupNode)
      }
    }
    this.classElm.dupItemLen = this.dupArr.length
    this.classElm.dupItemLeftLen = this.classElm.item.length
    this.classElm.item = this.dupArr.concat(this.classElm.item)
    this.classElm.list.appendChild(this.fragment)
    this.classElm.list.style.width = 100 / this.lazySlider.showItem * (this.classElm.itemLen + this.classElm.dupItemLen) + '%'
    this.classElm.itemW = 100 / this.classElm.item.length
    this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -(this.classElm.itemW * (this.classElm.dupItemLeftLen - this.classElm.adjustCenter)) + '%,0,0)'

    UTILS.SetTransitionEnd(this.classElm.list, () => {
      this.CallBack()
    })
  }

  CallBack () {
    if (this.classElm.current < 0 || this.classElm.current > this.classElm.itemLen - 1) {
      const endPoint = !((this.classElm.current < 0)) // Right end is true.

      this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's'

      for (let i = 0; i < this.classElm.itemLen; i++) {
        this.classElm.item[i].children[0].style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0 + 's'
      }

      const amount = (this.classElm.dir) ? this.classElm.itemW * (this.classElm.current - this.classElm.adjustCenter) : this.classElm.itemW * (this.classElm.itemLen * 2 - this.lazySlider.slideNum - this.classElm.adjustCenter)

      this.classElm.current = (endPoint) ? 0 : this.classElm.itemLen - this.lazySlider.slideNum
      this.classElm.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + -amount + '%,0,0)'

      if (this.lazySlider.center) this.lazySlider.classCenter.SetCenter(this.classElm)

      setTimeout(() => {
        this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = this.lazySlider.duration + 's'
        for (let i = 0; i < this.classElm.itemLen; i++) {
          this.classElm.item[i].children[0].style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0.1 + 's'
        }
      }, 0)
    }
  }
}

const CENTER = class Center {
  /**
     * 中央に表示されるアイテムにクラスを付与する
     * @param {Object} lazySlider LazySliderクラス
     * @param {Object} classElm Elementクラス
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.classElm.adjustCenter = Math.floor(this.lazySlider.showItem / 2)
    this.Init()
  }

  Init () {
    this.classElm.actionCb.push((cbObj) => {
      this.SetCenter(cbObj)
    })

    this.classElm.elm.classList.add(REF.cntr)
    this.SetCenter(this.classElm)
  }

  /**
     * Center有効時に中央表示された要素にクラスを付与する
     * @param {Object} obj Elementクラス
     */
  SetCenter (obj) {
    const index = (obj.current < 0) ? obj.item.length - 1 : obj.current

    for (let i = 0; i < obj.item.length; i++) {
      obj.item[i].classList.remove(REF.itmc)
    }

    obj.item[index].classList.add(REF.itmc)
  }
}

const SWIPE = class Swipe {
  /**
     * スワイプ機能を追加する
     * @param {Object} args object型の引数。
     */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.showItem = this.lazySlider.showItem
    this.elm = this.classElm.elm
    this.list = this.classElm.list
    this.classElm.dragging = false
    this.touchObject = {}
    this.hasLink = false
    this.disabledClick = true
    this.swiping = false
    this.init()
  }

  init () {
    this.linkElm = this.classElm.list.querySelectorAll('a')
    this.hasLink = this.linkElm.length > 0
    if (this.hasLink) {
      UTILS.addElWithArgs.call(this, {
        target: this.linkElm,
        events: [ 'click' ],
        func: this.clickHandler,
        args: {
          action: 'clicked'
        }
      })
      UTILS.addElWithArgs.call(this, {
        target: this.linkElm,
        events: [ 'dragstart' ],
        func: this.pvtDefault,
        args: {
          action: 'dragstart'
        }
      })
    }

    UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: [ 'touchstart', 'mousedown' ],
      func: this.Handler,
      args: {
        action: 'start'
      }
    })

    UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: [ 'touchmove', 'mousemove' ],
      func: this.Handler,
      args: {
        action: 'move'
      }
    })

    UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: [ 'touchend', 'touchcancel', 'mouseup', 'mouseleave' ],
      func: this.Handler,
      args: {
        action: 'end'
      }
    })
  }

  Handler (event, obj) {
    this.touchObject.fingerCount = event.touches !== undefined ? event.touches.length : 1

    switch (obj.action) {
      case 'start':
        this.Start(event)
        break

      case 'move':
        this.Move(event)
        break

      case 'end':
        this.End(event)
        break
    }
  }

  Start (event) {
    this.disabledClick = true
    this.swiping = false
    window.addEventListener('touchmove', this.pvtDefault)
    this.classElm.list.classList.add(REF.grab)

    if (this.lazySlider.actionLock || this.touchObject.fingerCount !== 1) {
      this.touchObject = {}
      return false
    }

    clearTimeout(this.classElm.autoID)
    let touches

    if (event.touches !== undefined) touches = event.touches[0]

    this.touchObject.startX = this.touchObject.curX = (touches !== undefined) ? touches.pageX : event.clientX
    this.touchObject.startY = this.touchObject.curY = (touches !== undefined) ? touches.pageY : event.clientY
    this.classElm.dragging = true
  }

  End () {
    window.removeEventListener('touchmove', this.pvtDefault)
    this.classElm.list.classList.remove(REF.grab)
    this.classElm.list.style.transitionDuration = this.lazySlider.duration + 's'

    if (!this.classElm.dragging || this.touchObject.curX === undefined) return false
    if (this.touchObject.startX !== this.touchObject.curX) {
      this.touchObject.current = (this.classElm.dir) ? ++this.classElm.current : --this.classElm.current
      this.lazySlider.Action(this.touchObject.current, this.classElm, false)
    }

    this.touchObject = {}
    this.disabledClick = !!(this.swiping)
    this.classElm.dragging = false
  }

  Move (event) {
    if (!this.classElm.dragging) return
    this.lazySlider.actionLock = this.swiping = true

    this.classElm.list.style[UTILS.GetPropertyWithPrefix('transitionDuration')] = 0.2 + 's'

    let touches = event.touches
    this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX
    const currentPos = (this.classElm.current + this.classElm.dupItemLeftLen - this.classElm.adjustCenter) * this.classElm.itemW
    const pxAmount = this.touchObject.curX - this.touchObject.startX
    const perAmount = pxAmount / this.classElm.listPxW * 35 - currentPos
    this.classElm.dir = (pxAmount < 0)

    this.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)'
  }

  pvtDefault (event) {
    event.preventDefault()
  }

  clickHandler (event) {
    if (this.swiping) {
      event.stopImmediatePropagation()
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

class LazySlider {
  /**
     * コンストラクタ
     * @param {Object} args object型の引数。
     * @param {String} args.class HTML記述したスライダーのクラス名を指定。default = 'lazy-slider';
     * @param {Number} args.showItem 1度に表示する画像の枚数を設定。default = 1;
     * @param {Boolean} args.auto 自動スライドの設定。default = true;
     * @param {Number} args.interval 自動スライドの間隔をミリ秒で指定。default = 3000;
     */
  constructor (args) {
    this.args = (typeof args !== 'undefined') ? args : {}
    this.class = (typeof this.args.class !== 'undefined') ? this.args.class : REF.clss
    this.interval = (typeof this.args.interval !== 'undefined') ? this.args.interval : 3000
    this.duration = (typeof this.args.duration !== 'undefined') ? this.args.duration : 0.5
    this.showItem = (typeof this.args.showItem !== 'undefined') ? this.args.showItem : 1
    this.slideNum = (typeof this.args.slideNum !== 'undefined') ? this.args.slideNum : this.showItem
    this.prev = (typeof this.args.prev !== 'undefined') ? this.args.prev : ''
    this.next = (typeof this.args.next !== 'undefined') ? this.args.next : ''
    this.auto = this.args.auto !== false
    this.center = (this.args.center === true)
    this.loop = (this.args.loop === true)
    this.btn = this.args.btn !== false
    this.navi = this.args.navi !== false
    this.swipe = this.args.swipe !== false
    this.actionLock = false
    this.elmArr = []

    window.addEventListener('load', () => {
      this.nodeList = document.querySelectorAll('.' + this.class)
      this.Init()
    })
  }

  Init () {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.elmArr.push(new ELM(this.nodeList[i], this.showItem))

      const obj = this.elmArr[i]

      obj.list.classList.add(REF.list);
      [].map.call(obj.item, (el) => {
        el.classList.add(REF.item)
      })

      UTILS.SetTransitionEnd(obj.list, () => {
        this.actionLock = false
      })

      if (this.center) {
        this.classCenter = new CENTER(this, obj)
      };
      if (this.loop) {
        void new LOOP(this, obj)
      }
      if (this.btn) {
        void new BUTTON(this, obj)
      }
      if (this.navi) {
        void new NAVI(this, obj)
      }
      if (this.swipe) {
        void new SWIPE(this, obj)
      }
      if (this.auto) {
        void new AUTO(this, obj)
      }
    }
  }

  /**
     * 引数で指定したindex番号のitemへ移動する
     * @param {Number} index
     * @param {Object} obj Elementクラス
     */
  Action (index, obj, isNaviEvent) {
    clearTimeout(obj.autoID)
    this.actionLock = true

    if (typeof isNaviEvent === 'undefined' || !isNaviEvent) {
      for (let i = 1; i < this.slideNum; i++) {
        index = (obj.dir) ? ++index : --index
      }
    }

    /**
         * 2アイテム表示に対して残りのアイテムが1つしかない場合などに、
         * 空白が表示されないように移動量を調整。
         */
    const isLast = (item) => {
      return item > 0 && item < this.slideNum
    }
    const prevIndex = (obj.dir) ? index - this.slideNum : index + this.slideNum
    const remainingItem = (obj.dir) ? obj.itemLen - index : prevIndex
    if (isLast(remainingItem)) index = (obj.dir) ? prevIndex + remainingItem : prevIndex - remainingItem

    if (!this.loop) {
      if (index > obj.itemLen - this.showItem) index = 0
      if (index < 0) index = obj.itemLen - this.showItem
    }

    const amount = -(obj.itemW * (index - obj.adjustCenter) + obj.itemW * obj.dupItemLeftLen)

    obj.list.style[UTILS.GetPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)'
    obj.current = index

    // Actionのcallbackを実行
    for (let i = 0; i < obj.actionCb.length; i++) {
      obj.actionCb[i](obj)
    }
  }
};

module.exports = LazySlider
if (typeof window !== 'undefined') {
  !window.LazySlider && (window.LazySlider = LazySlider)
}
