<template>
  <component :is="name" :index="item.router">
    <template v-if="name==='el-submenu'">
      <template slot="title">
        <i v-if="item.icon" :class="[item.icon]" style="font-size: 18px;"/> &nbsp;
        <span slot="title">{{ item.name }}</span>
      </template>
    </template>
    <template v-else>
      <i v-if="item.icon" :class="[item.icon]" style="font-size: 18px;"/> &nbsp;
      <span slot="title">{{ item.name }}</span>
    </template>
    <template v-if="item.children">
      <el-extend-menu-item v-for="sub in item.children" :item="sub" :key="sub.id"/>
    </template>
  </component>
</template>

<script>
export default {
  name: "ElExtendMenuItem",
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      name:
        this.item.children && this.item.children.length > 0
          ? "el-submenu"
          : "el-menu-item"
    };
  }
};
</script>

<style lang="scss" scoped>
.el-menu-item {
  min-width: inherit;
  user-select: none;
}
</style>
