const util = require('../../utils/util.js')
const defaultLogName = {
  work: '工作',
  rest: '休息',
  study:"学习",
  sport:"运动",
  summary:"总结"
}
const actionName = {
  stop: '停止',
  start: '开始',
  end:"结束",
  cancel:"放弃"
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRuning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right
  },


  onShow: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })

    if (this.data.isRuning) return
    let workTime = util.formatTime(wx.getStorageSync('workTime'), 'HH')
    let restTime = util.formatTime(wx.getStorageSync('restTime'), 'HH')
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    });
  },

  startTimer: function (e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data['workTime']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

    if (!isRuning) {
      this.timer = setInterval((function () {
        this.updateTimer()
        this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }
    
    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })

    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRuning ? 'stop' : 'start'],
      type: timerType
    }

    this.saveLog(this.data.log)
  },

  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },
  pauseTimer: function (e) {

  },
  cancelTimer: function (e) {
    console.log(e);
    this.stopTimer();

    let workTime = util.formatTime(wx.getStorageSync('workTime'), 'HH')
    this.setData({
      remainTimeText: workTime + ':00'
    });
    var log=this.data.log;
    this.data.log = {
        name: log.name,
        startTime:log.startTime,
        endTime: log.keepTime +log.startTime,
        action: actionName['cancel'],
        type: defaultLogName[log.type]
      }

      this.saveLog(this.data.log)
  },
  stopTimer: function (e) {
    // reset circle progress

    debugger;
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right,
      isRuning: false
    });

    // clear timer
    this.timer && clearInterval(this.timer)
  },

  updateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      //任务完成

      this.setData({
        completed: true
      })
      
      this.data.log = {
        name: log.name,
        startTime:log.startTime,
        endTime: log.keepTime +log.startTime,
        action: actionName['end'],
        type: defaultLogName[log.type]
      }

      this.saveLog(this.data.log)

      var tomato={
        type:defaultLogName[log.type],
        total:1
      };
      this.saveTomato(tomato);

      this.stopTimer()
      return
    }

    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },

  changeLogName: function (e) {
    this.logName = e.detail.value
  },

  saveLog: function (log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  },
  saveTomato:function(tomato){
    var tomatos=wx.getStorageSync('tomatos')||[];
    tomatos.unshift(tomato);
    wx.setStorageSync("tomatos",tomatos);
  }
})
