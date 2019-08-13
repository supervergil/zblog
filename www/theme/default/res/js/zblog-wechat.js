var scriptDom = document.querySelector(
  "script[src='/theme/default/res/js/zblog-wechat.js']"
);
var appId = scriptDom.getAttribute("data-appid");
var timestamp = scriptDom.getAttribute("data-timestamp");
var nonceStr = scriptDom.getAttribute("data-nonceStr");
var signature = scriptDom.getAttribute("data-signature");

wx.config({
  debug: false,
  appId: appId,
  timestamp: timestamp,
  nonceStr: nonceStr,
  signature: signature,
  jsApiList: ["updateAppMessageShareData","updateTimelineShareData"]
});
