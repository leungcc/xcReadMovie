var app = getApp();
import haha from '../../utils/haha.js';
import util from '../../utils/util.js';
import testImportDefault from '../../utils/testExportDefault.js';

Page({
  data: {
    movies__inTheaters: [], //正在热映
    movies__inTheaters__flex: [],
    movies__top250: [],     //top250
    movies__top250__flex: [],
    movies__comingSoon: [], //即将上映
    movies__comingSoon__flex: [],

    movies__search: [],    //关键字搜索结果的电影
    movies__search__flex: [], //用来填补

    isSearchMode: false,   //当前是否是电影搜索模式
    searchInputVal: ''
  },
  watch: {
    //监听 isSearchMode 来清除 searchInputVal 和 movies__search
    isSearchMode(newVal) {
      const self = this;
      if(!newVal) {
        self.setData({ searchInputVal: '', movies__search: [] });
      }
    }
  },
  onLoad(event) {
    const self = this;

    //设置 watch监听
    util.setWatcher(self.data, self.watch, self);

    
    let inTheatersUrl = app.data.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.data.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.data.globalData.doubanBase + "/v2/movie/top250 ";

    util.http.get(inTheatersUrl, { start: 0, count: 3 })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies__inTheaters');
      });

    util.http.get(top250Url, { start: 0, count: 3 })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies__top250');
      });
    
    util.http.get(comingSoonUrl, { start: 0, count: 3 })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies__comingSoon');
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
        [variable]: movies,
        [variable + '__flex']: new Array((3 - movies.length % 3) % 3).fill({})
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
  },

  /**
   * 所有引用了 movie-template 的页面都需要有 onMovieDetailTap 方法
   * @desc 单条电影点击回调
   */
  onMovieDetailTap(e) {
    let movieId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id;
    console.log('you tap movie \'s id is ' + movieId);
    if(!movieId) {
      console.error('movieId is null, somethings wrong');
      return;
    }
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?movieId='+movieId,
    })
  },
  
  /**
   * @desc 搜索输入框blur回调
   */
  onSearchInputBlur(e) {
    //this.setData({ isSearchMode: false });
    console.log(e)
    let value = e && e.detail && e.detail.value || '';
    this.setData({ searchInputVal: value });
    this.doSearchMovies();
  },

  /**
   * @desc 搜索输入框focus回调
   */
  onSearchInputFocus() {
    this.setData({ isSearchMode: true });
  },

  /**
   * @desc 搜索输入框右侧的关闭按钮
   */
  onSearchCloseTap() {
    this.setData({ isSearchMode: false, searchInputVal: '' });
  },

  /**
   * @desc 关键字搜索电影
   */
  doSearchMovies() {
    let 
      self = this, 
      keyword = self.data.searchInputVal,
      url = app.data.globalData.doubanBase + "/v2/movie/search",
      params = {q: keyword};

    util.http.get(url, params, {
      beforeSend: () => {
        wx.showNavigationBarLoading();
      }
    })
      .then(resp => {
        self.processDoubanData(resp.data, 'movies__search');
      })
      .always(() => {
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        console.error(err);
      })
      
  }
})