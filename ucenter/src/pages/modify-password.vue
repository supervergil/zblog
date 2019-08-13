<template>
  <div class="page-modify-password">
    <h2>修改密码</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在提交..."
      class="page-modify-password__form"
    >
      <el-form-item label="原密码" prop="origin">
        <el-input v-model="form.origin" type="password" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new">
        <el-input v-model="form.new" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm">
        <el-input v-model="form.confirm" type="password" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="save">修改</el-button>
        <el-button round @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "crypto-js/md5";
import services from "@/services";

export default {
  name: "modify-password",
  data() {
    return {
      uploading: false,
      form: {
        loading: false,
        origin: "",
        new: "",
        confirm: ""
      },
      rules: {
        origin: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        new: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 64,
            message: "密码长度在 8 到 64 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (this.form.confirm !== "") {
                this.$refs.form.validateField("confirm");
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        confirm: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.new) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.user.modifyPassword({
            originPassword: md5(`${this.form.origin}:zblog`).toString(),
            newPassword: md5(`${this.form.new}:zblog`).toString(),
            confirmPassword: md5(`${this.form.confirm}:zblog`).toString()
          });
          if (status === 1) {
            this.$message.success("修改成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-modify-password {
  &__form {
    width: 600px;
  }
}
</style>
