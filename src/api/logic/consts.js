module.exports = {
  tokenSecret: "maggie",
  // 跳过token验证的api列表
  skipAdminCheckList: [
    {
      controller: "auth",
      actions: ["login", "logout"]
    }
  ]
};
