'use strict'

const REF = {
  load: 'loaded',
  clss: 'lazy-slider',
  wrap: 'slide-list-wrap',
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
  getPropertyWithPrefix: (prop) => {
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
  setTransitionEnd: (elm, cb) => {
    const transitionEndWithPrefix = (/webkit/i).test(navigator.appVersion) ? 'webkitTransitionEnd' : 'opera' in window ? 'oTransitionEnd' : 'transitionend'

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
    let target = (typeof obj.target.length === 'undefined') ? [obj.target] : [].slice.call(obj.target)

    obj.listener = (e) => {
      obj.func.call(this, e, obj.args)
    }

    for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < obj.events.length; j++) {
        target[i].addEventListener(obj.events[j], obj.listener)
      }
    }

    return obj
  }
}

class Element {
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
   * @param {Number} args.current 表示中の画像の位置
   * @param {Object} args.navi ナビゲーションのul要素
   * @param {Object} args.naviChildren ナビゲーションの子要素
   * @param {Object} args.actionCb Actionメソッドのコールバック
   * @param {Boolean} args.dir スライドする方向。true = 右
   */
  constructor (elm, showItem, duration, unitNum) {
    this.elm = elm
    this.showItem = showItem
    this.listWrap = document.createElement('div')
    this.list = this.elm.children[0]
    this.listW = 0
    this.listPxW = 0
    this.duration = duration
    this.item = [].slice.call(this.list.children)
    this.itemLen = this.item.length / unitNum
    this.itemW = 100 / this.itemLen
    this.dupItemLen = 0
    this.dupItemLeftLen = 0
    this.showW = this.itemW * this.showItem
    this.current = 0
    this.actionCb = []
    this.dir = true
    this.adjustCenter = 0
  }

  element () {
    this.elm.classList.add(REF.load)
    this.listW = this.list.style.width = 100 / this.showItem * this.itemLen + '%'
    this.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = this.duration + 's'
    this.listPxW = this.list.offsetWidth

    this.elm.appendChild(this.listWrap)
    this.listWrap.classList.add(REF.wrap)
    this.listWrap.appendChild(this.list)

    this.item = this.sortArr()
  }

  sortArr () {
    const tmpDupItemArr = this.item.slice(0, this.itemLen)
    const tmpOrgItemArr = this.item.slice(this.itemLen, this.item.length)
    return tmpOrgItemArr.concat(tmpDupItemArr)
  }
}

class Button {
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
    this.buttonEventsArr = []
  }

  button () {
    this.btnLiPrev = this.createButton(false)
    this.btnLiNext = this.createButton(true)

    this.buttonEventsArr.push(UTILS.addElWithArgs.call(this, {
      target: this.btnLiPrev,
      events: ['click'],
      func: this.buttonAction,
      args: false
    }))
    this.buttonEventsArr.push(UTILS.addElWithArgs.call(this, {
      target: this.btnLiNext,
      events: ['click'],
      func: this.buttonAction,
      args: true
    }))
  }

  createButton (isNext) {
    let hasDomElm = this.hasPrev
    let target = this.btnLiPrev
    let clsName = REF.prev
    let domElm = this.lazySlider.prev

    if (isNext) {
      hasDomElm = this.hasNext
      target = this.btnLiNext
      clsName = REF.next
      domElm = this.lazySlider.next
    }

    if (!hasDomElm) {
      target = document.createElement('div')
      target.classList.add(clsName)
      this.classElm.elm.appendChild(target)
    } else {
      target = this.classElm.elm.querySelector(domElm)
    }

    return target
  }

  buttonAction (e, dir) {
    if (this.lazySlider.actionLock) return
    this.classElm.dir = dir
    const nextCurrent = (dir) ? ++this.classElm.current : --this.classElm.current
    this.lazySlider.action(nextCurrent, this.classElm, false)
  }
}

class Navi {
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
    this.naviEventsArr = []
  }

  navi () {
    this.naviWrap.classList.add(REF.navi)

    for (let i = 0; i < this.num; i++) {
      const naviLi = document.createElement('li')
      const naviLiChild = document.createElement('span')
      naviLi.appendChild(naviLiChild)
      naviLi.classList.add(REF.curr + i)
      this.fragment.appendChild(naviLi)

      this.naviEventsArr.push(UTILS.addElWithArgs.call(this, {
        target: naviLi,
        events: ['click'],
        func: (e) => {
          [].slice.call(e.currentTarget.classList).forEach((value) => {
            if (value.match(REF.curr) !== null) {
              const index = Math.ceil(parseInt(value.replace(REF.curr, '')) * this.lazySlider.slideNum)
              this.classElm.dir = true
              this.lazySlider.action(index, this.classElm, true)
            };
          })
        }
      }))
    }

    this.naviUl.appendChild(this.fragment)
    this.naviWrap.appendChild(this.naviUl)
    this.classElm.elm.appendChild(this.naviWrap)
    this.classElm.navi = this.naviUl
    this.classElm.naviChildren = this.naviUl.querySelectorAll('li')

    this.setCurrentNavi(this.classElm)

    this.classElm.actionCb.push((cbObj) => {
      this.setCurrentNavi(cbObj)
    })
  }

  /**
   * current要素にクラスを付与する
   * @param {Object} obj Elementクラス
   */
  setCurrentNavi (obj) {
    let index = Math.ceil(obj.current / this.lazySlider.slideNum)

    if (index < 0) index = obj.naviChildren.length - 1
    if (index > obj.naviChildren.length - 1) index = 0

    for (let i = 0; i < obj.naviChildren.length; i++) {
      obj.naviChildren[i].classList.remove(REF.actv)
    }

    obj.naviChildren[index].classList.add(REF.actv)
  }
}

class Auto {
  /**
   * LazySliderクラスのActionをsetTimeoutで起動し、自動スライドを行う
   * @param {Object} lazySlider LazySliderクラス
   * @param {Object} classElm Elementクラス
   */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.autoID = 0
    this.isPause = false
  }

  auto () {
    UTILS.setTransitionEnd(this.classElm.list, () => {
      if (this.classElm.dragging || this.isPause) return false
      this.clear()
      this.timer()
    })

    this.timer()
  }

  timer () {
    this.autoID = setTimeout(() => {
      if (this.lazySlider.actionLock) return
      this.classElm.dir = true
      this.lazySlider.action(++this.classElm.current, this.classElm, false)
    }, this.lazySlider.interval)
  }

  clear () {
    if (typeof this.autoID === 'undefined') return false
    clearTimeout(this.autoID)
  }

  stop () {
    this.isPause = true
    this.clear()
  }

  play () {
    this.isPause = false
    this.clear()
    this.timer()
  }
}

class Loop {
  /**
   * ループ処理のための要素作成、イベント登録などを行う
   * @param {Object} this.lazySlider LazySliderクラス
   * @param {Object} this.classElm Elementクラス
   */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.cbTimerID = null
    this.itemUnitNum = this.lazySlider.itemUnitNum
    this.dupArr = []
  }

  loop () {
    if (this.itemUnitNum === 1) {
      this.cloneItems()
    } else {
      this.setDupItemsManually()
    }
    this.init()
  }

  cloneItems () {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.classElm.item.length; j++) {
        const dupNode = this.classElm.item[j].cloneNode(true)
        dupNode.classList.add(REF.dupi + (i + 1))
        fragment.appendChild(dupNode)
        this.dupArr.push(dupNode)
      }
    }
    this.classElm.list.appendChild(fragment)
  }

  setDupItemsManually () {
    for (let i = 1; i < this.itemUnitNum; i++) {
      for (let j = 0; j < this.classElm.itemLen; j++) {
        const itemIndex = i * this.classElm.itemLen + j
        this.classElm.item[itemIndex].classList.add(REF.dupi + (i))
        this.dupArr.push(this.classElm.item[itemIndex])
      }
    }
  }

  // Loopクラスの初期化時に実行
  init () {
    this.classElm.dupItemLen = this.dupArr.length
    this.classElm.dupItemLeftLen = this.classElm.itemLen
    this.classElm.item = (this.itemUnitNum === 1) ? this.dupArr.concat(this.classElm.item) : this.classElm.item
    this.classElm.itemW = 100 / this.classElm.item.length
    this.classElm.list.style.width = 100 / this.lazySlider.showItem * (this.classElm.itemLen + this.classElm.dupItemLen) + '%'
    this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0 + 's'
    this.classElm.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + -(this.classElm.itemW * (this.classElm.dupItemLeftLen - this.classElm.adjustCenter)) + '%,0,0)'
    setTimeout(() => {
      this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = this.classElm.duration + 's'
    }, 0)
    UTILS.setTransitionEnd(this.classElm.list, () => {
      this.resetPos()
    })
  }

  // スライダーが末尾、もしくは先頭に達した際に初期位置へ戻すために実行
  resetPos () {
    const isInRange = this.classElm.current >= 0 && this.classElm.current < this.classElm.itemLen
    if (isInRange) return

    const amount = (this.classElm.dir) ? this.classElm.itemW * (this.classElm.current - this.classElm.adjustCenter) : this.classElm.itemW * (this.classElm.itemLen * 2 - this.lazySlider.slideNum - this.classElm.adjustCenter)

    this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0 + 's'
    this.classElm.current = (this.classElm.current >= 0) ? 0 : this.classElm.itemLen - this.lazySlider.slideNum
    this.classElm.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + -amount + '%,0,0)'

    clearTimeout(this.cbTimerID)
    this.cbTimerID = setTimeout(() => {
      this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = this.lazySlider.duration + 's'
      this.lazySlider.actionLock = false
    }, 1)
  }
}

class Center {
  /**
   * 中央に表示されるアイテムにクラスを付与する
   * @param {Object} lazySlider LazySliderクラス
   * @param {Object} classElm Elementクラス
   */
  constructor (lazySlider, classElm) {
    this.lazySlider = lazySlider
    this.classElm = classElm
    this.classElm.adjustCenter = Math.floor(this.lazySlider.showItem / 2)
  }

  center () {
    this.classElm.actionCb.push((cbObj) => {
      this.setCenter(cbObj)
    })

    this.classElm.elm.classList.add(REF.cntr)
    this.setCenter(this.classElm)
  }

  /**
   * Center有効時に中央表示された要素にクラスを付与する
   * @param {Object} obj Elementクラス
   */
  setCenter (obj) {
    const index = (obj.current < 0) ? obj.item.length - 1 : obj.current
    for (let i = 0; i < obj.item.length; i++) {
      obj.item[i].classList.remove(REF.itmc)
    }

    /*
     * center要素にtransition等を設定していると、端までスライドした後の
     * ポジションリセット時にアニメーションが2回見えてしまうので、
     * 予めポジションリセット後の要素にもcenterクラスを付与しておく。
     */
    if (this.lazySlider.loop) {
      let tmpIndex
      if ((index + obj.itemLen) > obj.item.length) {
        tmpIndex = obj.itemLen - 1
      } else if (index === obj.itemLen) {
        tmpIndex = 0
      }
      if (typeof obj.item[tmpIndex] !== 'undefined') {
        obj.item[tmpIndex].classList.add(REF.itmc)
      }
    }
    obj.item[index].classList.add(REF.itmc)
  }
}

class Swipe {
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
    this.swipeEventsArr = []
  }

  swipe () {
    this.linkElm = this.classElm.list.querySelectorAll('a')
    this.hasLink = this.linkElm.length > 0
    this.handleEvents(false)
  }

  handleEvents (isDestroy) {
    if (this.hasLink) {
      this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
        target: this.linkElm,
        events: ['click'],
        func: this.clickHandler,
        args: {
          action: 'clicked'
        }
      }))
      this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
        target: this.linkElm,
        events: ['dragstart'],
        func: this.pvtDefault,
        args: {
          action: 'dragstart'
        }
      }))
    }

    this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: ['touchstart', 'mousedown'],
      func: this.handler,
      args: {
        action: 'start'
      }
    }))

    this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: ['touchmove', 'mousemove'],
      func: this.handler,
      args: {
        action: 'move'
      }
    }))

    this.swipeEventsArr.push(UTILS.addElWithArgs.call(this, {
      target: this.classElm.list,
      events: ['touchend', 'touchcancel', 'mouseup', 'mouseleave'],
      func: this.handler,
      args: {
        action: 'end'
      }
    }))
  }

  handler (event, obj) {
    this.touchObject.fingerCount = event.touches !== undefined ? event.touches.length : 1

    switch (obj.action) {
      case 'start':
        this.start(event)
        break

      case 'move':
        this.move(event)
        break

      case 'end':
        this.end(event)
        break
    }
  }

  start (event) {
    this.disabledClick = true
    this.swiping = false
    this.classElm.list.classList.add(REF.grab)

    if (this.lazySlider.actionLock || this.touchObject.fingerCount !== 1) {
      this.touchObject = {}
      return false
    }

    if (typeof this.lazySlider.Auto !== 'undefined') {
      this.lazySlider.Auto.clear()
    }
    let touches

    if (event.touches !== undefined) touches = event.touches[0]

    this.touchObject.startX = this.touchObject.curX = (touches !== undefined) ? touches.pageX : event.clientX
    this.touchObject.startY = this.touchObject.curY = (touches !== undefined) ? touches.pageY : event.clientY
    this.classElm.dragging = true
  }

  end () {
    this.classElm.list.classList.remove(REF.grab)
    this.classElm.list.style.transitionDuration = this.lazySlider.duration + 's'

    if (!this.classElm.dragging || this.touchObject.curX === undefined) return false
    if (this.touchObject.startX !== this.touchObject.curX) {
      this.touchObject.current = (this.classElm.dir) ? ++this.classElm.current : --this.classElm.current
      this.lazySlider.action(this.touchObject.current, this.classElm, false)
    }

    this.touchObject = {}
    this.disabledClick = !!(this.swiping)
    this.classElm.dragging = false
  }

  move (event) {
    if (!this.classElm.dragging) return
    this.lazySlider.actionLock = this.swiping = true

    this.classElm.list.style[UTILS.getPropertyWithPrefix('transitionDuration')] = 0.2 + 's'

    let touches = event.touches
    this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX
    const currentPos = (this.classElm.current + this.classElm.dupItemLeftLen - this.classElm.adjustCenter) * this.classElm.itemW
    const pxAmount = this.touchObject.curX - this.touchObject.startX
    const perAmount = pxAmount / this.classElm.listPxW * 35 - currentPos
    this.classElm.dir = (pxAmount < 0)

    this.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + perAmount + '%,0,0)'

    this.pvtDefault(event)
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
    this.node = (typeof this.args.elm !== 'undefined') ? this.args.elm : document.querySelectorAll('.' + REF.clss)
    this.nodeArr = (this.node.length > 0) ? [].slice.call(this.node) : [this.node]
    this.interval = (typeof this.args.interval !== 'undefined') ? this.args.interval : 3000
    this.duration = (typeof this.args.duration !== 'undefined') ? this.args.duration : 0.5
    this.showItem = (typeof this.args.showItem !== 'undefined') ? this.args.showItem : 1
    this.slideNum = (typeof this.args.slideNum !== 'undefined') ? this.args.slideNum : this.showItem
    this.prev = (typeof this.args.prev !== 'undefined') ? this.args.prev : ''
    this.next = (typeof this.args.next !== 'undefined') ? this.args.next : ''
    this.itemUnitNum = (typeof this.args.itemUnitNum !== 'undefined') ? this.args.itemUnitNum : 1
    this.auto = this.args.auto !== false
    this.center = this.args.center === true
    this.loop = this.args.loop === true
    this.btn = this.args.btn !== false
    this.navi = this.args.navi !== false
    this.swipe = this.args.swipe !== false
    this.actionLock = false
    this.elmArr = []
    this.registedEventArr = []
  }

  slide () {
    for (let i = 0; i < this.nodeArr.length; i++) {
      this.elmArr.push(new Element(this.nodeArr[i], this.showItem, this.duration, this.itemUnitNum))

      const obj = this.elmArr[i]

      obj.element()
      obj.list.classList.add(REF.list);
      [].map.call(obj.item, (el) => {
        el.classList.add(REF.item)
      })

      if (this.center) {
        this.Center = this.classCenter = new Center(this, obj)
        this.Center.center()
      };

      if (obj.item.length <= this.showItem) continue

      if (this.loop) {
        this.Loop = new Loop(this, obj).loop()
      }
      if (this.btn) {
        this.Button = new Button(this, obj).button()
      }
      if (this.navi) {
        this.Navi = new Navi(this, obj).navi()
      }
      if (this.swipe) {
        this.Swipe = new Swipe(this, obj).swipe()
      }
      if (this.auto) {
        this.Auto = new Auto(this, obj)
        this.Auto.auto()
      }

      UTILS.setTransitionEnd(obj.list, () => {
        this.actionLock = false
      })
    }
  }

  /**
   * 引数で指定したindex番号のitemへ移動する
   * @param {Number} index
   * @param {Object} obj Elementクラス
   */
  action (index, obj, isNaviEvent) {
    if (typeof this.Auto !== 'undefined') {
      this.Auto.clear()
    }
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

    obj.list.style[UTILS.getPropertyWithPrefix('transform')] = 'translate3d(' + amount + '%,0,0)'
    obj.current = index

    // Actionのcallbackを実行
    for (let i = 0; i < obj.actionCb.length; i++) {
      obj.actionCb[i](obj)
    }
  }
}

module.exports = LazySlider
if (typeof window !== 'undefined') {
  !window.LazySlider && (window.LazySlider = LazySlider)
}
