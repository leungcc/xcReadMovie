Page({
  goPage() {
    // wx.navigateTo({
    //   url: '../post/post'
    // });
    // wx.redirectTo({
    //   url: '../post/post',
    // });
    wx.switchTab({
      url: '../post/post'
    });
  }
})