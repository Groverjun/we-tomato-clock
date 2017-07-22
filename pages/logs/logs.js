var util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    modalHidden: true,
    toastHidden: true
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '任务统计'
    })
    this.getLogs()
  },
  set: function () {

  },
  getLogs: function () {
    try {
      var logs = wx.getStorageSync('logs')
      if (logs) {
        logs.forEach(function (item, index, arry) {
          item.startTime = new Date(item.startTime).toLocaleString()
        })

      } else {
        logs = [];
      }
      this.setData({
        logs: logs
      })

    } catch (e) {
      console.log(e);
    }



  },
  onLoad: function () { },
  switchModal: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },
  hideToast: function () {
    this.setData({
      toastHidden: true
    })
  },
  clearLog: function (e) {
    wx.setStorageSync('logs', [])
    this.switchModal()
    this.setData({
      toastHidden: false
    })
    this.getLogs()
  }
})
