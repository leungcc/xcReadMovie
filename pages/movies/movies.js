var app = getApp();
Page({
  data: {
    //movies: []
  },
  onLoad(event) {
    let inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.data.globalData.doubanOffical + "/v2/movie/top250 ";
    
    this.getMovieListData(inTheatersUrl, "inTheaters");
    this.getMovieListData(comingSoonUrl, "comingSoon");
    //this.getMovieListData(top250Url, "top250");
    console.log("onload")
  },
  getMovieListData(url, dataKey) {
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
        self.processDoubanData(res.data, dataKey);
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
  processDoubanData(moviesDouban, dataKey) {
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

      var curData = {};
      curData[dataKey] = movies;

      this.setData(curData);
    }
  }
})