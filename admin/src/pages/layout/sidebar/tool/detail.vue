<template>
  <div class="page-layout-sidebar-tool-detail">
    <h2>编辑小工具</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在保存修改..."
      class="page-layout-sidebar-tool-detail__form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :disabled="form.is_system===1" placeholder="请输入工具名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="mark">
        <el-input v-model="form.mark" :disabled="true" placeholder="请输入工具标识"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" :rows="5" type="textarea" placeholder="使用nunjucks渲染"></el-input>
      </el-form-item>
      <el-form-item label="内置样式" prop="custom_style">
        <el-input v-model="form.custom_style" :rows="5" type="textarea" placeholder="请输入内置样式"></el-input>
      </el-form-item>
      <el-form-item label="内置脚本" prop="custom_script">
        <el-input v-model="form.custom_script" :rows="5" type="textarea" placeholder="请输入内置脚本"></el-input>
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
  name: "layout-sidebar-tool-add",
  data() {
    return {
      form: {
        loading: false,
        name: "",
        mark: "",
        content: "",
        custom_style: "",
        custom_script: "",
        is_system: 0
      },
      rules: {
        name: [{ required: true, message: "请输入工具名称", trigger: "blur" }],
        mark: [{ required: true, message: "请输入工具标识", trigger: "blur" }],
        content: [
          { required: true, message: "请输入工具内容", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.sidebar.saveTool({
            id: this.$route.params.id,
            name: this.form.name,
            content: this.form.content,
            custom_style: this.form.custom_style,
            custom_script: this.form.custom_script
          });
          if (status === 1) {
            this.$message.success("修改成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
    },
    async getDetail() {
      const { status, data } = await services.sidebar.getTool({
        id: this.$route.params.id
      });
      if (status === 1) {
        this.form.id = data.id;
        this.form.name = data.name;
        this.form.mark = data.mark;
        this.form.content = data.content;
        this.form.custom_style = data.custom_style;
        this.form.custom_script = data.custom_script;
        this.form.is_system = data.is_system;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-sidebar-tool-detail {
  &__form {
    width: 600px;
  }
}
</style>
