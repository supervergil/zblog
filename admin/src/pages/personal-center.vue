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
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar_url">
        <div
          class="page-personal-center__picker"
          @click="showImageDialog('avatar_url')"
          v-if="form.avatar_url===''"
        >
          <div class="text">选择头像</div>
        </div>
        <div class="page-personal-center__cover" @click="showImageDialog('avatar_url')" v-else>
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.avatar_url" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="description">
        <el-input v-model="form.description" placeholder="一句话介绍自己"></el-input>
      </el-form-item>
      <el-form-item label="个人网站" prop="about_url">
        <el-input v-model="form.about_url" placeholder="请输入个人网站"></el-input>
      </el-form-item>
      <el-form-item label="微信二维码" prop="wechat_qrcode">
        <div
          class="page-personal-center__picker"
          @click="showImageDialog('wechat_qrcode')"
          v-if="form.wechat_qrcode===''"
          style="height: 162px;line-height: 162px;"
        >
          <div class="text">二维码图片</div>
        </div>
        <div
          class="page-personal-center__cover"
          @click="showImageDialog('wechat_qrcode')"
          v-else
          style="height: 162px;line-height: 162px;"
        >
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.wechat_qrcode" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="打赏码标题" prop="reward_title">
        <el-input v-model="form.reward_title" placeholder="打赏码标题"></el-input>
      </el-form-item>
      <el-form-item label="打赏二维码" prop="reward_qrcode">
        <div
          class="page-personal-center__picker"
          @click="showImageDialog('reward_qrcode')"
          v-if="form.reward_qrcode===''"
        >
          <div class="text">二维码图片</div>
        </div>
        <div class="page-personal-center__cover" @click="showImageDialog('reward_qrcode')" v-else>
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.reward_qrcode" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="save">保存</el-button>
        <el-button round @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="插入图片"
      :fullscreen="true"
      :append-to-body="true"
      :visible.sync="imageDialogVisible"
      :center="true"
    >
      <z-upload-picker ref="picker" :type="['image']" :show-upload="true"></z-upload-picker>
      <div slot="footer">
        <el-button @click="hideImageDialog">取 消</el-button>
        <el-button type="primary" @click="insertImage">插 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "personal-center",
  data() {
    return {
      imageDialogVisible: false,
      type: "",
      form: {
        loading: false,
        name: "",
        avatar_url: "",
        email: "",
        description: "",
        about_url: "",
        wechat_qrcode: "",
        reward_title: "",
        reward_qrcode: ""
      },
      rules: {
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        description: [
          { required: true, message: "请输入自我介绍", trigger: "blur" }
        ]
        // description: [
        //   { required: true, message: "请输入站点描述", trigger: "blur" }
        // ],
        // keywords: [
        //   { required: true, message: "请输入关键词", trigger: "blur" }
        // ],
        // favicon: [
        //   { required: true, message: "请上传favicon", trigger: "blur" }
        // ],
        // copyright: [
        //   { required: true, message: "请输入版权信息", trigger: "blur" }
        // ]
      }
    };
  },
  async created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const { status, data } = await services.author.getDetail();
      if (status === 1) {
        this.form.name = data.name;
        this.form.avatar_url = data.avatar_url;
        this.form.email = data.email;
        this.form.description = data.description;
        this.form.about_url = data.about_url;
        this.form.wechat_qrcode = data.wechat_qrcode;
        this.form.reward_title = data.reward_title;
        this.form.reward_qrcode = data.reward_qrcode;
      }
    },
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.author.save({
            info: {
              name: this.form.name,
              avatar_url: this.form.avatar_url,
              email: this.form.email,
              description: this.form.description,
              about_url: this.form.about_url,
              wechat_qrcode: this.form.wechat_qrcode,
              reward_title: this.form.reward_title,
              reward_qrcode: this.form.reward_qrcode
            }
          });
          if (status === 1) {
            const userInfo = this.$store.state.user;
            userInfo.avatar = this.form.avatar_url;
            userInfo.name = this.form.name;
            this.$store.commit("SET_USER", userInfo);
            this.$message.success("保存成功！");
          }
          this.form.loading = false;
        }
      });
    },
    showImageDialog(type) {
      this.type = type;
      this.imageDialogVisible = true;
    },
    hideImageDialog() {
      this.imageDialogVisible = false;
    },
    insertImage() {
      this.form[this.type] = this.$refs["picker"].$getSelect()[0].url;
      this.$refs["picker"].$clearSelect();
      this.hideImageDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-personal-center {
  &__form {
    width: 600px;
  }
  &__picker {
    width: 125px;
    height: 125px;
    line-height: 125px;
    border: 1px dashed #ccc;
    user-select: none;
    text-align: center;
    cursor: pointer;
    & .text {
      font-size: 11px;
      color: #aaa;
    }
  }
  &__cover {
    position: relative;
    width: 125px;
    height: 125px;
    border: 1px solid #ccc;
    user-select: none;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
