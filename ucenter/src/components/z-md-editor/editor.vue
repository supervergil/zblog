<template>
  <div :class="{'component-z-md-editor':true,'fullscreen':fullScreen}">
    <div class="component-z-md-editor__tool">
      <div class="component-z-md-editor__tool-left">
        <span class="tool-item" @click="insert('link')">
          <i class="fa-fw fas fa-link"></i>
        </span>
        <span class="tool-item" @click="showResourceDialog">
          <i class="fa-fw fas fa-image"></i>
        </span>
      </div>
      <div class="component-z-md-editor__tool-right">
        <span class="tool-item" key="toggle1" @click="toggleScreen" v-if="!fullScreen">
          <i class="fa-fw fas fa-expand"></i>
        </span>
        <span class="tool-item" key="toggle2" @click="toggleScreen" v-if="fullScreen">
          <i class="fa-fw fas fa-compress"></i>
        </span>
        <span :class="{'tool-item':true,'active':align==='left'}" @click="toggleAlign('left')">
          <i class="fa-fw fas fa-chevron-right"></i>
        </span>
        <span :class="{'tool-item':true,'active':align==='center'}" @click="toggleAlign('center')">
          <i class="fa-fw fas fa-columns"></i>
        </span>
        <span :class="{'tool-item':true,'active':align==='right'}" @click="toggleAlign('right')">
          <i class="fa-fw fas fa-chevron-left"></i>
        </span>
      </div>
    </div>
    <div :class="['component-z-md-editor__container',align]">
      <div class="component-z-md-editor__container-left">
        <el-input
          ref="markdown"
          type="textarea"
          :rows="20"
          v-model="markdown"
          class="component-z-md-editor__markdown"
          @input="emitMarkDown"
        ></el-input>
      </div>
      <article class="component-z-md-editor__container-right post" v-html="richtext"></article>
    </div>

    <el-dialog
      title="插入资源"
      :fullscreen="true"
      :append-to-body="true"
      :visible.sync="resourceDialogVisible"
      :center="true"
    >
      <z-upload-picker
        ref="picker"
        :type="['image','video','audio','attachment']"
        :show-upload="true"
      ></z-upload-picker>
      <div slot="footer">
        <el-button @click="hideResourceDialog">取 消</el-button>
        <el-button type="primary" @click="insertResource">插 入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import marked from "marked";
import insertTextAtCursor from "insert-text-at-cursor";

export default {
  name: "z-md-editor",
  model: {
    prop: "markdown"
  },
  props: ["markdown"],
  data() {
    return {
      resourceDialogVisible: false,
      fullScreen: false,
      align: "center"
      //
    };
  },
  computed: {
    richtext() {
      return marked(this.markdown, {
        headerIds: false
      });
    }
  },
  async created() {},
  methods: {
    hideResourceDialog() {
      this.resourceDialogVisible = false;
    },
    showResourceDialog() {
      this.resourceDialogVisible = true;
    },
    insert(type) {
      let insertion = ``;
      switch (type) {
        case "link":
          insertion = `<a target="_blank" href="url" title="超链接">超链接</a>`;
          break;
      }
      insertTextAtCursor(
        this.$refs["markdown"].$el.querySelector("textarea"),
        insertion
      );
    },
    insertResource() {
      const resource = this.$refs["picker"].$getSelect()[0];
      this.resourceDialogVisible = false;
      this.$refs["picker"].$clearSelect();
      let insertion = ``;
      if (resource.extension.startsWith("image")) {
        insertion = `<img src="${resource.url}" title="${resource.name}" alt="${
          resource.name
        }"  style="width: 320px;" />`;
      } else if (resource.extension.startsWith("video")) {
        insertion = `<video src="${
          resource.url
        }" controls width="100%"></video>`;
      } else if (resource.extension.startsWith("audio")) {
        insertion = `<audio src="${
          resource.url
        }" controls width="100%"></audio>`;
      }
      insertTextAtCursor(
        this.$refs["markdown"].$el.querySelector("textarea"),
        insertion
      );
    },
    toggleScreen() {
      this.fullScreen = !this.fullScreen;
    },
    toggleAlign(align) {
      this.align = align;
    },
    emitMarkDown() {
      this.$emit("input", this.markdown);
    },
    $getRichtext() {
      return this.richtext;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-z-md-editor {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  transition: all ease 0.2s;
  &.fullscreen {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    border-radius: 0;
    & .component-z-md-editor__container {
      height: 100%;
    }
  }
  &__tool {
    position: relative;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #ccc;
    color: #666;
    &-left {
      float: left;
      height: 30px;
      line-height: 30px;
    }
    &-right {
      float: right;
      margin-right: 0;
      height: 30px;
      line-height: 30px;
    }
    & .tool-item {
      float: left;
      margin-left: 10px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        color: black;
      }
      &.active {
        color: #ccc !important;
      }
    }
  }
  &__container {
    position: relative;
    margin: auto;
    width: 100%;
    overflow: hidden;
    &-left {
      position: relative;
      float: left;
      margin: auto;
      width: 50%;
      height: 100%;
      border-right: 1px solid #ccc;
      transition: all ease 0.2s;
      text-align: left;
    }
    &-right {
      position: absolute;
      padding: 8px;
      margin: auto;
      right: 0;
      top: 0;
      width: 50%;
      height: 100%;
      transition: all ease 0.2s;
      background-color: #eee;
      overflow: hidden;
      overflow-y: auto;
      text-align: left;
    }
    &.left {
      & .component-z-md-editor__container-left {
        width: 100%;
        border-right: none;
      }
      & .component-z-md-editor__container-right {
        width: 0;
        padding: 0;
      }
    }
    &.right {
      & .component-z-md-editor__container-left {
        width: 0;
        border-right: none;
      }
      & .component-z-md-editor__container-right {
        width: 100%;
      }
    }
  }
  &__markdown {
    & /deep/ {
      & .el-textarea__inner {
        border: none;
        border-radius: 0;
      }
    }
  }
  &__dialog-container {
    height: 200px;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
