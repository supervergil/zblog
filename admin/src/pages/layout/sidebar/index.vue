<template>
  <div class="page-layout-sidebar">
    <el-row :gutter="20" style="height: 100%;">
      <el-col :span="16">
        <div class="page-layout-sidebar__tools">
          <h2>
            小工具
            <router-link to="/layout/sidebar/tool" class="page-layout-sidebar__btn-manage">
              <el-button type="success" size="mini">管理小工具</el-button>
            </router-link>
          </h2>
          <el-row :gutter="12">
            <el-col :span="6" v-for="item in toolList" :key="item.mark">
              <el-card
                shadow="hover"
                class="page-layout-sidebar__tool-item"
                draggable="true"
                @dragstart.native="dragstart(item.id)"
              >{{item.name}}</el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div :class="{'page-layout-sidebar__pages':true,'checked':overContainer}">
      <el-select
        v-model="currentPage"
        size="mini"
        placeholder="请选择页面"
        class="page-layout-sidebar__select"
        @change="getRelation"
      >
        <el-option v-for="item in ptypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
      </el-select>
      <div
        class="page-layout-sidebar__container"
        @dragover="dragover"
        @dragleave="dragout"
        @drop="drop"
        v-loading="loading"
        element-loading-text="获取中..."
      >
        <el-tree
          :data="sidebarList"
          node-key="id"
          default-expand-all
          draggable
          @node-drop="handleDrop"
          :allow-drop="dropFilter"
          :indent="0"
          class="page-layout-sidebar__tree"
        >
          <el-card
            class="page-layout-sidebar__card-item"
            shadow="hover"
            slot-scope="{ node, data }"
            :key="data.id"
          >
            <div slot="header" class="page-layout-sidebar__card-item-header">
              <span v-if="data.title">标题：{{data.title}}</span>
              <span v-else style="color: #999">未设置标题</span>
              <el-button
                style="float: right; padding: 3px 0;color: #F56C6C;"
                type="text"
                @click="remove(data.id)"
              >删除</el-button>
              <el-button
                style="float: right; padding: 3px 0;margin-right: 5px;"
                type="text"
                @click="showEditDialog(data.id)"
              >编辑</el-button>
            </div>
            <div>
              <span>{{data.widget_name}}</span>
            </div>
            <div>
              <el-tag
                v-if="data.self_custom_style"
                type="success"
                style="margin-right: 5px;margin-top: 5px;"
              >自定义样式</el-tag>
              <el-tag v-if="data.self_custom_script" type="danger" style="margin-top: 5px;">自定义脚本</el-tag>
            </div>
          </el-card>
        </el-tree>

        <div v-if="sidebarList.length===0" style="text-align:center;color: #CCC;">拖拽添加小工具</div>
      </div>
    </div>

    <el-dialog
      title="编辑小工具"
      :visible.sync="editVisible"
      :append-to-body="true"
      @close="resetEditForm"
    >
      <el-form ref="form" :model="form" size="mini" label-position="right" label-width="100px">
        <el-form-item label="侧栏标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入侧栏标题"></el-input>
        </el-form-item>
        <el-form-item label="自定义样式" prop="custom_style">
          <el-input v-model="form.custom_style" type="textarea" :rows="5" placeholder="请输入自定义样式"></el-input>
        </el-form-item>
        <el-form-item label="自定义脚本" prop="custom_script">
          <el-input v-model="form.custom_script" type="textarea" :rows="5" placeholder="请输入自定义脚本"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button size="mini" @click="hideEditDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "layout-sidebar",
  data() {
    return {
      overContainer: false,
      editVisible: false,
      currentPage: "",
      currentSidebar: "",
      ptypeList: [],
      toolList: [],
      sidebarList: [],
      loading: false,
      form: {
        id: "",
        title: "",
        custom_style: "",
        custom_script: ""
      }
    };
  },
  async created() {
    await Promise.all([this.getToolList(), this.getPtypeList()]);
    this.getRelation();
  },
  methods: {
    resetEditForm() {
      this.$refs["form"].resetFields();
    },
    async showEditDialog(id) {
      this.form.id = id;
      this.editVisible = true;
      const { status, data } = await services.sidebar.getRelationDetail({
        id: this.form.id
      });
      if (status === 1) {
        this.form.title = data.title;
        this.form.custom_style = data.custom_style;
        this.form.custom_script = data.custom_script;
      }
    },
    hideEditDialog() {
      this.editVisible = false;
    },
    async save() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const { status } = await services.sidebar.saveRelation({
            id: this.form.id,
            title: this.form.title,
            custom_style: this.form.custom_style,
            custom_script: this.form.custom_script
          });
          if (status === 1) {
            this.$message.success("修改成功！");
            this.getRelation();
            this.hideEditDialog();
          }
        }
      });
    },
    async add(sidebar_id) {
      const { status } = await services.sidebar.addRelation({
        ptype_id: this.currentPage,
        sidebar_id
      });
      if (status === 1) {
        this.$message.success("添加成功！");
        this.getRelation();
      }
    },
    async remove(id) {
      try {
        await this.$confirm("是否删除该小工具?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.sidebar.removeRelation({ id });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.getRelation();
        }
      } catch (e) {
        throw e;
      }
    },
    async getToolList() {
      const { status, data } = await services.sidebar.getToolList();
      if (status === 1) {
        this.toolList = data;
      }
    },
    async getPtypeList() {
      const { status, data } = await services.sidebar.getPtypeList();
      if (status === 1) {
        this.ptypeList = data;
        this.currentPage = data[0].id;
      }
    },
    async getRelation() {
      this.loading = true;
      const { status, data } = await services.sidebar.getToolByPID({
        id: this.currentPage
      });
      if (status === 1) {
        this.sidebarList = data;
      }
      this.loading = false;
    },
    dragover(e) {
      e.preventDefault();
      if (this.currentSidebar) {
        this.overContainer = true;
      }
    },
    dragout(e) {
      e.preventDefault();
      this.overContainer = false;
    },
    async drop() {
      if (this.currentSidebar) {
        this.overContainer = false;
        await this.add(this.currentSidebar);
        this.currentSidebar = null;
      }
    },
    dragstart(id) {
      this.currentSidebar = id;
    },
    dropFilter(draggingNode, dropNode, type) {
      return type !== "inner";
    },
    async handleDrop() {
      const { status } = await services.sidebar.moveRelation({
        sidebarList: this.sidebarList.map(item => item.id)
      });
      if (status === 1) {
        this.getRelation();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-sidebar {
  &__tool-item {
    margin-bottom: 12px;
    cursor: move;
    text-align: center;
    user-select: none;
  }
  &__btn-manage {
    position: absolute;
    margin-left: 16px;
    margin-top: -3px;
  }
  &__pages {
    position: absolute;
    padding: 8px;
    top: 20px;
    bottom: 20px;
    left: 67%;
    right: 20px;
    border: 1px dashed #999;
    &.checked {
      background-color: #eee;
    }
  }
  &__select {
    width: 100%;
  }
  &__container {
    position: absolute;
    padding: 8px;
    top: 38px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  &__tree {
    background-color: transparent;
    & /deep/ {
      & .el-tree-node__content {
        height: 95px;
        background-color: transparent;
        &:hover {
          background-color: transparent;
        }
      }
      & .is-leaf {
        display: none;
      }
    }
  }
  &__card-item {
    width: 100%;
    user-select: none;
    cursor: move;
    & /deep/ {
      & .el-card__header {
        padding: 9px 10px;
      }
      & .el-card__body {
        padding: 12px 14px;
      }
    }
    margin-top: 12px;
    &-header {
      font-weight: bolder;
    }
  }
}
</style>
