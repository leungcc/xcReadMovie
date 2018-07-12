var app = getApp();
var util = require("../../utils/util.js");

Page({
  data: {
    inTheaters: [],
    comingSoon: [],
    movieTypeMap: {
      inTheaters: '正在热映',
      comingSoon: '即将上映'
    }
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
  /************事件************ */
  /**
   * 点击“更多事件”
   */
  onMoreTap(e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movies/more-movies?category='+category,
    })
  },
  /************事件************ */
  /**
   * 从服务器拉取数据
   */
  getMovieListData(url, dataKey) {
    var self = this;
    var params = {
      start: 0,
      count: 3
    }
    //请求
    util.http(url, params, function(res){
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
      temp.title = this.data.movieTypeMap[dataKey];

      movies.push(temp);

      
    }

    var curData = {};
    curData[dataKey] = movies;
    console.log(curData);
    this.setData(curData);
  }
})