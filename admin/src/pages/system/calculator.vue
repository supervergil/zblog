<template>
  <div class="page-calculator" v-loading="form.loading" v-loading.fullscreen="true" element-loading-text="正在加载...">
    <h2>统计代码</h2>
    <el-form
      ref="form"
      :model="form"
      size="small"
      v-loading="form.saving"
      element-loading-text="正在保存..."
      class="page-calculator__form"
    >
      <el-form-item>
        <el-input
          v-model="form.calculator_script"
          type="textarea"
          :rows="15"
          placeholder="请输入网站统计代码，不要包含script标签"
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
  name: "system-calculator",
  data() {
    return {
      originData: [],
      form: {
        loading: false,
        saving: false,
        calculator_script: ""
      }
    };
  },
  async created() {
    this.form.loading = true;
    await this.getCalculator();
    this.form.loading = false;
  },
  methods: {
    async getCalculator() {
      const { status, data } = await services.system.getCalculator();
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
      const { status } = await services.system.saveCalculator({
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
.page-calculator {
}
</style>
