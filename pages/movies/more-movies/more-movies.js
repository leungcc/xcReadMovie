// pages/movies/more-movies/more-movies.js
/**
 * 注意：onPullDownRefresh 和 scroll-view 不能共存
 */

var util = require('../../../utils/util.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],  //所有电影
    movies__flex: [],
    title: '',

    inTheatersUrl: '',
    comingSoonUrl: '',
    top250Url: '',  
    
    //======== 中文Title-请求Url 映射
    titleUrlMap: {
      '正在热映': 'inTheatersUrl',
      'top250': 'top250Url',
      '即将上映': 'comingSoonUrl'
    }

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
    self.data.inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    self.data.comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    self.data.top250Url = app.data.globalData.doubanBase + "/v2/movie/top250";

    console.log(self.data.titleUrlMap);
    //self.getMovieListData(self.inTheatersUrl, 'movies');
    util.http.get(self.data[self.data.titleUrlMap[self.data.title]], {start: 0, count: 30}, {
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
    });
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
    console.log('======== onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('-------- onReachBottom');
    this.scrollLower();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

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
        stars: util.convertToStarsArr(subject.rating.average),
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
      console.warn(`variable=${variable}`)
      
    }

    movies = [].concat(this.data[variable], movies);

    this.setData({
      [variable]: movies,//.concat(this.data[variable])
      [variable+'__flex']: new Array((3-movies.length%3)%3).fill({})
    })
  },

  /**
   * 滚动到底部
   */
  scrollLower(arg1, arg2) {
    console.warn('滚动到底');
    const self = this;
    let url = self.data[self.data.titleUrlMap[self.data.title]];

    //请求
    util.http.get(url, { start: self.data.movies.length, count: 30 }, {
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