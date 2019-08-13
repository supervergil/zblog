<template>
  <div class="page-layout-sidebar-tool-add">
    <h2>新增小工具</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在添加小工具..."
      class="page-layout-sidebar-tool-add__form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入工具名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="mark">
        <el-input v-model="form.mark" placeholder="请输入工具标识"></el-input>
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
        <el-button type="primary" round @click="add">添加</el-button>
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
        custom_script: ""
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
  methods: {
    add() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.sidebar.addTool({
            name: this.form.name,
            mark: this.form.mark,
            content: this.form.content,
            custom_style: this.form.custom_style,
            custom_script: this.form.custom_script
          });
          if (status === 1) {
            this.$message.success("添加成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-sidebar-tool-add {
  &__form {
    width: 600px;
  }
}
</style>
