<template>
  <div class="page-login">
    <div class="page-login__box">
      <div class="page-login__left">
        <h1 class="page-login__title">ZBLOG</h1>
        <div class="page-login__description">zblog是一款基于nodejs开发的cms系统</div>
        <!-- <div class="page-login__site">
          <span>源码：</span>
          <a
            href="https://github.com/supervergil/zblog"
            target="_blank"
          >https://github.com/supervergil/zblog</a>
        </div> -->
      </div>
      <div class="page-login__right">
        <h2 class="page-login__name">登录</h2>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          v-loading="form.loading"
          class="page-login__form"
        >
          <el-form-item prop="account">
            <el-input v-model="form.account" placeholder="账户" @keyup.enter.native="login"></el-input>
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
          </el-form-item>
        </el-form>
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
      form: {
        loading: false,
        account: "",
        password: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账户", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    login() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status, data } = await services.auth.login({
            account: this.form.account,
            password: md5(
              `${this.form.account}${this.form.password}:zblog`
            ).toString()
          });
          if (status === 1) {
            this.$store.commit("SET_USER", data.userInfo);
            localStorage.setItem("token", data.token);
            this.$router.replace("/dashboard");
            this.$message.success({
              message: "登录成功！",
              duration: 800
            });
          }
          this.form.loading = false;
        }
      });
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
    width: 768px;
    height: 480px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    z-index: 100;
  }
  &__left {
    position: relative;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    background-color: #409eff;
    color: #fff;
    text-align: center;
  }
  &__title {
    padding: 0;
    margin: 0;
    font-size: 50px;
  }
  &__description {
    margin-top: 10px;
    font-size: 16px;
  }
  &__site {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    font-size: 11px;
    & > a {
      color: white;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__right {
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
