// 页面滚动 头部变化
var setHeader = function() {
  var header = document.getElementById("header");
  if (document.body.clientWidth >= 720) {
    if (window.scrollY > 10) {
      header.className = "header fixed";
      mainContainer.style.paddingTop = "88px";
    } else {
      if (header.className != "header") {
        header.className = "header";
        mainContainer.style.paddingTop = "0";
      }
    }
  } else {
    mainContainer.style.paddingTop = "0";
  }
};
window.addEventListener("scroll", _.throttle(setHeader, 80));
window.addEventListener("resize", _.throttle(setHeader, 200));
setHeader();
