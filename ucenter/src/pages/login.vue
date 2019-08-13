<template>
  <div class="page-login">
    <div class="page-login__box">
      <div class="page-login__container">
        <a
          type="primary"
          href="/"
          style="position:absolute;text-decoration: none;color: #409EFF;top:12px;left:12px;font-size:13px;"
        >&lt; 返回主页</a>
        <transition name="el-zoom-in-center" mode="out-in">
          <h2 v-if="$route.path==='/signin'" :key="0" class="page-login__name">用户登录</h2>
          <h2 v-else-if="$route.path==='/signup'" :key="1" class="page-login__name">用户注册</h2>
        </transition>
        <transition name="el-zoom-in-center" mode="out-in">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            v-loading="form.loading"
            class="page-login__form"
            v-if="$route.path==='/signin'"
            :key="0"
          >
            <el-form-item prop="account">
              <el-input v-model="form.account" placeholder="邮箱" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                @keyup.enter.native="login"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round @click="login">登录</el-button>
              <div>
                <el-button type="text" @click="jumpRegister">我要注册</el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            ref="signup-form"
            :model="signupForm"
            :rules="signupRules"
            label-position="right"
            label-width="80px"
            v-loading="signupForm.loading"
            class="page-login__form"
            v-if="$route.path==='/signup'"
            :key="1"
          >
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="signupForm.nickName"
                placeholder="昵称"
                :minlength="2"
                :maxlength="64"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="signupForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="signupForm.password"
                type="password"
                :minlength="8"
                :maxlength="64"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
              <el-input
                v-model="signupForm.repassword"
                type="password"
                :minlength="8"
                :maxlength="64"
                placeholder="确认密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="validCode">
              <el-input
                v-model="signupForm.validCode"
                :minlength="8"
                :maxlength="8"
                placeholder="验证码"
              >
                <template slot="append">
                  <el-button
                    type="success"
                    size="mini"
                    :loading="signupForm.sendingEmail"
                    @click="getValidCode"
                    v-if="!signupForm.sendedEmail"
                  >{{signupForm.sendingEmail?"发送中":"获取"}}</el-button>
                  <div v-else>{{signupForm.countdown}} 秒</div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-button type="primary" round @click="register">注册</el-button>
              <div>
                <el-button type="text" @click="jumpLogin">我要登录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "crypto-js/md5";
import services from "@/services";

export default {
  name: "login",
  layout: "full",
  data() {
    return {
      signalCode: md5(Math.random()).toString(),
      timer: null,
      form: {
        loading: false,
        account: "",
        password: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 64,
            message: "密码长度在 8 到 64 个字符",
            trigger: "blur"
          }
        ]
      },
      signupForm: {
        loading: false,
        sendingEmail: false,
        sendedEmail: false,
        countdown: 60,
        nickName: "",
        email: "",
        password: "",
        repassword: "",
        validCode: ""
      },
      signupRules: {
        nickName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: "不得包含特殊字符且不得以下划线开头",
            trigger: "blur"
          },
          {
            min: 2,
            max: 64,
            message: "昵称长度在 2 到 64 个字符",
            trigger: "change"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 64,
            message: "密码长度在 8 到 64 个字符",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (this.signupForm.repassword !== "") {
                this.$refs["signup-form"].validateField("repassword");
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        repassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.signupForm.password !== value) {
                callback(new Error("两次输入密码不一致"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        validCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 8,
            max: 8,
            message: "验证码长度为 8 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    login() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status, data } = await services.auth.signin({
            account: this.form.account,
            password: md5(`${this.form.password}:zblog`).toString()
          });
          if (status === 1) {
            this.$store.commit("SET_USER", data.userInfo);
            localStorage.setItem("client-token", data.token);
            if (this.$route.query.opener_redirect_url) {
              var redirectUrl = this.$route.query.opener_redirect_url;
              if (window.opener) {
                window.opener.location.reload();
                window.opener.authOpener.close();
              } else {
                location.href = redirectUrl;
              }
              return;
            }
            this.$router.replace("/");
            this.$message.success({
              message: "登录成功！",
              duration: 800
            });
          }
          this.form.loading = false;
        }
      });
    },
    async getValidCode() {
      if (
        !this.signupForm.email.match(
          /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        )
      ) {
        this.$refs["signup-form"].validateField("email");
        return this.$message.warning("请填写正确的邮箱地址，以便接收验证码！");
      }
      this.signupForm.sendingEmail = true;
      const { status, data } = await services.auth.getValidCode({
        email: this.signupForm.email,
        signalCode: this.signalCode
      });
      if (status === 1) {
        this.$message.success(
          "验证码已发送至您邮箱，若未收到，请在垃圾邮件中查找！"
        );
        this.signupForm.sendedEmail = true;
        this.timer = window.setInterval(() => {
          if (this.signupForm.countdown > 0) {
            this.signupForm.countdown--;
          } else {
            window.clearInterval(this.timer);
            this.timer = null;
            this.signupForm.sendedEmail = false;
            this.signupForm.countdown = 60;
          }
        }, 1000);
      }
      this.signupForm.sendingEmail = false;
    },
    async register() {
      this.$refs["signup-form"].validate(async valid => {
        if (valid) {
          this.signupForm.loading = true;
          const { status, data } = await services.auth.signup({
            email: this.signupForm.email,
            nick_name: this.signupForm.nickName,
            password: md5(`${this.signupForm.password}:zblog`).toString(),
            validCode: this.signupForm.validCode,
            signalCode: this.signalCode
          });
          if (status === 1) {
            this.$message.success("注册成功，请重新登录！");
            this.$refs["signup-form"].resetFields();
            this.$router.replace("/signin");
          }
          this.signupForm.loading = false;
        }
      });
    },
    jumpRegister() {
      this.$router.push("/signup");
    },
    jumpLogin() {
      this.$router.push("/signin");
    }
  }
};
</script>

<style lang="scss" scoped>
.page-login {
  &__box {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    width: 410px;
    height: 510px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    z-index: 100;
  }
  &__container {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }
  &__name {
    text-align: center;
    font-size: 30px;
  }
  &__form {
    text-align: center;
    & .el-form-item {
      margin: auto;
      margin-bottom: 22px;
      width: 80%;
    }
    & /deep/ .el-input__inner {
      border: none;
      background-color: #eee;
      appearance: textfield;
      &::-webkit-input-placeholder {
        color: #666;
      }
      &:-moz-placeholder {
        color: #666;
      }
      &::-moz-placeholder {
        color: #666;
      }
      &::-ms-input-placeholder {
        color: #666;
      }
    }
    & /deep/ .el-input__inner:focus {
      outline: -webkit-focus-ring-color auto 2px;
    }
  }
}
</style>
