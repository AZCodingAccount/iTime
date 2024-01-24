<script setup></script>
<template>
  <!-- 设置参数的按钮 -->
  <a-button
    @click="popDialog"
    style="
      color: white;
      background-color: transparent;
      border: 2px solid white;
      border-radius: 10px;
    "
    >设置参数</a-button
  >

  <!-- 设置番茄钟参数 -->
  <a-slider
    :default-value="5"
    :style="{ width: '300px' }"
    :max="15"
    :marks="marks"
  />
</template>
<style scoped></style>
