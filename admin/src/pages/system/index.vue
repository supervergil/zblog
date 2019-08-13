<template>
  <div class="page-system" v-loading="form.loading" v-loading.fullscreen="true" element-loading-text="正在加载...">
    <h2>基本设置</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-position="right"
      label-width="100px"
      v-loading="form.saving"
      element-loading-text="正在保存..."
      class="page-system__form"
    >
      <el-form-item label="站点标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入站点标题"></el-input>
      </el-form-item>
      <el-form-item label="网站地址" prop="site">
        <el-input v-model="form.site" placeholder="请输入网站地址"></el-input>
      </el-form-item>
      <el-form-item label="站点副标题" prop="subTitle">
        <el-input v-model="form.subTitle" type="textarea" :rows="3" placeholder="支持html片段"></el-input>
      </el-form-item>
      <el-form-item label="欢迎标语" prop="welcome_content">
        <el-input v-model="form.welcome_content" type="textarea" :rows="4" placeholder="支持html片段"></el-input>
      </el-form-item>
      <el-form-item label="最新文章标语" prop="passage_tag">
        <el-input v-model="form.passage_tag" type="textarea" :rows="3" placeholder="支持html片段"></el-input>
      </el-form-item>
      <el-form-item label="站点描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入站点描述"></el-input>
      </el-form-item>
      <el-form-item label="站点关键词" prop="keywords">
        <el-input v-model="form.keywords" placeholder="请用半角逗号分割多个关键词"></el-input>
      </el-form-item>
      <el-form-item label="favicon" prop="favicon">
        <el-upload
          v-loading="upsaving"
          element-loading-text="上传中"
          element-loading-spinner="none"
          class="page-system__favicon"
          action="/api/upload"
          :show-file-list="false"
          accept=".ico"
          :http-request="uploadIco"
        >
          <img v-if="form.favicon" :src="form.favicon" class="page-system__favicon-preview" />
          <i v-else class="el-icon-plus page-system__favicon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="版权信息" prop="copyright">
        <el-input v-model="form.copyright" type="textarea" :rows="4" placeholder="支持html片段"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "system-general",
  data() {
    return {
      upsaving: false,
      originData: [],
      form: {
        saving: false,
        loading: false,
        title: "",
        site: "",
        subTitle: "",
        description: "",
        keywords: "",
        favicon: "",
        copyright: "",
        welcome_content: "",
        passage_tag: ""
      },
      rules: {
        title: [{ required: true, message: "请输入站点标题", trigger: "blur" }],
        site: [{ required: true, message: "请输入网站地址", trigger: "blur" }],
        subTitle: [
          { required: true, message: "请输入站点副标题", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入站点描述", trigger: "blur" }
        ],
        keywords: [
          { required: true, message: "请输入关键词", trigger: "blur" }
        ],
        favicon: [
          { required: true, message: "请上传favicon", trigger: "blur" }
        ],
        copyright: [
          { required: true, message: "请输入版权信息", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.form.loading = true;
    const { status, data } = await services.system.getGeneral();
    if (status === 1) {
      this.originData = data;
      for (let item of data) {
        if (item.key === "sub_title") {
          this.form.subTitle = item.value;
        } else {
          this.form[item.key] = item.value;
        }
      }
    }
    this.form.loading = false;
  },
  methods: {
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.saving = true;
          for (let item of this.originData) {
            if (item.key === "sub_title") {
              item.value = this.form.subTitle;
            } else {
              item.value = this.form[item.key];
            }
          }
          const { status } = await services.system.saveGeneral({
            options: this.originData
          });
          if (status === 1) {
            this.$message.success("保存成功！");
          }
          this.form.saving = false;
        }
      });
    },
    async uploadIco(param) {
      this.upsaving = true;
      const form = new FormData();
      form.append("file", param.file);
      const { data, status } = await services.common.upload({
        contentType: "multipart/form-data",
        data: form
      });
      if (status === 1) {
        this.form.favicon = data;
      }
      this.upsaving = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-system {
  &__form {
    width: 600px;
  }
  &__favicon {
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
