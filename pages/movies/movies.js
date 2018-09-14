var app = getApp();
var util = require("../../utils/util.js");

Page({
  data: {
    movies: [],
    data2: [],
    data3: []
  },
  onLoad(event) {
    let inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.data.globalData.doubanBase + "/v2/movie/top250 ";
    this.getMovieListData(comingSoonUrl, 'movies');
    this.getMovieListData(inTheatersUrl, 'data2');
  },
  getMovieListData(url, variable) {
    var self = this;
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        start: 0,
        count: 3
      },
      method: 'GET',
      success(res) {
        self.processDoubanData(res.data, variable);
      },
      fail() {

      },
      complete() {

      }
    });
  },
  /**
   * 处理服务器返回的数据
   */
  processDoubanData(moviesDouban, variable) {
    var movies = [];
    console.log(moviesDouban)
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        stars: util.convertToStarsArr(subject.rating.average),
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      
      //为不同类型加上title
      //temp.title = this.data.movieTypeMap[dataKey];

      movies.push(temp);
      console.warn(`variable=${variable}`)
      this.setData({
        [variable]: movies
      })
    }
  },

  /**
   * 加载更多
   */
  loadMoreMovies(e) {
    console.log('print e');
    console.log(e);
    wx.navigateTo({
      url: 'more-movies/more-movies?title='+e.target.dataset.title
    })
  },

  /**
   * 滚动到底部
   */
  scrollLower(a, b) {
    console.warn(`scrollLower...and print a、b`);
    console.log(a);
    console.log(b);
  },

  /**
   * 滚动到顶部
   */
  scrollUpper(arg1) {
    console.warn(`scrollUpper ...`);
  }
})