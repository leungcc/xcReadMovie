var app = getApp();
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '', // 标题
    category: '',      // top250/comingSoon/inTheaters
    movies: []         // 电影数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //保存从父页面传过来的值
    this.setData({
      category: options.category
    });
    

    this.initRender();
  },

  /**
   * 初始化渲染
   */
  initRender() {
    //设置页面顶部title
    wx.setNavigationBarTitle({
      title: this.data.category,
    })

    let inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.data.globalData.doubanOffical + "/v2/movie/top250 ";

    this.getMovieListData(inTheatersUrl, "inTheaters");
    this.getMovieListData(comingSoonUrl, "comingSoon");

  },

  /**
   * 从服务器拉取数据
   */
  getMovieListData(url, dataKey) {
    var self = this;
    var params = {
      start: 0,
      count: 20
    }
    //请求
    util.http(url, params, function (res) {
      self.processDoubanData(res.data, dataKey);
    }, "GET");
  },

  /**
   * 处理服务器返回的数据
   */
  processDoubanData(moviesDouban, dataKey) {
    var movies = [];
    console.log(moviesDouban)
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
    }

    this.setData({
      movies
    });
  }

})