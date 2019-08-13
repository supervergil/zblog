<template>
  <div class="page-system-upload" v-loading="form.loading" v-loading.fullscreen="true" element-loading-text="正在加载...">
    <h2>
      上传设置
      <el-switch
        class="page-system-upload__switch"
        v-model="form.qiniu_enabled"
        active-text="开启七牛云存储"
        @change="clearForm"
      ></el-switch>
    </h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.saving"
      element-loading-text="正在保存..."
      class="page-system-upload__form"
    >
      <el-form-item label="AccessKey" prop="qiniu_access_key">
        <el-input
          :disabled="!form.qiniu_enabled"
          v-model="form.qiniu_access_key"
          placeholder="AccessKey"
        ></el-input>
      </el-form-item>
      <el-form-item label="SecretKey" prop="qiniu_secret_key">
        <el-input
          :disabled="!form.qiniu_enabled"
          v-model="form.qiniu_secret_key"
          placeholder="SecretKey"
        ></el-input>
      </el-form-item>
      <el-form-item label="空间名" prop="qiniu_bucket">
        <el-input :disabled="!form.qiniu_enabled" v-model="form.qiniu_bucket" placeholder="空间名"></el-input>
      </el-form-item>
      <el-form-item label="七牛云域名" prop="qiniu_domain">
        <el-input :disabled="!form.qiniu_enabled" v-model="form.qiniu_domain" placeholder="七牛云域名"></el-input>
      </el-form-item>
      <el-form-item label="路径前缀" prop="qiniu_prefix">
        <el-input :disabled="!form.qiniu_enabled" v-model="form.qiniu_prefix" placeholder="路径前缀"></el-input>
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
  name: "system-upload",
  data() {
    return {
      originData: [],
      form: {
        saving: false,
        loading: false,
        qiniu_enabled: false,
        qiniu_access_key: "",
        qiniu_secret_key: "",
        qiniu_bucket: "",
        qiniu_domain: "",
        qiniu_prefix: ""
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
    this.form.loading = true;
    const { status, data } = await services.system.getUpload();
    if (status === 1) {
      this.originData = [...data];
      for (let item of data) {
        this.form[item.key] = item.value;
      }
      this.form.qiniu_enabled = !!Number(this.form.qiniu_enabled);
    }
    this.form.loading = false;
  },
  methods: {
    async save() {
      if (this.form.qiniu_enabled) {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            this.form.saving = true;
            for (let item of this.originData) {
              item.value = this.form[item.key];
            }
            const { status } = await services.system.saveUpload({
              options: this.originData
            });
            if (status === 1) {
              this.$message.success("保存成功！");
            }
            this.form.saving = false;
          }
        });
      } else {
        this.form.saving = true;
        for (let item of this.originData) {
          item.value = this.form[item.key];
        }
        const { status } = await services.system.saveUpload({
          options: this.originData
        });
        if (status === 1) {
          this.$message.success("保存成功！");
        }
        this.form.saving = false;
      }
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
.page-system-upload {
  &__switch {
    margin-left: 10px;
    font-size: 13px;
  }
  &__form {
    width: 600px;
  }
}
</style>
