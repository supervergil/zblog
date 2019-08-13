<template>
  <div class="page-post-detail">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      v-loading="form.loading"
      element-loading-text="正在保存文章..."
      align="center"
      class="page-post-detail__form"
      label-position="top"
    >
      <el-form-item prop="title">
        <el-input v-model="form.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item prop="pathname">
        <el-input v-model="form.pathname" :disabled="true" placeholder="文章路径">
          <template slot="prepend">{{baseUrl}}/post/</template>
          <template slot="append">
            <span>.html</span>
            <a
              :href="baseUrl+'/post/'+form.pathname+'.html'"
              target="_blank"
              class="page-post-detail__link"
            >
              <i class="fa-fw fas fa-eye"></i>
            </a>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="markdown">
        <z-md-editor v-model="form.markdown"></z-md-editor>
      </el-form-item>
      <el-form-item prop="summary">
        <el-input v-model="form.summary" :rows="5" type="textarea" placeholder="文章摘要"></el-input>
      </el-form-item>
      <el-form-item prop="tags">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择文章标签"
          style="width: 100%"
        >
          <el-option
            v-for="item in tagList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="cover">
        <div class="page-post-detail__picker" @click="showCoverDialog" v-if="form.cover===''">
          <div class="text">文章封面 (推荐 220*100)</div>
        </div>
        <div class="page-post-detail__cover" @click="showCoverDialog" v-else>
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.cover" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="category">
        <el-select style="width: 220px;" v-model="form.category" placeholder="文章分类">
          <el-option
            v-for="item in category"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div slot="error" slot-scope="scope" class="page-post-detail__custom-error">{{scope.error}}</div>
      </el-form-item>
      <el-form-item prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">原创</el-radio>
          <el-radio :label="2">网络转载</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="reproduceName" v-if="form.type===2">
        <el-input placeholder="转载名称" v-model="form.reproduceName" style="width: 220px"></el-input>
        <div slot="error" slot-scope="scope" class="page-post-detail__custom-error">{{scope.error}}</div>
      </el-form-item>
      <el-form-item prop="reproduceUrl" v-if="form.type===2">
        <el-input placeholder="转载链接" v-model="form.reproduceUrl" style="width: 220px"></el-input>
        <div slot="error" slot-scope="scope" class="page-post-detail__custom-error">{{scope.error}}</div>
      </el-form-item>
      <el-form-item prop="reproduceMarkdown" label="转载观点（markdown）" v-if="form.type===2">
        <z-md-editor v-model="form.reproduceMarkdown" style="margin: auto;width: 50%" align="left"></z-md-editor>
        <div slot="error" slot-scope="scope" class="page-post-detail__custom-error">{{scope.error}}</div>
      </el-form-item>
      <el-form-item prop="allowComment">
        <el-switch v-model="form.allowComment" active-text="评论开启" inactive-text="评论关闭"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save(form.status)">保存修改</el-button>
        <el-button type="warning" @click="save(form.status===0?1:0)">保存并{{form.status==0?'发布':'下架'}}</el-button>
        <el-button @click="$router.go(-1)">返回上级</el-button>
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
  name: "post-detail",
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI,
      coverDialogVisible: false,
      category: [],
      tagList: [],
      form: {
        loading: false,
        id: "",
        title: "",
        pathname: "",
        markdown: "",
        summary: "",
        cover: "",
        category: "",
        reproduceUrl: "",
        reproduceName: "",
        reproduceMarkdown: "",
        type: 0,
        tags: [],
        allowComment: true,
        status: 0
      },
      rules: {
        title: [{ required: true, message: "请输入文章名称", trigger: "blur" }],
        pathname: [
          { required: true, message: "请输入文章路径", trigger: "blur" }
        ],
        markdown: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入文章摘要", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择文章分类", trigger: "blur" }
        ],
        reproduceUrl: [
          { required: true, message: "请输入转载链接", trigger: "blur" }
        ],
        reproduceName: [
          { required: true, message: "请输入转载名称", trigger: "blur" }
        ],
        reproduceMarkdown: [
          { required: true, message: "请输入转载观点", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    await Promise.all([this.getCategory(), this.getTag()]);
    this.getPost();
  },
  methods: {
    save(published) {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.post.save({
            id: this.form.id,
            title: this.form.title,
            markdown: this.form.markdown,
            summary: this.form.summary,
            cover: this.form.cover,
            category: this.form.category,
            reproduceUrl: this.form.reproduceUrl,
            reproduceName: this.form.reproduceName,
            reproduceMarkdown: this.form.reproduceMarkdown,
            type: this.form.type,
            tags: this.form.tags,
            allowComment: this.form.allowComment,
            status: published
          });
          if (status === 1) {
            this.$message.success("修改成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
    },
    async getCategory() {
      const { status, data } = await services.category.getAll();
      if (status === 1) {
        this.category = data.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
      }
    },
    async getTag() {
      const { status, data } = await services.tag.getAll();
      if (status === 1) {
        this.tagList = data.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
      }
    },
    async getPost() {
      const { status, data } = await services.post.getDetail({
        id: this.$route.params.id
      });
      if (status === 1) {
        this.form.id = data.id;
        this.form.title = data.title;
        this.form.pathname = data.pathname;
        this.form.markdown = data.markdown;
        this.form.summary = data.summary;
        this.form.tags = data.tags;
        this.form.category = data.category;
        this.form.cover = data.cover_url;
        this.form.type = data.type;
        this.form.reproduceName = data.reproduce_name;
        this.form.reproduceUrl = data.reproduce_url;
        this.form.reproduceMarkdown = data.reproduce_markdown;
        this.form.allowComment = !!data.allow_comment;
        this.form.status = data.status;
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
.page-post-detail {
  padding: 20px 0;
  &__form {
    width: 100%;
  }
  &__link {
    display: inline-block;
    margin-top: 2px;
    margin-left: 10px;
    color: #909399;
    vertical-align: middle;
    transition: all ease 0.4s;
    &:hover {
      color: #409eff;
    }
  }
  &__picker {
    margin: auto;
    width: 220px;
    height: 150px;
    line-height: 150px;
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
    margin: auto;
    width: 220px;
    height: 150px;
    line-height: 150px;
    border: 1px solid #ccc;
    user-select: none;
    overflow: hidden;
    cursor: pointer;
  }
  &__custom-error {
    padding-top: 2px;
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 34px;
    text-align: center;
  }
}
</style>
