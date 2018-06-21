// pages/post/post.js
const newsListData = require("../../data/post-data.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: []
  },

  /** 小程序页面的生命周期 */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewsList();
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

  /**自定义方法 */
  getNewsList() {
    this.setData({ newsList: newsListData })
  },
  /**事件处理回调 */
  /**
   * 点击某条新闻跳转到新闻详情
   */
  onPostTap(event) {
    const id = event.currentTarget.dataset.id;
    console.log(`id:${id}`);
    wx.navigateTo({
      url: 'post-detail/post-detail?postid='+id,
    })
  },
  /**
   * 点击 swiper
   */
  onSwiperTap(event) {
    let postid = parseInt(event.target.dataset.postid);
    wx.navigateTo({
      url: 'post-detail/post-detail?postid=' + postid,
    })
  }
})