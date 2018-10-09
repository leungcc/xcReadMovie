// pages/post/post-detail/post-detail.js
const postData = require('../../../data/post-data.js');
const app = getApp(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postid: null, // 当前文章的 id
    dataDetail: null, // 当前文章对象
    collected: false, // 当前文章是否被收藏
    isPlayingMusic: false  // 当前是否正在播放音乐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let vm = this;
    let dataDetail = postData[options.postid];

    // 绑定音乐播放相关事件
    vm.bind_music_events();

    // 通过路由的 postid 确定文章的 object
    vm.setData({
      postid: options.postid,
      dataDetail: dataDetail
    });
    // 通过storage判断文章是否被收藏
    const postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[options.postid];
      vm.setData({
        collected: postCollected
      });
    } else {
      const postsCollected = {};
      postsCollected[options.postid] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    // 获取音乐状态
    wx.getBackgroundAudioPlayerState({
      success(res) {
        if(res.status === 1) {
          if (vm.data.dataDetail.music.url === res.dataUrl) {
            vm.setData({ isPlayingMusic: true });
          } else {
            wx.stopBackgroundAudio();
          }
        }
      }
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

  // ---------------- 自定义方法 ----------------
  bind_music_events() {
    let vm = this;
    // 注册一些监听函数
    wx.onBackgroundAudioPlay(() => {
      vm.setData({ isPlayingMusic: true });
    });
    wx.onBackgroundAudioPause(() => {
      vm.setData({ isPlayingMusic: false });
    });
    wx.onBackgroundAudioStop(() => {
      vm.setData({ isPlayingMusic: false });
    });
  },
  /**
   * 弹窗确定是否要收藏/取消收藏
   * @params {boolean} postCollected true-->收藏操作，false-->取消收藏操作
   * @params {object} key为'posts_collected'的storage存储
   */
  showModal_ifCollect(postCollected, postsCollected) {
    let vm = this;
    wx.showModal({
      title: '提示',
      content: '是否' + (postCollected ? '收藏' : '取消收藏') + '该文章？',
      showCancel: 'true',
      cancelText: postCollected ? '不收藏' : '取消',
      cancelColor: '#333',
      confirmColor: '#405f80',
      success(res) {
        if (res.cancel) {
          return;
        }
        // 更改 storage
        postsCollected[vm.data.postid] = postCollected;
        wx.setStorageSync('posts_collected', postsCollected);

        vm.setData({
          collected: postCollected
        });

        // 提示用户
        wx.showToast({
          duration: 1000,
          title: postCollected ? '收藏成功' : '取消收藏成功'
        });
      }
    });
  },
  // ---------------- 事件处理回调函数 ----------------
  /**
   * 收藏／取消收藏文章
   */
  onCollectionTap(event) {
    let vm = this;
    let postsCollected = wx.getStorageSync('posts_collected');
    let postCollected = postsCollected[this.data.postid];
    // 收藏变成未收藏，未收藏变收藏
    postCollected = !postCollected;

    vm.showModal_ifCollect(postCollected, postsCollected);
    
  },
  /**
   * 分享文章
   */
  onShareTap(event) {
    wx.showActionSheet({
      itemList: [
        '分享到微信好友',
        '分享到朋友圈',
        '分享到QQ',
        '分享到微博'
      ],
      itemColor: '#405f80',
      success(res) {
        // res.cancel 是否点了取消
        // res.index  数字元素序号，从0开始
      }
    })
  },
  /**
   * 点击音乐播放
   */
  onMusicTap(event) {
    const postid = this.data.postid;
    if(this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
    

    } else {
      
      let params = {
        dataUrl: postData[postid].music.url,
        title: postData[postid].music.title,
        coverImgUrl: postData[postid].music.coverImg
      };

      wx.playBackgroundAudio(params);
      
    }
  }
})