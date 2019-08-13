<template>
  <div class="page-system-email-template">
    <h2>{{form.title}}编辑</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="80px"
      v-loading="form.loading"
      element-loading-text="正在保存..."
      class="page-system-email-template__form"
    >
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="预览内容" prop="text">
        <el-input v-model="form.text" type="textarea" :rows="3" placeholder="请输入预览内容"></el-input>
      </el-form-item>
      <el-form-item label="HTML内容" prop="html">
        <el-input v-model="form.html" type="textarea" :rows="5" placeholder="请输入HTML内容"></el-input>
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
  name: "system-email-template",
  data() {
    return {
      originData: [],
      form: {
        loading: false,
        title: "",
        subject: "",
        text: "",
        html: "",
        mark: ""
      },
      rules: {
        qiniu_access_key: [
          { required: true, message: "请输入AccessKey", trigger: "blur" }
        ],
        qiniu_secret_key: [
          { required: true, message: "请输入SecretKey", trigger: "blur" }
        ],
        qiniu_bucket: [
          { required: true, message: "请输入空间名", trigger: "blur" }
        ],
        qiniu_domain: [
          { required: true, message: "请输入融合域名", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    const { status, data } = await services.system.getEmailTemplateDetail({
      id: this.$route.params.id
    });
    if (status === 1) {
      this.form.title = data.title;
      this.form.subject = data.subject;
      this.form.text = data.text;
      this.form.html = data.html;
    }
  },
  methods: {
    async save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.system.saveEmailTemplate({
            id: this.$route.params.id,
            title: this.form.title,
            text: this.form.text,
            html: this.form.html
          });
          if (status === 1) {
            this.$message.success("保存成功！");
          }
          this.form.loading = false;
        }
      });
    },
    clearForm(flag) {
      if (!flag) {
        this.$refs["form"].clearValidate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-system-email-template {
  &__form {
    width: 600px;
  }
}
</style>
