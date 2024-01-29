<script setup>
import { Message } from "@arco-design/web-vue";
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { IconFullscreenExit } from "@arco-design/web-vue/es/icon";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { useHasVisitedBeforeStore } from "@/stores/HasVisitedBefore";
const hasVisitedBeforeStore = useHasVisitedBeforeStore();
const isFirst = computed({
  get: () => hasVisitedBeforeStore.widgetTimer,
  set: (newValue) => (hasVisitedBeforeStore.widgetTimer = newValue),
});

const customSettingsStore = useCustomSettingsStore();
const isRunning = ref(false);
const percent = ref(0); // 定义进度条
const originTime = ref(0); // 记录选择的时间
const isBegin = ref(false); // 定义是否开始
const inputTime = ref(0); // 输入的时间
const totalTime = ref(0); // 计算成的秒数
let intervalId = null;  // 定时器id
// 同步输入框和定时器的值
const handleChange = () => {
  totalTime.value = inputTime.value * 60;
};
// 计算分钟
const minutes = computed(() =>
  Math.floor(totalTime.value / 60)
    .toString()
    .padStart(2, "0")
);
// 计算秒
const seconds = computed(() =>
  (totalTime.value % 60).toString().padStart(2, "0")
);

// 播放器对象
const audioFullTimePlayer = ref(null);
const audioHalfTimePlayer = ref(null);
const role = computed(
  () => customSettingsStore.customSettings.voice.timerV ?? "default"
); // 当前角色
const isClosed = computed(
  () => customSettingsStore.customSettings.voice.isClosedV ?? "false"
); //是否关闭(使用计算属性保持响应性)
const startTimer = () => {
  // 首先把数字输入框隐藏，显示进度条
  isBegin.value = true;
  originTime.value === 0 && (originTime.value = totalTime.value); // 只有第一次进来时候才同步时间，用于进度条的计算
  // 当前没有定时器在运行，第二个条件是为了重新开始，并清空定时器
  if (intervalId === null || originTime.value === totalTime.value) {
    isRunning.value = true;
    // 判断是不是第一次开始，是就清空进度条
    if (originTime.value === totalTime.value) {
      percent.value = 0;
    }
    // 开启定时器
    intervalId = setInterval(() => {
      if (totalTime.value > 0) {
        totalTime.value--;
        percent.value = Number(
          (1 - totalTime.value / originTime.value).toFixed(2)
        ); //更新进度条
        if (percent.value == 0.5) {
          !isClosed.value && audioHalfTimePlayer.value.play();
        }
      } else {
        // 时间结束，做最后的工作
        clearInterval(intervalId);
        // TODO：调用原生弹窗给用户提示
        alert("时间到！");
        !isClosed.value && audioFullTimePlayer.value.play();
        // 恢复到之前的状态
        isBegin.value = false;
        isRunning.value = false;
        // 把上一次设置的值同步给计数器
        handleChange();
      }
    }, 1000);
  }
};

// 暂停定时器
const pauseTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  isRunning.value = false;
};

// 挂载，应用初始化
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  if (isFirst.value) {
    Message.info({
      position: "top",
      content: "按E键即可清除挂件😊",
      icon: () => h(IconFullscreenExit),
    });
    isFirst.value = false;
  }
});

// 结束时收尾工作
onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("keydown", handleKeyDown);
});

// 添加监听事件
const handleKeyDown = (e) => {
  if (e.key === "r") {
    // r reset
    // 恢复定时器初始状态
    clearInterval(intervalId);
    intervalId = null;
    totalTime.value = 0;
    inputTime.value = originTime.value;
    originTime.value = 0;
    isRunning.value = false;
    percent.value = 0;
    isBegin.value = false;
  } else if (e.key === "e") {
    // exit，退出
    window.electron.removeWindow();
  }
};

// 手动同步本地存储状态到pinia
window.addEventListener("storage", (event) => {
  if (event.key === "customSettings") {
    // 重新从localStorage加载状态
    const updatedState = JSON.parse(event.newValue)?.customSettings;
    if (updatedState) {
      // 手动更新pinia的状态，因为打开新窗口默认又是一个应用，不会响应式更新了
      customSettingsStore.customSettings = updatedState;
    }
  }
});
// 双击事件
const handleDBLClick = () => {
  window.electron.removeWindow();
};
</script>
<template>
  <div class="timer">
    <!-- 输入框 -->
    <a-input-number
      v-model="inputTime"
      :style="{ width: '125px' }"
      mode="button"
      size="large"
      :default-value="24"
      :min="0.1"
      :max="999"
      v-if="!isBegin"
      @change="handleChange"
      style="-webkit-app-region: no-drag"
    />
    <!-- 进度条 -->
    <a-progress
      status="warning"
      :percent="percent"
      type="circle"
      size="small"
      color="rgb(12, 228, 140)"
      v-else
    />
    <!-- 时间展示 -->
    <div class="timer-display" @dblclick="handleDBLClick">
      {{ minutes }}:{{ seconds }}
    </div>
    <!-- 操作按钮 -->
    <div class="button">
      <a-button
        v-if="!isRunning"
        @click="startTimer"
        shape="circle"
        style="
          width: 44px;
          height: 44px;
          color: white;
          background-color: transparent;
          border: 2px solid white;
        "
        ><icon-play-arrow
      /></a-button>
      <a-button
        v-else
        @click="pauseTimer"
        shape="circle"
        style="
          width: 44px;
          height: 44px;
          color: white;
          background-color: transparent;
          border: 2px solid white;
        "
        ><icon-pause
      /></a-button>
    </div>
    <!-- 播放音频 |时间过半|时间到|-->
    <audio
      ref="audioHalfTimePlayer"
      :src="`/voices/timer/${role}/halfTime.wav`"
    ></audio>
    <audio
      ref="audioFullTimePlayer"
      :src="`/voices/timer/${role}/fullTime.wav`"
    ></audio>
  </div>
</template>

<style scoped>
/* 在CSS文件中使用@import引入Roboto字体 */
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
/* 番茄钟样式 */
.timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 320px;
  height: 80px;
  /* border: 2px solid black; */
  background-color: rgba(23, 31, 29, 0.4);
  border-radius: 10px;
  padding: 0 15px;
  -webkit-app-region: drag;
}

/* 时间样式 */
.timer-display {
  cursor: pointer;
  font-size: 3em;
  color: white;
  -webkit-app-region: no-drag;
}
/* 按钮样式 */
button {
  cursor: pointer;
  -webkit-app-region: no-drag;
}
/* 自定义字体颜色 */
>>> .arco-progress-circle-text {
  color: white;
}
</style>
