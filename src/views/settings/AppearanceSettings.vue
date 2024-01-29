<script setup>
import { ref, reactive } from "vue";
console.log(111);
</script>
<template>
  <div class="app">
    <a-card style="width: 40%; margin: 5em auto 0; font-size: 1.2em">
      <div
        class="features"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="icon" style="font-size: 2.5em">🔜</div>
        <div class="contents" style="margin: 0 auto">
          <div class="content">🖌️ 自定义主题</div>
          <div class="content">🆙 自定义字体大小</div>
          <div class="content">🌈 自定义桌面挂件颜色和透明度</div>
          <div class="content">🔄 自定义桌面挂件大小</div>
        </div>
      </div></a-card
    >
  </div>
</template>
<style scoped>
.content{
  margin-bottom: 0.5em;
}
.content:last-child{
  margin-bottom: 0;
}
</style>
