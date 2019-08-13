var comment = document.querySelector("[zblog-comment]");

var commentUser = {
  id: 0,
  name: "",
  avatar: "",
  role: ""
};

var isUserLogin =
  !!localStorage.getItem("client-user") &&
  !!localStorage.getItem("client-token");

var isAdminLogin =
  !!localStorage.getItem("user") && !!localStorage.getItem("token");

if (!localStorage.getItem("comment-role")) {
  if (isAdminLogin) {
    var adminUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("comment-role", "admin");
    commentUser.id = adminUser.id;
    commentUser.name = adminUser.name;
    commentUser.avatar = adminUser.avatar;
    commentUser.role = "admin";
  } else if (isUserLogin) {
    var adminUser = JSON.parse(localStorage.getItem("client-user"));
    localStorage.setItem("comment-role", "user");
    commentUser.id = adminUser.id;
    commentUser.name = adminUser.name;
    commentUser.avatar = adminUser.avatar;
    commentUser.role = "user";
  }
} else {
  if (
    localStorage.getItem("comment-role") === "admin" &&
    (!localStorage.getItem("user") || localStorage.getItem("user") === "null")
  ) {
    localStorage.setItem("comment-role", "user");
  } else if (
    localStorage.getItem("comment-role") === "user" &&
    (!localStorage.getItem("client-user") ||
      localStorage.getItem("user") === "null")
  ) {
    localStorage.setItem("comment-role", "admin");
  }
  if (localStorage.getItem("comment-role") === "admin" && isAdminLogin) {
    var adminUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("comment-role", "admin");
    commentUser.id = adminUser.id;
    commentUser.name = adminUser.name;
    commentUser.avatar = adminUser.avatar;
    commentUser.role = "admin";
  } else if (localStorage.getItem("comment-role") === "user" && isUserLogin) {
    var adminUser = JSON.parse(localStorage.getItem("client-user"));
    localStorage.setItem("comment-role", "user");
    commentUser.id = adminUser.id;
    commentUser.name = adminUser.name;
    commentUser.avatar = adminUser.avatar;
    commentUser.role = "user";
  }
}

if (!!comment) {
  var previewBtn = comment.querySelector(".btn-preview");
  var editBtn = comment.querySelector(".btn-edit");
  var commentBtn = comment.querySelector(".btn-comment");
  var loginBtn = comment.querySelector(".btn-login");
  var loadMoreBtn = comment.querySelector(".btn-load-more");
  var userAvatar = comment.querySelector(".comment-publish > .avatar > img");
  var textarea = comment.querySelector(".comment-publish > .box > textarea");
  var markdown = comment.querySelector(".comment-publish > .box > .markdown");
  var replyContent = comment.querySelector(
    ".comment-publish > .box > .replyContent"
  );
  var loginDom = comment.querySelector(".account .login");
  var unloginDom = comment.querySelector(".account .unlogin");
  var exchangeIcon = comment.querySelector(".account .exchange-user");
  var commentContainer = comment.querySelector(".comment-container");

  var page = 1;
  var replyId = null;

  var setTextareaStyle = function(textarea) {
    var rows = textarea.value.split(/\r?\n/).length;
    textarea.style.height = rows <= 3 ? "72px" : (rows - 3) * 16 + 72 + "px";
    if (rows > 12) {
      textarea.style.overflow = "hidden scroll";
    } else {
      textarea.style.overflow = "hidden";
    }
  };

  var getCommentList = function(page) {
    return new Promise(function(resolve, reject) {
      zblog
        .http("post", "/blog/comment/getList", {
          data: {
            page: page,
            pathname: location.pathname
          }
        })
        .then(function(resp) {
          resolve(resp);
        })
        .catch(function(e) {
          reject(e);
        });
    });
  };

  var resetReplyAndDelete = function() {
    var commentList = comment.querySelectorAll(
      ".comment-container > .comment-item"
    );
    if (isAdminLogin || isUserLogin) {
      for (var key in commentList) {
        if (commentList.hasOwnProperty(key)) {
          var commentUserId = commentList[key].getAttribute("data-user-id");
          var commentUserRole = commentList[key].getAttribute("data-user-role");
          if (
            commentUser.id == commentUserId &&
            commentUserRole == commentUser.role
          ) {
            commentList[key].querySelector(".remove").style.display = "inline";
            commentList[key].querySelector(".reply").style.display = "none";
          } else {
            commentList[key].querySelector(".remove").style.display = "none";
            commentList[key].querySelector(".reply").style.display = "inline";
          }
        }
      }
    } else {
      if (
        comment.querySelector(".comment-container .remove") ||
        comment.querySelector(".comment-container .reply")
      ) {
        comment.querySelector(".comment-container .remove").style.display =
          "none";
        comment.querySelector(".comment-container .reply").style.display =
          "none";
      }
    }
  };

  resetReplyAndDelete();

  if (isUserLogin && isAdminLogin) {
    exchangeIcon.style.display = "inline";

    exchangeIcon.addEventListener("click", function() {
      var exchange = window.confirm(
        "是否切换至" +
          (commentUser.role === "admin" ? "普通用户" : "管理员账户") +
          "？"
      );
      if (exchange) {
        if (commentUser.role === "user") {
          var adminUser = JSON.parse(localStorage.getItem("user"));
          localStorage.setItem("comment-role", "admin");
          commentUser.id = adminUser.id;
          commentUser.name = adminUser.name;
          commentUser.avatar = adminUser.avatar;
          commentUser.role = "admin";
        } else if (commentUser.role === "admin") {
          var adminUser = JSON.parse(localStorage.getItem("client-user"));
          localStorage.setItem("comment-role", "user");
          commentUser.id = adminUser.id;
          commentUser.name = adminUser.name;
          commentUser.avatar = adminUser.avatar;
          commentUser.role = "user";
        }
        userAvatar.src =
          commentUser.avatar || "/static/images/default-avatar.jpeg";
        loginDom.querySelector(".name").innerText = commentUser.name;
        resetReplyAndDelete();
      }
    });
  } else {
    exchangeIcon.style.display = "none";
  }

  if (isUserLogin || isAdminLogin) {
    loginBtn.style.display = "none";
    previewBtn.style.display = "inline-block";
    commentBtn.style.display = "inline-block";
    textarea.removeAttribute("disabled");
    textarea.setAttribute("placeholder", "说点什么");

    loginDom.querySelector(".name").innerText = commentUser.name;
    loginDom.style.display = "block";
    unloginDom.style.display = "none";
    userAvatar.src = commentUser.avatar || "/static/images/default-avatar.jpeg";

    commentBtn.addEventListener("click", function() {
      if (textarea.value.length === 0) {
        return alert("请输入评论！");
      }
      this.setAttribute("loading", true);
      zblog
        .http("post", "/blog/comment/addComment", {
          data: {
            post_id: comment.getAttribute("data-post-id"),
            post_token: comment.getAttribute("data-post-token"),
            user_id: commentUser.id,
            comment_id: replyId,
            pathname: location.pathname,
            markdown: textarea.value,
            is_admin: commentUser.role === "admin"
          },
          user_id: commentUser.id,
          token:
            commentUser.role === "admin"
              ? localStorage.getItem("token")
              : localStorage.getItem("client-token")
        })
        .then(function(resp) {
          page = 1;
          commentBtn.removeAttribute("loading");
          textarea.value = "";
          alert("发布成功！");
          window.location.reload();
        })
        .catch(function(e) {
          commentBtn.removeAttribute("loading");
        });
    });

    previewBtn.addEventListener("click", function() {
      var mdContent = marked(textarea.value, {
        headerIds: false,
        sanitize: true
      });
      if (mdContent.length === 0) {
        return false;
      }
      this.setAttribute("hide", true);
      editBtn.removeAttribute("hide");
      textarea.setAttribute("hide", true);
      markdown.removeAttribute("hide");
      markdown.innerHTML = mdContent;
    });

    editBtn.addEventListener("click", function() {
      this.setAttribute("hide", true);
      previewBtn.removeAttribute("hide");
      markdown.setAttribute("hide", true);
      textarea.removeAttribute("hide");
    });

    textarea.addEventListener("input", function() {
      setTextareaStyle(textarea);
    });

    replyContent.querySelector("i").addEventListener("click", function() {
      replyContent.setAttribute("hide", true);
      replyContent.querySelector("a").innerText = "";
      replyContent.querySelector("div").innerHTML = "";
      replyId = null;
    });

    commentContainer.addEventListener("click", function(e) {
      switch (e.target.parentNode.className) {
        case "icon reply":
          var richtext = e.target.parentNode.getAttribute(
            "data-comment-richtext"
          );
          var nickname = e.target.parentNode.getAttribute("data-nick-name");
          console.log(e.target.parentNode);
          var commentId = e.target.parentNode.getAttribute("data-comment-id");
          replyId = commentId;
          replyContent.querySelector("a").innerText = "@" + nickname;
          replyContent.querySelector("div").innerHTML = richtext;
          replyContent.removeAttribute("hide");
          textarea.focus();
          break;
        case "icon remove":
          var flag = window.confirm("是否删除这条评论？");
          if (flag) {
            zblog
              .http("post", "/blog/comment/removeComment", {
                data: {
                  id: e.target.parentNode.getAttribute("data-comment-id"),
                  is_admin: commentUser.role === "admin"
                },
                user_id: commentUser.id,
                token:
                  commentUser.role === "admin"
                    ? localStorage.getItem("token")
                    : localStorage.getItem("client-token")
              })
              .then(function(resp) {
                alert("删除成功！");
                window.location.reload();
              })
              .catch(function(e) {
                commentBtn.removeAttribute("loading");
              });
          }
          break;
      }
    });
  } else {
    loginBtn.style.display = "inline-block";
    previewBtn.style.display = "none";
    commentBtn.style.display = "none";
    textarea.setAttribute("disabled", true);
    textarea.setAttribute("placeholder", "登录后才能评论");

    loginDom.style.display = "none";
    unloginDom.style.display = "block";
    userAvatar.src = "/static/images/default-avatar.jpeg";

    loginBtn.addEventListener("click", function() {
      window.authOpener = window.open(
        "/ucenter#/signin?opener_redirect_url=" + location.href
      );
    });
  }

  // 事件
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function() {
      this.setAttribute("loading", true);
      // todo
      getCommentList(++page)
        .then(function(resp) {
          page = resp.data.data.currentPage;
          if (page >= resp.data.data.totalPages) {
            loadMoreBtn.style.display = "none";
          }
          var template =
            '{% for item in commentList %}<div class="comment-item"  id="comment-item-{{item.id}}" data-user-id="{{item.user_id}}"  data-user-role="{% if item.is_admin %}admin{% else %}user{% endif %}"><a class="avatar"><img src="{% if item.avatar %}{{item.avatar}}{% else %}/static/images/default-avatar.jpeg{% endif %}"/></a><div class="box"><div class="content {% if item.is_admin %}admin{% endif %}"><div class="comment-item-header"><a class="username">{{item.nick_name}}</a><span class="label">发表于</span><span class="date">{{item.created_date}}</span><a class="icon remove" data-comment-id="{{item.id}}"><i class="fas fa-trash-alt fa-fw"></i></a><a class="icon reply" data-comment-id="{{item.id}}" data-nick-name="{{item.nick_name}}" data-comment-richtext="{{item.richtext}}"><i class="fas fa-reply fa-fw"></i></a></div><div class="comment-item-content">{{item.richtext | safe}}</div>{% if item.reply_content %}<blockquote class="comment-item-reply">{% if not item.reply_is_del %}<a>@{{item.reply_name}}</a><span>：</span>{% endif %}<div>{{item.reply_content | safe}}</div></blockquote>{% endif %}</div></div></div>{% endfor %}';
          commentContainer.innerHTML += nunjucks.renderString(template, {
            commentList: resp.data.data.data
          });
          resetReplyAndDelete();
          loadMoreBtn.removeAttribute("loading");
        })
        .catch(function(e) {
          loadMoreBtn.removeAttribute("loading");
        });
    });
  }
}
