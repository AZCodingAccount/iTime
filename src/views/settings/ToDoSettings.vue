<script setup>
import { ref } from "vue";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
const form = ref({
  olIcon: "1.",
  ulIcon: "●",
}); // 下拉框的表单对象
const selfForm = ref({
  olIcon: "1.",
  ulIcon: "●",
}); // 输入框的表单对象
const customSettingsStore = useCustomSettingsStore();
const todoIcons = customSettingsStore.customSettings["todo-icons"];
onMounted(() => {
  // 双向绑定，这里不知道为啥没生效......对象的话应该是引用
  if (todoIcons) {
    form.value = todoIcons;
    selfForm.value = todoIcons;
  }
});
// 重置表单
const resetForm = () => {
  customSettingsStore.resetForm();
  const todoIcons = customSettingsStore.customSettings["todo-icons"];
  // 手动赋值
  form.value = todoIcons;
  selfForm.value = todoIcons;
  Message.success("重置成功🙂");
};
</script>
<template>
  <div class="app">
    <!-- 下拉框的表单 -->
    <a-form :model="form" :style="{ width: '600px' }">
      <a-form-item field="form.olIcon" label="有序列表">
        <a-select
          :style="{ width: '320px' }"
          placeholder="选择一个图标"
          v-model="form.olIcon"
        >
          <a-option>1.</a-option>
          <a-option>🔢</a-option>
          <a-option>🆙</a-option>
          <a-option>😊</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="ulIcon" label="无序列表">
        <a-select
          :style="{ width: '320px' }"
          placeholder="选择一个图标"
          v-model="form.ulIcon"
        >
          <a-option>●</a-option>
          <a-option>★</a-option>
          <a-option>■</a-option>
          <a-option>🙂</a-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <!-- 自定义输入的表单 -->
    <a-form :model="selfForm" :style="{ width: '600px' }">
      <a-form-item field="selfForm.olIcon" label="有序列表">
        <a-input
          :style="{ width: '320px' }"
          placeholder="请输入Unicode支持的字符串"
          allow-clear
          v-model="selfForm.olIcon"
        />
      </a-form-item>
      <a-form-item field="selfForm.ulIcon" label="无序列表">
        <a-input
          :style="{ width: '320px' }"
          placeholder="请输入Unicode支持的字符串"
          allow-clear
          v-model="selfForm.ulIcon"
        />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetForm">恢复默认设置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped>
/* 设置整个页面的上间距 */
.app {
  margin-top: 2em;
}
</style>
