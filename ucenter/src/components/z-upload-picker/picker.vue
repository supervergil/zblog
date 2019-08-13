<template>
  <div class="component-z-upload-picker">
    <el-form :inline="true" class="demo-form-inline" v-if="showUpload">
      <el-form-item>
        <el-upload
          class="component-z-upload-picker__uploader"
          ref="uploader"
          action="/api/upload"
          multiple
          :limit="9"
          :show-file-list="false"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :http-request="uploadFiles"
        >
          <el-button size="small" type="primary" :loading="uploading">{{uploading?'文件上传中':'选择上传文件'}}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-left: 20px;">
        <el-radio-group v-model="uploadType" class="component-z-upload-picker__uploader-type">
          <el-radio :label="0">本地存储</el-radio>
          <el-radio :label="1" :disabled="!qiniu_options.qiniu_enabled">七牛云存储</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-tabs type="card" v-model="active">
      <el-tab-pane v-for="item in type" :key="item" :label="tabKey[item].name" :name="item">
        <div
          class="component-z-upload-picker__container"
          v-loading="tabKey[item].loading"
          element-loading-text="数据加载中..."
        >
          <div
            v-for="preview in tabKey[item].data"
            :key="preview.id"
            class="component-z-upload-picker__box"
            @click="selectResource(preview)"
          >
            <div class="component-z-upload-picker__preview">
              <el-image
                v-if="item==='image'"
                style="width: 100%;height: 100%;"
                :src="preview.url"
                fit="cover"
              ></el-image>
              <video
                v-else-if="item==='video'"
                style="width: 100%;height: 100%;background-color: #EEE;"
                :src="preview.url"
              ></video>
              <audio
                v-else-if="item==='audio'"
                style="width: 100%;height: 100%;background-color: #EEE;"
                :src="preview.url"
                controls
              ></audio>
              <div
                v-else-if="item==='attachment'"
                style="width: 100%;height: 100%;background-color: #EEE;color: #999;font-size: 13px;text-align: center;padding: 8px;padding-top: 80px;word-break: break-all;"
              >暂无预览</div>
              <div class="component-z-upload-picker__preview-name">{{preview.name}}</div>
              <el-tag
                type="success"
                size="mini"
                color="#409EFF"
                style="position: absolute;top: 5px;left: 8px;color: white;"
                v-if="preview.type===0"
              >本地文件</el-tag>
              <el-tag
                type="success"
                size="mini"
                color="#E6A23C"
                style="position: absolute;top: 5px;left: 8px;color: white;"
                v-else-if="preview.type===1"
              >七牛云文件</el-tag>
              <div class="component-z-upload-picker__check" v-if="selectPool.includes(preview)">
                <el-checkbox :value="true"></el-checkbox>
              </div>
            </div>
          </div>
          <div class="component-z-upload-picker__pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="tabKey[item].page.total"
              :page-size.sync="tabKey[item].page.size"
              @current-change="tabKey[item].changePage"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "z-upload-picker",
  props: ["type", "multiple", "showUpload"],
  data() {
    return {
      qiniu_options: {},
      selectPool: [],
      uploading: false,
      uploadType: 0,
      active: this.type[0],
      tabKey: {
        image: {
          name: "图片",
          page: { current: 1, size: 24, total: 0 },
          data: null,
          loading: false
        },
        video: {
          name: "视频",
          page: { current: 1, size: 24, total: 0 },
          data: null,
          loading: false
        },
        audio: {
          name: "音频",
          page: { current: 1, size: 24, total: 0 },
          data: null,
          loading: false
        },
        attachment: {
          name: "其他附件",
          page: { current: 1, size: 24, total: 0 },
          data: null,
          loading: false
        }
      }
    };
  },
  async created() {
    if (this.showUpload) {
      this.getUpload();
    }
    this.getAllList();
    this.setPage();
  },
  methods: {
    handleExceed() {
      this.$message.warning(`最多选择9个文件！`);
    },
    handleSuccess(res, file, fileList) {
      if (fileList.every(item => item.status === "success")) {
        this.$message.success("上传成功！");
        this.getAllList();
      }
    },
    async uploadFiles(param) {
      const form = new FormData();
      form.append("file", param.file);
      this.uploading = true;
      if (this.uploadType === 0) {
        const { status } = await services.common.upload({
          contentType: "multipart/form-data",
          data: form,
          warning: true
        });
        if (status === 1) {
          param.onSuccess();
        }
      } else if (this.uploadType === 1) {
        const { status } = await services.common.uploadToQiniu({
          contentType: "multipart/form-data",
          data: form,
          warning: true
        });
        if (status === 1) {
          param.onSuccess();
        }
      }
      this.uploading = false;
    },
    async getSpec(item) {
      this.tabKey[item].loading = true;
      const { status, data } = await services.upload.getPreviewList({
        page: this.tabKey[item].page.current,
        contentType: item
      });
      if (status === 1) {
        this.tabKey[item].page.current = data.currentPage;
        this.tabKey[item].page.total = data.count;
        this.tabKey[item].data = data.data;
      }
      this.tabKey[item].loading = false;
    },
    async getAllList() {
      this.type.forEach(async item => {
        this.getSpec(item);
      });
    },
    setPage() {
      this.type.forEach(async item => {
        this.tabKey[item].changePage = page => {
          this.tabKey[item].page.current = page;
          this.getSpec(item);
        };
      });
    },
    selectResource(item) {
      if (this.multiple) {
        if (!this.selectPool.includes(item)) {
          this.selectPool.push(item);
        } else {
          this.selectPool = this.selectPool.filter(p => p !== item);
        }
      } else {
        if (this.selectPool.length > 0) {
          if (this.selectPool[0] === item) {
            this.selectPool = [];
          } else {
            this.selectPool = [item];
          }
        } else {
          this.selectPool.push(item);
        }
      }
      this.$emit("on-select", [
        ...this.selectPool.map(item => {
          return {
            ...item
          };
        })
      ]);
    },
    $clearSelect() {
      this.selectPool = [];
    },
    $getSelect() {
      return [
        ...this.selectPool.map(item => {
          return {
            ...item
          };
        })
      ];
    },
    async getUpload() {
      const { status, data } = await services.system.getUpload();
      if (status === 1) {
        for (let item of data) {
          if (item.key === "qiniu_enabled") {
            this.qiniu_options[item.key] = !!Number(item.value);
          } else {
            this.qiniu_options[item.key] = item.value;
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.component-z-upload-picker {
  &__container {
    width: 100%;
  }
  &__box {
    margin-right: 20px;
    margin-bottom: 20px;
    width: 150px;
    height: 220px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    transition: all ease 0.2s;
    vertical-align: middle;
    overflow: hidden;
  }
  &__preview {
    position: relative;
    width: 150px;
    height: 180px;
    border: 1px solid #ccc;
    &:hover {
      border-color: #409eff;
    }
    &-name {
      margin-top: 6px;
      text-align: center;
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &__pagination {
    margin-top: 2px;
    text-align: center;
  }
  &__check {
    position: absolute;
    top: 5px;
    right: 10px;
  }
}
</style>
