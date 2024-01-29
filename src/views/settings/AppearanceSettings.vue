<script setup>
</script>
<template>
  <div class="app">
    <!-- 展示的卡片 -->
    <a-card style="width: 400px; margin: 5em auto 0; font-size: 1.2em">
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
/* 设置间距 */
.content{
  margin-bottom: 0.5em;
}
/* 取消最后一行的间距 */
.content:last-child{
  margin-bottom: 0;
}
</style>
