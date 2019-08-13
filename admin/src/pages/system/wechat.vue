<template>
  <div class="page-system-wechat" v-loading="form.loading" v-loading.fullscreen="true" element-loading-text="正在加载...">
    <h2>
      微信接入
      <el-switch
        class="page-system-wechat__switch"
        v-model="form.wechat_enabled"
        active-text="开启微信接入"
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
      class="page-system-wechat__form"
    >
      <el-form-item label="AppId" prop="wechat_appid">
        <el-input
          :disabled="!form.wechat_enabled"
          v-model="form.wechat_appid"
          placeholder="开发者ID（AppId）"
        ></el-input>
      </el-form-item>
      <el-form-item label="AppSecret" prop="wechat_appsecret">
        <el-input
          :disabled="!form.wechat_enabled"
          v-model="form.wechat_appsecret"
          placeholder="AppSecret"
        ></el-input>
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
  name: "system-wechat",
  data() {
    return {
      originData: [],
      form: {
        loading: false,
        saving: false,
        wechat_enabled: false,
        wechat_appid: "",
        wechat_appsecret: ""
      },
      rules: {
        wechat_appid: [
          { required: true, message: "请输入微信appid", trigger: "blur" }
        ],
        wechat_appsecret: [
          { required: true, message: "请输入微信appsecret", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.form.loading = true;
    const { status, data } = await services.system.getWechat();
    if (status === 1) {
      this.originData = [...data];
      for (let item of data) {
        this.form[item.key] = item.value;
      }
      this.form.wechat_enabled = !!Number(this.form.wechat_enabled);
    }
    this.form.loading = false;
  },
  methods: {
    async save() {
      if (this.form.wechat_enabled) {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            this.form.saving = true;
            for (let item of this.originData) {
              item.value = this.form[item.key];
            }
            const { status } = await services.system.saveWechat({
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
        const { status } = await services.system.saveWechat({
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
.page-system-wechat {
  &__switch {
    margin-left: 10px;
    font-size: 13px;
  }
  &__form {
    width: 600px;
  }
}
</style>
