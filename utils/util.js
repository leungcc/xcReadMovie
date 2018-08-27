/**
 * 将评分转化为数组（进行视图渲染）如：7.6(5分制为3.8分 即 3.8颗★) --->[1, 1, 1, 0.8, 0]
 */
function convertToStarsArr(value) {
  if(!value && value !== 0) {
    console.error("convertToStartsArr need param");
  }
  var result = [];
  value = parseFloat((parseFloat(value)/2).toFixed(1));

  for(var i=0,len=5; i<len; i++) {
    var vRi = value - i;
    if(vRi >= 1) {
      result.push(1);
    } else if (vRi > 0 && vRi < 1) {
      result.push(vRi);
    } else if(vRi <= 0) {
      result.push(0);
    }
  }

  return result;
}

/**
 * 公用 http 请求
 */
function http(url, params, succCB, method) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "application/json"
    },
    data: params ? params : {},
    method: method ? method : 'GET',
    success(res) {
      if(succCB) succCB(res);
    },
    fail() {

    },
    complete() {

    }
  });
}

module.exports = {
  convertToStarsArr: convertToStarsArr,
  http: http
}