<template>
  <div class="page-category-detail">
    <h2>分类详情</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在保存分类..."
      class="page-category-detail__form"
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
        <el-button type="primary" round @click="save">保存</el-button>
        <el-button type="danger" round @click="remove">删除</el-button>
        <el-button round @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "category-detail",
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
  created() {
    this.getDetail();
  },
  methods: {
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.category.save({
            id: this.$route.params.id,
            name: this.form.name,
            pathname: this.form.pathname,
            description: this.form.description
          });
          if (status === 1) {
            this.$message.success("保存成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
    },
    async remove() {
      try {
        await this.$confirm("是否删除该分类?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.category.remove({
          id: this.$route.params.id
        });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.$router.go(-1);
        }
      } catch (e) {
        throw e;
      }
    },
    async getDetail() {
      const { status, data } = await services.category.getDetail({
        id: this.$route.params.id
      });
      if (status === 1) {
        this.form.name = data.name;
        this.form.pathname = data.pathname;
        this.form.description = data.description;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-category-detail {
  &__form {
    width: 600px;
  }
}
</style>
