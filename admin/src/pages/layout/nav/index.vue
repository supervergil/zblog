<template>
  <div
    class="page-layout-nav"
    v-loading="form.loading"
    v-loading.fullscreen="true"
    element-loading-text="正在加载..."
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="page-layout-nav__main">
          <h2>
            主菜单管理
            <el-button
              size="mini"
              type="success"
              @click="showAddDialog(0)"
              class="page-layout-nav__btn-add"
            >新增</el-button>
          </h2>
          <div class="page-layout-nav__tree">
            <el-tree
              :data="navList"
              node-key="id"
              default-expand-all
              draggable
              @node-drop="handleDrop"
              :allow-drop="dropFilter"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }" :key="data.icon">
                <a>
                  <i :class="data.icon"></i>
                  <span>{{ node.label }}</span>
                </a>
                <span>
                  <el-button type="text" size="mini" @click="showEditDialog(0,data.id)">编辑</el-button>
                  <el-button type="text" size="mini" @click="remove(data.id)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="page-layout-nav__sub">
          <h2>
            副菜单管理
            <el-button
              size="mini"
              type="success"
              @click="showAddDialog(1)"
              class="page-layout-nav__btn-add"
            >新增</el-button>
          </h2>
          <div class="page-layout-nav__tree">
            <el-tree
              :data="subNavList"
              node-key="id"
              default-expand-all
              draggable
              @node-drop="handleDrop"
              :allow-drop="dropFilter"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }" :key="data.icon">
                <a>
                  <i :class="data.icon"></i>
                  <span>{{ node.label }}</span>
                </a>
                <span>
                  <el-button type="text" size="mini" @click="showEditDialog(1,data.id)">编辑</el-button>
                  <el-button type="text" size="mini" @click="remove(data.id)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="'新增'+(form.type==0?'主':'副')+'菜单'"
      :visible.sync="addVisible"
      :append-to-body="true"
      @close="resetAddForm"
    >
      <el-form
        ref="add-form"
        :model="form"
        :rules="rules"
        size="mini"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="导航名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入导航名称"></el-input>
        </el-form-item>
        <el-form-item label="导航链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入导航链接"></el-input>
        </el-form-item>
        <el-form-item label="导航图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入font-awesome图标"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button size="mini" @click="hideAddDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="add">新 增</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'编辑'+(form.type==0?'主':'副')+'菜单'"
      :visible.sync="editVisible"
      :append-to-body="true"
      @close="resetEditForm"
    >
      <el-form
        ref="edit-form"
        :model="form"
        :rules="rules"
        size="mini"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="导航名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入导航名称"></el-input>
        </el-form-item>
        <el-form-item label="导航链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入导航链接"></el-input>
        </el-form-item>
        <el-form-item label="导航图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入font-awesome图标"></el-input>
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
  name: "layout-nav",
  data() {
    return {
      addVisible: false,
      editVisible: false,
      navList: [],
      subNavList: [],
      form: {
        id: "",
        name: "",
        icon: "",
        url: "",
        type: 0,
        loading: false
      },
      rules: {
        name: [{ required: true, message: "请输入导航名", trigger: "blur" }],
        url: [{ required: true, message: "请输入导航链接", trigger: "blur" }]
      }
    };
  },
  async created() {
    this.form.loading = true;
    await this.getList();
    this.form.loading = false;
  },
  methods: {
    resetAddForm() {
      this.$refs["add-form"].resetFields();
    },
    resetEditForm() {
      this.$refs["edit-form"].resetFields();
    },
    showAddDialog(type) {
      this.form.type = type;
      this.addVisible = true;
    },
    hideAddDialog() {
      this.addVisible = false;
    },
    async showEditDialog(type, id) {
      this.form.id = id;
      this.form.type = type;
      this.editVisible = true;
      const { status, data } = await services.nav.getDetail({
        id: this.form.id
      });
      if (status === 1) {
        this.form.name = data.name;
        this.form.url = data.url;
        this.form.icon = data.icon;
      }
    },
    hideEditDialog() {
      this.editVisible = false;
    },
    async add() {
      this.$refs["add-form"].validate(async valid => {
        if (valid) {
          const { status } = await services.nav.add({
            name: this.form.name,
            url: this.form.url,
            icon: this.form.icon,
            type: this.form.type
          });
          if (status === 1) {
            this.$message.success("添加成功！");
            this.getList();
            this.hideAddDialog();
          }
        }
      });
    },
    async save() {
      this.$refs["edit-form"].validate(async valid => {
        if (valid) {
          const { status } = await services.nav.save({
            id: this.form.id,
            name: this.form.name,
            url: this.form.url,
            icon: this.form.icon
          });
          if (status === 1) {
            this.$message.success("修改成功！");
            this.getList();
            this.hideEditDialog();
          }
        }
      });
    },
    async remove(id) {
      try {
        await this.$confirm("是否删除该导航?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.nav.remove({ id });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
      }
    },
    async getList() {
      const { status, data } = await services.nav.getList();
      if (status === 1) {
        this.navList = data
          .filter(item => item.type == 0)
          .map(item => {
            return {
              id: item.id,
              label: item.name,
              icon: item.icon,
              type: item.type
            };
          });
        this.subNavList = data
          .filter(item => item.type == 1)
          .map(item => {
            return {
              id: item.id,
              label: item.name,
              icon: item.icon,
              type: item.type
            };
          });
      }
    },
    dropFilter(draggingNode, dropNode, type) {
      return type !== "inner";
    },
    async handleDrop() {
      const { status } = await services.nav.move({
        navList: this.navList.map(item => item.id),
        subNavList: this.subNavList.map(item => item.id)
      });
      if (status === 1) {
        this.getList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-nav {
  h2 {
    padding: 0;
    margin: 5px;
  }
  &__main {
    padding: 12px;
    min-height: 500px;
  }
  &__sub {
    padding: 12px;
    min-height: 500px;
  }
  &__tree {
    min-height: 430px;
    padding: 3px;
    border: 1px solid #ccc;
  }
  &__btn-add {
    position: absolute;
    margin-top: 2px;
    margin-left: 8px;
  }
  & .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    & > a {
      font-size: 14px;
      & span {
        margin-left: 10px;
      }
    }
    & > span {
      float: right;
      margin-right: 10px;
    }
  }
}
</style>
