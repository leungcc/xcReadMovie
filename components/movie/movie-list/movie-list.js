// components/movie/movie-list/movie-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movies: {
      type: Array,
      observer(newVal, oldVal, changedPath) {
        this.setData({__movies: newVal});
      }
    },
    moviesFlex: {
      type: Array,
      observer(newVal, oldVal, changedPath) {
        this.setData({ __moviesFlex: newVal });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    __movies: [],
    __moviesFlex: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 所有引用了 movie-template 的页面都需要有 onMovieDetailTap 方法
   * @desc 单条电影点击回调
   */
    onMovieDetailTap(e) {
      let movieId = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id;
      console.log('you tap movie \'s id is ' + movieId);
      if (!movieId) {
        console.error('movieId is null, somethings wrong');
        return;
      }
      wx.navigateTo({
        url: '/pages/movies/movie-detail/movie-detail?movieId=' + movieId,
      })
    }
  }
})
