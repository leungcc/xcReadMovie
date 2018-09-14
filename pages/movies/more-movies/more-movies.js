// pages/movies/more-movies/more-movies.js

var util = require('../../../utils/util.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],  //所有电影
    title: '',

    inTheatersUrl: '',
    comingSoonUrl: '',
    top250Url: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    console.log('print onLoads options');
    console.log(options);

    self.setData({title: options.title || '更多电影'});

    //赋值几个 url
    self.inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    self.comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    self.top250Url = app.data.globalData.doubanBase + "/v2/movie/top250";

    //self.getMovieListData(self.inTheatersUrl, 'movies');
    util.http.get(self.inTheatersUrl, {start: 0, count: 30}, {
      beforeSend: function() {
        wx.showNavigationBarLoading();
      }
    })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies');
      })
      .always(wx.hideNavigationBarLoading)
      .catch(err => {
        console.log(err)
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取电影数据
   * @param {String} url 电影数据地址
   * @param {String} variable 将拿到的数据缓存到该变量
   */
  // getMovieListData(url, variable) {
  //   var self = this;
  //   wx.request({
  //     url: url,
  //     header: {
  //       "Content-Type": "application/json"
  //     },
  //     data: {
  //       start: 0,
  //       count: 30
  //     },
  //     method: 'GET',
  //     success(res) {
  //       self.processDoubanData(res.data, variable);
  //     },
  //     fail() {

  //     },
  //     complete() {

  //     }
  //   });

  // },

  /**
   * 处理服务器返回的数据
   */
  processDoubanData(moviesDouban, variable) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
      console.warn(`variable=${variable}`)
      
    }

    movies = movies.concat(this.data[variable]);

    this.setData({
      [variable]: movies//.concat(this.data[variable])
    })
  },

  /**
   * 滚动到底部
   */
  scrollLower(arg1, arg2) {
    console.warn('滚动到底');
    var self = this;
    var startPage = 0;
    var url = '';

    startPage = parseInt(this.data.movies.length/30);
    console.warn(`startPage:${startPage}`);

    switch(self.data.title) {
      case '正在热映':
        url = self.inTheatersUrl
        break;
      case '即将上映':
        url = self.comingSoonUrl
        break;
      case 'top250':
        url = self.top250Url
        break;
    }
    //this.getMovieListData(url, 'movies');
    util.http.get(self.inTheatersUrl, { start: 0, count: 30 }, {
      beforeSend: function () {
        wx.showNavigationBarLoading();
      }
    })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies');
      })
      .always(wx.hideNavigationBarLoading)
      .catch(err => {
        console.error(err);
      })
      
  }

})