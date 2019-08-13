// 页面滚动 头部变化
var setHeader = function() {
  var header = document.getElementById("author");
  if (document.body.clientWidth > 1024) {
    if (window.scrollY > 112) {
      header.className = "widget fixed";
    } else {
      if (header.className != "header") {
        header.className = "widget";
      }
    }
  } else {
    header.className = "widget";
  }
};
window.addEventListener("scroll", _.throttle(setHeader, 80));
window.addEventListener("resize", _.throttle(setHeader, 200));
setHeader();
