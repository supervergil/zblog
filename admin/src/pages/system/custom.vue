<template>
  <div
    class="page-custom"
    v-loading="form.loading"
    v-loading.fullscreen="true"
    element-loading-text="正在加载..."
  >
    <el-form
      ref="form"
      :model="form"
      size="small"
      v-loading="form.saving"
      element-loading-text="正在保存..."
      class="page-custom__form"
    >
      <el-form-item label="自定义样式">
        <el-input
          v-model="form.custom_style"
          type="textarea"
          :rows="8"
          placeholder="请输入网站自定义样式，不要包含style标签"
        ></el-input>
      </el-form-item>
      <el-form-item label="自定义脚本">
        <el-input
          v-model="form.custom_script"
          type="textarea"
          :rows="8"
          placeholder="请输入网站自定义代码，不要包含script标签"
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
  name: "system-custom",
  data() {
    return {
      originData: [],
      form: {
        loading: false,
        saving: false,
        custom_style: "",
        custom_script: ""
      }
    };
  },
  async created() {
    this.form.loading = true;
    await this.getCustom();
    this.form.loading = false;
  },
  methods: {
    async getCustom() {
      const { status, data } = await services.system.getCustom();
      if (status === 1) {
        this.originData = [...data];
        for (let item of data) {
          this.form[item.key] = item.value;
        }
      }
    },
    async save() {
      this.form.saving = true;
      for (let item of this.originData) {
        item.value = this.form[item.key];
      }
      const { status } = await services.system.saveCustom({
        options: this.originData
      });
      if (status === 1) {
        this.$message.success("保存成功！");
      }
      this.form.saving = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-custom {
}
</style>
