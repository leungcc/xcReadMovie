var app = getApp();
Page({
  data: {
    movies: []
  },
  onLoad(event) {
    let inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.data.globalData.doubanBase + "/v2/movie/top250 ";
    this.getMovieListData(comingSoonUrl);
  },
  getMovieListData(url) {
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
        self.processDoubanData(res.data);
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
  processDoubanData(moviesDouban) {
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
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
      this.setData({
        movies: movies
      })
    }
  }
})