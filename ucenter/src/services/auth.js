import http from "@/plugins/http";

const auth = {
  signin(data) {
    return http("post", "/uapi/auth/signin", { data });
  },
  signup(data) {
    return http("post", "/uapi/auth/signup", { data });
  },
  getValidCode(data) {
    return http("post", "/uapi/auth/getValidCode", { data });
  },
  signout() {
    return http("post", "/uapi/auth/signout");
  }
};

export default auth;
