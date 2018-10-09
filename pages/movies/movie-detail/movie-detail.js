import util from '../../../utils/util.js';
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieId: '',
    /**
     * 页面需要展示什么：
     * --头部
     *  1.标题                 movieDetailRender.title
     *  2.地区·年份            movieDetailRender.areaTime
     *  3.xxx条喜欢 xxx条评论  movieDetailRender.likeAndComment
     * --主内容
     * ================
     *  1.标题                 movieDetailRender.mainTitle
     *  2.评分                 movieDetailRender.score
     *    导演                 movieDetailRender.director
     *    影人（' / '分隔）     movieDetailRender.performers
     *    类型                 movieDetailRender.movieType
     * ================
     *  1.剧情简介             
     *  2.剧情简介详情         movieDetailRender.drama
     * ================
     *  1.影人
     *  2.影人图片名字list(横向滚动)  movieDetailRender.performersList
     */
    movieDetail: {},
    movieDetailRender: {},
    httpUrl: {
      movieDetail: '',
      
      shenmegui: '0000'
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    //设置data里的 movieId 和 httpUrl
    self.setData({ movieId: options.movieId, 'httpUrl.movieDetail': app.data.globalData.doubanBase + '/v2/movie/' + options.movieId});
    let url = self.data.httpUrl.movieDetail;
    util.http.get(url, {}).then(resp => {
      self.setData({ movieDetail: resp.data });
      self.processMovieDetail(resp.data);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * @desc 处理页面的 movieDetail 数据
   */
  processMovieDetail(data) {
    const self = this;
    data = data || {};
    self.setData({
      movieDetailRender: {
        title: data.title,
        areaTime: (data.attrs && data.attrs.country && data.attrs.country.join(',') || '') + ' · ' + (data.attrs && data.attrs.year && data.attrs.year.join(',') || ''),
        likeAndComment: (data.rating && data.rating.numRaters || 0) + '条评论',
        commentNum: data.rating && data.rating.numRaters || 0,
        mainTitle: data.alt_title || '',
        score: data.rating && data.rating.average || 0,
        director: data.attrs && data.attrs.director && data.attrs.director.length && data.attrs.director.slice(0, 4).join(' / ') || '',
        performers: data.attrs && data.attrs.cast && data.attrs.cast.length && data.attrs.cast.slice(0,4).join(' / ') || '', //表演者用 '/'隔开
        movieType: data.attrs && data.attrs.movie_type && data.attrs.movie_type.join('、') || '',
        drama: data.summary,
        img: data.image || '',
        average: data.rating && data.rating.average || 0,
        stars: util.convertToStarsArr(data.rating && data.rating.average || 0)
      }
    })
  },

  onViewFullImg() {

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

  }
})