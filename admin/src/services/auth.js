import http from "@/plugins/http";

const auth = {
  login(data) {
    return http("post", "/api/auth/login", { data });
  },
  logout(data) {
    return http("post", "/api/auth/logout", { data });
  }
};

export default auth;
