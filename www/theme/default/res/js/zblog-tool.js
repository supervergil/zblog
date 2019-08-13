var zblog = {
  http: function(method, url, request) {
    return new Promise(function(resolve, reject) {
      axios({
        method: method,
        url: url,
        data: request ? request.data : null,
        params: request ? request.params : null,
        timeout: 120000,
        headers: {
          "User-Id": request ? request.user_id : "",
          "Access-Token": request ? request.token : "",
          Secret: "ZBLOG"
        },
        withCredentials: true,
        validateStatus: () => {
          return true;
        }
      })
        .then(function({ status, data }) {
          if (status.toString().match(/^20/)) {
            if (data.errno.toString() === "0") {
              resolve({
                status: 1,
                data: data
              });
            } else {
              alert(data.errmsg);
              reject({
                status: 2,
                data: data.errmsg
              });
            }
          } else {
            if (status.toString() === "401") {
              alert(data.errmsg || "登录已失效，请重新登录！");
              window.localStorage.removeItem("user");
              window.localStorage.removeItem("token");
              window.localStorage.removeItem("client-user");
              window.localStorage.removeItem("client-token");
              window.location.reload();
            } else {
              reject(status);
            }
          }
        })
        .catch(function(e) {
          if (e.toString().match(/Network Error/i)) {
            alert("服务器连接失败！");
          } else if (e.toString().match(/500/i)) {
            alert("服务器内部错误！");
          } else if (e.toString().match(/404/i)) {
            alert("api地址不存在！");
          } else if (e.toString().match(/401/i)) {
            alert("没有访问权限！");
          } else {
            alert(e);
          }
          reject({
            status: 3,
            returnCode: "0",
            data: e.toString()
          });
        });
    });
  }
};
