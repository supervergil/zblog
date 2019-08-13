<template>
  <div class="page-upload">
    <h2>
      上传管理
      <span class="page-upload__btn-add">
        <el-button type="success" size="mini" @click="showUploadDialog">上传</el-button>
      </span>
      <span class="page-upload__select">
        <el-select v-model="file_type" size="mini" placeholder="文件所属" @change="changeType">
          <el-option label="全部文件" :value="-1"></el-option>
          <el-option label="本地文件" :value="0"></el-option>
          <el-option label="七牛云文件" :value="1"></el-option>
        </el-select>
      </span>
    </h2>
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <el-link type="primary" target="_blank" :href="scope.row.url">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文件所属" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.type===0">本地文件</div>
          <div v-if="scope.row.type===1">七牛云文件</div>
        </template>
      </el-table-column>
      <el-table-column label="预览" width="180" align="center">
        <template slot-scope="scope">
          <el-image
            class="page-upload__preview"
            v-if="scope.row.extension.startsWith('image')"
            :src="scope.row.url"
          ></el-image>
          <video
            v-else-if="scope.row.extension.startsWith('video')"
            :src="scope.row.url"
            class="page-upload__preview"
          ></video>
          <div v-else>暂无</div>
        </template>
      </el-table-column>
      <el-table-column prop="created_date" label="创建日期" width="220"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-upload__pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size.sync="page.size"
        @current-change="changePage"
      ></el-pagination>
    </div>

    <!-- 对话框 -->

    <el-dialog
      title="上传文件"
      :append-to-body="true"
      :visible.sync="uploadDialogVisible"
      :center="true"
    >
      <el-tabs v-model="uploadMode" type="card">
        <el-tab-pane label="本地上传" name="local">
          <el-upload
            ref="uploader"
            action="/api/upload"
            multiple
            :limit="9"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadFiles"
          >
            <el-button size="small" type="success">选择上传文件</el-button>
            <div slot="tip" class="el-upload__tip">最多选择9个文件</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="七牛云上传" name="qiniu" :disabled="!qiniu_options['qiniu_enabled']">
          <el-upload
            ref="qiniuUploader"
            action="/api/upload/send2Qiniu"
            multiple
            :limit="9"
            :on-exceed="handleQiniuExceed"
            :on-change="handleQiniuChange"
            :on-success="handleQiniuSuccess"
            :file-list="qiniuFileList"
            :auto-upload="false"
            :http-request="uploadFiles2Qiniu"
          >
            <el-button size="small" type="warning">选择上传文件</el-button>
            <div slot="tip" class="el-upload__tip">最多选择9个文件</div>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="hideUploadDialog">取 消</el-button>
        <el-button type="primary" @click="upload" :loading="uploading">上 传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "upload",
  data() {
    return {
      qiniu_options: {},
      uploadDialogVisible: false,
      loading: false,
      uploadMode: "local",
      uploading: false,
      fileList: [],
      qiniuFileList: [],
      file_type: -1,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      tData: []
    };
  },
  async created() {
    this.getUpload();
    this.getList();
  },
  methods: {
    showUploadDialog() {
      this.uploadDialogVisible = true;
    },
    hideUploadDialog() {
      this.uploadDialogVisible = false;
    },
    handleExceed() {
      this.$message.warning(`最多选择9个文件！`);
    },
    handleQiniuExceed() {
      this.$message.warning(`最多选择9个文件！`);
    },
    handleChange(files, fileList) {
      this.fileList = fileList;
    },
    handleQiniuChange(files, fileList) {
      this.qiniuFileList = fileList;
    },
    handleSuccess(res, file, fileList) {
      if (fileList.every(item => item.status === "success")) {
        this.$message.success("上传成功！");
        this.uploading = false;
        this.$refs["uploader"].clearFiles();
        this.uploadDialogVisible = false;
        this.getList();
      }
    },
    handleQiniuSuccess(res, file, fileList) {
      if (fileList.every(item => item.status === "success")) {
        this.$message.success("上传成功！");
        this.uploading = false;
        this.$refs["qiniuUploader"].clearFiles();
        this.uploadDialogVisible = false;
        this.getList();
      }
    },
    async uploadFiles(param) {
      const form = new FormData();
      form.append("file", param.file);
      const { status } = await services.common.upload({
        contentType: "multipart/form-data",
        data: form,
        warning: true
      });
      if (status === 1) {
        param.onSuccess();
      } else {
        this.uploading = false;
      }
    },
    async uploadFiles2Qiniu(param) {
      const form = new FormData();
      form.append("file", param.file);
      const { status } = await services.common.uploadToQiniu({
        contentType: "multipart/form-data",
        data: form,
        warning: true
      });
      if (status === 1) {
        param.onSuccess();
      } else {
        this.uploading = false;
      }
    },
    async upload() {
      this.uploading = true;
      if (this.uploadMode === "local") {
        if (this.fileList.length === 0) {
          return this.$message.warning("请选择上传文件！");
        }
        this.$refs["uploader"].submit();
      } else {
        if (this.qiniuFileList.length === 0) {
          return this.$message.warning("请选择上传文件！");
        }
        this.$refs["qiniuUploader"].submit();
      }
    },
    async remove(id) {
      try {
        await this.$confirm("是否删除该文件?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.upload.remove({ id });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
      }
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
    },
    async getList() {
      this.loading = true;
      const { status, data } = await services.upload.getList({
        page: this.page.current,
        type: this.file_type
      });
      if (status === 1) {
        if (data.totalPages < data.currentPage && data.totalPages > 0) {
          this.page.current = data.totalPages;
          return this.getList();
        }
        this.page.current = data.currentPage;
        this.page.total = data.count;
        this.tData = [...data.data];
      }
      this.loading = false;
    },
    changePage(page) {
      this.page.current = page;
      this.getList();
    },
    changeType() {
      this.page.current = 1;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-upload {
  &__preview {
    margin: auto;
    display: block;
    width: 80px;
  }
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 16px;
      margin-top: -3px;
    }
  }
  &__select {
    position: absolute;
    margin-left: 95px;
    margin-top: -3px;
  }
  &__pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
