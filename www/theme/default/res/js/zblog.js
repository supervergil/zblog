var body = document.body;
var mainContainer = document.getElementById("main-container");

// 点击侧边栏按钮
var toggler = document.getElementById("mobile-menu-toggler");
var mask = document.getElementById("navigation-mask");
var menu = document.getElementById("mobile-menu");
var showSideNavigation = function(e) {
  e.preventDefault();
  mask.style.display = "block";
  body.className = "lock";
  menu.style.transform = "translateX(100%)";
};
var hideSideNavigation = function(e) {
  e.preventDefault();
  mask.style.display = "none";
  body.className = "";
  menu.style.transform = "translateX(0)";
};

toggler.addEventListener("click", showSideNavigation);
mask.addEventListener("click", hideSideNavigation);
