<template>
  <div class="page-category-add">
    <h2>新增分类</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在添加分类..."
      class="page-category-add__form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="缩略名" prop="pathname">
        <el-input v-model="form.pathname" placeholder="请输入分类缩略名"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入分类描述"></el-input>
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
  name: "category-add",
  data() {
    return {
      form: {
        loading: false,
        name: "",
        pathname: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        pathname: [
          { required: true, message: "请输入缩略名", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入分类描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    add() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.category.add({
            name: this.form.name,
            pathname: this.form.pathname,
            description: this.form.description
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
.page-category-add {
  &__form {
    width: 600px;
  }
}
</style>
