<template>
  <div class="page-layout-banner-detail">
    <h2>编辑轮播图</h2>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="right"
      label-width="100px"
      v-loading="form.loading"
      element-loading-text="正在保存..."
      class="page-layout-banner-detail__form"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <div
          class="page-layout-banner-detail__picker"
          @click="showCoverDialog"
          v-if="form.cover===''"
        >
          <div class="text">文章封面 (推荐长宽比 4:1)</div>
        </div>
        <div class="page-layout-banner-detail__cover" @click="showCoverDialog" v-else>
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.cover" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入链接"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-checkbox v-model="form.status">上架该轮播图</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="save">保存</el-button>
        <el-button round @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="插入图片"
      :fullscreen="true"
      :append-to-body="true"
      :visible.sync="coverDialogVisible"
      :center="true"
    >
      <z-upload-picker ref="picker" :type="['image']" :show-upload="true"></z-upload-picker>
      <div slot="footer">
        <el-button @click="hideCoverDialog">取 消</el-button>
        <el-button type="primary" @click="insertCover">插 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "layout-banner-detail",
  data() {
    return {
      coverDialogVisible: false,
      form: {
        loading: false,
        title: "",
        cover: "",
        url: "",
        status: false
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图标题", trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请选择轮播图封面", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入轮播图链接", trigger: "blur" }]
      }
    };
  },
  async created() {
    this.getDetail();
  },
  methods: {
    save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.layout.saveBanner({
            id: this.$route.params.id,
            title: this.form.title,
            cover: this.form.cover,
            url: this.form.url,
            status: this.form.status ? 1 : 0
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
      const { status, data } = await services.layout.getBannerDetail({
        id: this.$route.params.id
      });
      if (status === 1) {
        this.form.title = data.title;
        this.form.cover = data.cover;
        this.form.url = data.url;
        this.form.status = data.status == 1;
      }
    },
    showCoverDialog() {
      this.coverDialogVisible = true;
    },
    hideCoverDialog() {
      this.coverDialogVisible = false;
    },
    insertCover() {
      this.form.cover = this.$refs["picker"].$getSelect()[0].url;
      this.$refs["picker"].$clearSelect();
      this.hideCoverDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-banner-detail {
  &__form {
    width: 600px;
  }
  &__picker {
    width: 500px;
    height: 125px;
    line-height: 125px;
    border: 1px dashed #ccc;
    user-select: none;
    text-align: center;
    cursor: pointer;
    & .text {
      font-size: 11px;
      color: #aaa;
    }
  }
  &__cover {
    position: relative;
    width: 500px;
    height: 125px;
    border: 1px solid #ccc;
    user-select: none;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
