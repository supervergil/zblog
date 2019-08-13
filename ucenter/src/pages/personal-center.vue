<template>
  <div class="page-personal-center">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="120px"
      size="mini"
      v-loading="form.loading"
      element-loading-text="正在保存..."
      class="page-personal-center__form"
    >
      <el-form-item label="昵称" prop="nick_name">
        <el-input v-model="form.nick_name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          v-loading="uploading"
          element-loading-text="上传中"
          element-loading-spinner="none"
          class="page-personal-center__avatar"
          action="/api/upload"
          :show-file-list="false"
          accept=".jpg, .gif, .png, .jpeg"
          :http-request="uploadAvatar"
        >
          <img v-if="form.avatar" :src="form.avatar" class="page-personal-center__avatar-preview">
          <i v-else class="el-icon-plus page-personal-center__avatar-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="save">保存</el-button>
        <el-button round @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "personal-center",
  data() {
    return {
      uploading: false,
      form: {
        loading: false,
        nick_name: "",
        avatar: ""
      },
      rules: {
        nick_name: [{ required: true, message: "请输入昵称", trigger: "blur" }]
      }
    };
  },
  async created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const { status, data } = await services.user.getDetail();
      if (status === 1) {
        this.form.nick_name = data.nick_name;
        this.form.avatar = data.avatar;
      }
    },
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.user.save({
            info: {
              nick_name: this.form.nick_name,
              avatar: this.form.avatar
            }
          });
          if (status === 1) {
            const userInfo = this.$store.state.user;
            userInfo.avatar = this.form.avatar;
            userInfo.name = this.form.nick_name;
            this.$store.commit("SET_USER", userInfo);
            this.$message.success("保存成功！");
          }
          this.form.loading = false;
        }
      });
    },
    async uploadAvatar(param) {
      this.uploading = true;
      const form = new FormData();
      form.append("file", param.file);
      const { data, status } = await services.common.uploadToQiniu({
        contentType: "multipart/form-data",
        data: form
      });
      if (status === 1) {
        this.form.avatar = data;
      }
      this.uploading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-personal-center {
  &__form {
    width: 600px;
  }
  &__avatar {
    width: 60px;
    & /deep/ {
      & .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
    }
    &-preview {
      width: 58px;
      height: 58px;
      display: block;
    }
    &-plus {
      font-size: 28px;
      color: #8c939d;
      width: 58px;
      height: 58px;
      line-height: 58px;
      text-align: center;
    }
  }
}
</style>
