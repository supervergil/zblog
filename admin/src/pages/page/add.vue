<template>
  <div class="page-page-add">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      v-loading="form.loading"
      element-loading-text="正在保存页面..."
      align="center"
      label-position="top"
      class="page-page-add__form"
    >
      <el-form-item prop="title">
        <el-input v-model="form.title" placeholder="页面标题"></el-input>
      </el-form-item>
      <el-form-item prop="pathname">
        <el-input v-model="form.pathname" placeholder="页面路径">
          <template slot="prepend">{{baseUrl}}/page/</template>
          <template slot="append">
            <span>.html</span>
            <a
              :href="baseUrl+'/page/'+form.pathname+'.html'"
              target="_blank"
              class="page-page-add__link"
            >
              <i class="fa-fw fas fa-eye"></i>
            </a>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="keywords">
        <el-select
          v-model="form.keywords"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入页面关键词"
          style="width: 100%"
        ></el-select>
      </el-form-item>
      <el-form-item prop="description">
        <el-input v-model="form.description" :rows="2" type="textarea" placeholder="页面描述"></el-input>
      </el-form-item>
      <el-form-item prop="markdown">
        <z-md-editor v-model="form.markdown"></z-md-editor>
      </el-form-item>
      <el-form-item prop="style_list" style="padding: 12px;border: 1px dashed #ccc;">
        <el-input
          v-for="(item,index) in form.styleList"
          :key="index"
          v-model="item.value"
          :placeholder="'链接'+(index+1)"
          style="margin-bottom: 10px;"
        >
          <template slot="append">
            <div style="cursor: pointer;" @click="removeStyle(index)">
              <i class="fas fa-trash fa-fw"></i> 删除
            </div>
          </template>
        </el-input>
        <el-button type="text" @click="addStyle">+新增外联样式</el-button>
      </el-form-item>
      <el-form-item prop="style_custom">
        <el-input v-model="form.styleCustom" :rows="5" type="textarea" placeholder="自定义样式"></el-input>
      </el-form-item>
      <el-form-item prop="script_list" style="padding: 12px;border: 1px dashed #ccc;">
        <el-input
          v-for="(item,index) in form.scriptList"
          :key="index"
          v-model="item.value"
          :placeholder="'链接'+(index+1)"
          style="margin-bottom: 10px;"
        >
          <template slot="append">
            <div style="cursor: pointer;" @click="removeScript(index)">
              <i class="fas fa-trash fa-fw"></i> 删除
            </div>
          </template>
        </el-input>
        <el-button type="text" @click="addScript">+新增外联脚本</el-button>
      </el-form-item>
      <el-form-item prop="script_custom">
        <el-input v-model="form.scriptCustom" :rows="5" type="textarea" placeholder="自定义脚本"></el-input>
      </el-form-item>
      <el-form-item prop="cover">
        <div class="page-page-add__picker" @click="showCoverDialog" v-if="form.cover===''">
          <div class="text">页面封面 (推荐 220*100)</div>
        </div>
        <div class="page-page-add__cover" @click="showCoverDialog" v-else>
          <div
            style="position: absolute;margin: auto;left: 0;right:0;top:0;bottom: 0;overflow: hidden;"
          >
            <el-image style="width: 100%;height: 100%;" :src="form.cover" fit="cover"></el-image>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="layout">
        <el-select style="width: 220px;" v-model="form.layout" placeholder="请选择页面布局">
          <el-option
            v-for="item in layoutList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div slot="error" slot-scope="scope" class="page-page-detail__custom-error">{{scope.error}}</div>
      </el-form-item>
      <el-form-item prop="allowComment">
        <el-switch v-model="form.allowComment" active-text="评论开启" inactive-text="评论关闭"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add(0)">保存页面</el-button>
        <el-button type="warning" @click="add(1)">保存并发布</el-button>
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
  name: "page-add",
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI,
      coverDialogVisible: false,
      layoutList: [],
      form: {
        loading: false,
        title: "",
        pathname: "",
        markdown: "",
        description: "",
        keywords: [],
        styleList: [],
        styleCustom: "",
        scriptList: [],
        scriptCustom: "",
        cover: "",
        layout: "",
        allowComment: true
      },
      rules: {
        title: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
        pathname: [
          { required: true, message: "请输入页面路径", trigger: "blur" }
        ],
        keywords: [
          { required: true, message: "请输入页面关键词", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入页面描述", trigger: "blur" }
        ],
        markdown: [
          { required: true, message: "请输入页面内容", trigger: "blur" }
        ],
        layout: [{ required: true, message: "请选择页面布局", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getLayout();
  },
  methods: {
    add(published) {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.loading = true;
          const { status } = await services.page.add({
            title: this.form.title,
            pathname: this.form.pathname,
            description: this.form.description,
            keywords: this.form.keywords.join(","),
            markdown: this.form.markdown,
            styleList: this.form.styleList.map(item => item.value).join(","),
            styleCustom: this.form.styleCustom,
            scriptList: this.form.scriptList.map(item => item.value).join(","),
            scriptCustom: this.form.scriptCustom,
            layout: this.form.layout,
            cover: this.form.cover,
            allowComment: this.form.allowComment,
            status: published
          });
          if (status === 1) {
            this.$message.success("添加成功！");
            this.$router.go(-1);
          }
          this.form.loading = false;
        }
      });
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
    },
    addStyle() {
      this.form.styleList.push({ value: "" });
    },
    removeStyle(i) {
      this.form.styleList.splice(i, 1);
    },
    addScript() {
      this.form.scriptList.push({ value: "" });
    },
    removeScript(i) {
      this.form.scriptList.splice(i, 1);
    },
    async getLayout() {
      const { status, data } = await services.page.getLayout();
      if (status === 1) {
        this.layoutList = data.map(item => {
          return {
            label: item,
            value: item
          };
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-page-add {
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
