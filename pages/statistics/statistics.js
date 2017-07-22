var util = require('../../utils/util.js')
Page({
  data: {
    records: [],
    modalHidden: true,
    toastHidden: true
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '统计'
    })
    this.getTomatos()
  },
  set: function () {

  },
  getTomatos: function () {
    try {
      var tomatos = wx.getStorageSync('tomatos')
      if (tomatos) {
        // type:defaultLogName[log.type],
        // total:1
        var records = [];
        //       work: '工作',
        // rest: '休息',
        // study:"学习",
        // sport:"运动",
        // summary:"总结"
        var workTotal = 0;
        var studyTotal = 0;
        var sportTotal = 0;
        var summaryTotal = 0;

        tomatos.forEach(function (item, index, arry) {
          //item.startTime = new Date(item.startTime).toLocaleString()
          switch (item.type) {
            case "工作":
              workTotal++;
              break;
            case "学习":
              studyTotal++;
              break;
            case "运动":
              sportTotal++;
              break;
            case "总结":
              summaryTotal++;
              break;
          }
        });

        records=[
          {type:"工作",total:workTotal},
          {type:"学习",total:studyTotal},
          {type:"运动",total:sportTotal},
          {type:"总结",total:summaryTotal},
        ];

      } else {
        records = [];
      }
      this.setData({
        records: records
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
    wx.setStorageSync('tomatos', [])
    this.switchModal()
    this.setData({
      toastHidden: false
    })
    this.getTomatos()
  }
})
