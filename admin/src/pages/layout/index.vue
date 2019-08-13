<template>
  <div
    class="page-layout-general"
    v-loading="form.loading"
    v-loading.fullscreen="true"
    element-loading-text="正在加载..."
  >
    <h2>基本外观设置</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      v-loading="form.saving"
      element-loading-text="正在保存设置..."
      class="page-layout-general__form"
      label-position="right"
      label-width="120px"
    >
      <el-form-item prop="show_banner" label="顶部轮播图">
        <el-switch v-model="form.show_banner" active-text="启用" inactive-text="关闭"></el-switch>
        <router-link to="/layout/banner" style="margin-left: 10px;">
          <el-button type="text">去设置轮播图</el-button>
        </router-link>
      </el-form-item>
      <el-form-item prop="show_promotion" label="置顶栏目状态">
        <el-switch v-model="form.show_promotion" active-text="启用" inactive-text="关闭"></el-switch>
      </el-form-item>
      <el-form-item v-if="form.show_promotion" prop="promotion_tag" label="置顶栏目标签">
        <el-input v-model="form.promotion_tag"></el-input>
      </el-form-item>
      <el-form-item v-if="form.show_promotion" prop="promotion_title" label="置顶栏目标题">
        <el-input v-model="form.promotion_title"></el-input>
      </el-form-item>
      <el-form-item v-if="form.show_promotion" prop="promotion_path" label="置顶栏目链接">
        <el-input v-model="form.promotion_path"></el-input>
      </el-form-item>
      <el-form-item v-if="form.show_promotion" prop="promotion_description" label="置顶栏目描述">
        <el-input v-model="form.promotion_description" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "layout-general",
  data() {
    return {
      originData: [],
      form: {
        loading: false,
        saving: false,
        show_banner: false,
        show_promotion: false,
        promotion_tag: "",
        promotion_title: "",
        promotion_path: "",
        promotion_description: ""
      },
      rules: {
        promotion_tag: [
          { required: true, message: "请输入栏目标签", trigger: "blur" }
        ],
        promotion_title: [
          { required: true, message: "请输入栏目标题", trigger: "blur" }
        ],
        promotion_path: [
          { required: true, message: "请输入栏目链接", trigger: "blur" }
        ],
        promotion_description: [
          { required: true, message: "请输入栏目描述", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.form.loading = true;
    await this.getDetail();
    this.form.loading = false;
  },
  methods: {
    async save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.saving = true;
          for (let item of this.originData) {
            item.value = this.form[item.key];
          }
          const { status, data } = await services.layout.saveGeneral({
            options: this.originData
          });
          if (status === 1) {
            this.$message.success("保存成功！");
          }
          this.form.saving = false;
        }
      });
    },
    async getDetail() {
      const { status, data } = await services.layout.getGeneral();
      if (status === 1) {
        this.originData = data;
        for (let item of data) {
          this.form[item.key] = item.value;
        }
        this.form.show_banner = !!Number(this.form.show_banner);
        this.form.show_promotion = !!Number(this.form.show_promotion);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-general {
  &__form {
    width: 600px;
  }
}
</style>
