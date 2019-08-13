<template>
  <div class="page-system-email" v-loading="form.loading" v-loading.fullscreen="true" element-loading-text="正在加载...">
    <el-row :gutter="20">
      <el-col :span="18">
        <div>
          <h2>
            系统邮箱代理设置
            <el-switch
              class="page-system-email__switch"
              v-model="form.email_enabled"
              active-text="开启邮箱代理"
              @change="clearForm"
            ></el-switch>
          </h2>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            size="small"
            label-position="right"
            label-width="120px"
            v-loading="form.saving"
            element-loading-text="正在保存..."
            class="page-system-email__form"
          >
            <el-form-item label="邮件服务器" prop="email_host">
              <el-input
                :disabled="!form.email_enabled"
                v-model="form.email_host"
                placeholder="host地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务器端口" prop="email_port">
              <el-input :disabled="!form.email_enabled" v-model="form.email_port" placeholder="端口号">
                <template slot="append">
                  <el-switch
                    :disabled="!form.email_enabled"
                    v-model="form.email_secure"
                    active-text="安全端口"
                  ></el-switch>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="发件人邮箱" prop="email_user">
              <el-input
                :disabled="!form.email_enabled"
                v-model="form.email_user"
                placeholder="邮箱地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮件显示名" prop="email_show_name">
              <el-input
                :disabled="!form.email_enabled"
                v-model="form.email_show_name"
                placeholder="邮件显示名"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱授权码" prop="email_password">
              <el-input
                :disabled="!form.email_enabled"
                type="password"
                v-model="form.email_password"
                placeholder="输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round @click="save">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="page-system-email__template">
          <h2>系统邮件模板</h2>
          <div>
            <el-card
              v-for="item in templateList"
              :key="item.id"
              shadow="hover"
              class="page-system-email__template-item"
              @click.native="jump(item.id)"
            >{{item.title}}</el-card>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "system-email",
  data() {
    return {
      templateList: [],
      originData: [],
      form: {
        loading: false,
        saving: false,
        email_host: "",
        email_port: "",
        email_secure: true,
        email_user: "",
        email_show_name: "",
        email_password: "",
        email_enabled: false
      },
      rules: {
        email_host: [
          { required: true, message: "请输入host地址", trigger: "blur" }
        ],
        email_port: [
          { required: true, message: "请输入端口号", trigger: "blur" }
        ],
        email_user: [
          { required: true, message: "请输入发件邮箱地址", trigger: "blur" }
        ],
        email_show_name: [
          { required: true, message: "请输入邮件显示名", trigger: "blur" }
        ],
        email_password: [
          { required: true, message: "请输入发件邮箱密码", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.form.loading = true;
    this.getTemplateList();
    const { status, data } = await services.system.getEmail();
    if (status === 1) {
      this.originData = [...data];
      for (let item of data) {
        this.form[item.key] = item.value;
      }
      this.form.email_enabled = !!Number(this.form.email_enabled);
      this.form.email_secure = !!Number(this.form.email_secure);
    }
    this.form.loading = false;
  },
  methods: {
    async save() {
      if (this.form.email_enabled) {
        this.$refs["form"].validate(async valid => {
          if (valid) {
            this.form.saving = true;
            for (let item of this.originData) {
              item.value = this.form[item.key];
            }
            const { status } = await services.system.saveEmail({
              options: this.originData
            });
            if (status === 1) {
              this.$message.success("保存成功！");
            }
            this.form.saving = false;
          }
        });
      } else {
        this.form.saving = true;
        for (let item of this.originData) {
          item.value = this.form[item.key];
        }
        const { status } = await services.system.saveEmail({
          options: this.originData
        });
        if (status === 1) {
          this.$message.success("保存成功！");
        }
        this.form.saving = false;
      }
    },
    async getTemplateList() {
      const { status, data } = await services.system.getEmailTemplateList();
      if (status === 1) {
        this.templateList = data;
      }
    },
    clearForm(flag) {
      if (!flag) {
        this.$refs["form"].clearValidate();
      }
    },
    jump(id) {
      this.$router.push("/system/email/template/" + id);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-system-email {
  &__form {
    width: 100%;
  }
  &__switch {
    margin-left: 10px;
    font-size: 13px;
  }
  &__template {
    &-item {
      cursor: pointer;
      background-color: #e6a23c;
      color: white;
    }
  }
}
</style>
