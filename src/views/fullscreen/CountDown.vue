<script setup>
import { IconFullscreenExit } from "@arco-design/web-vue/es/icon";
import { ref, computed, onMounted, onUnmounted ,h} from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

const isRunning = ref(false);
const percent = ref(0); // 定义进度条
const originTime = ref(0); // 记录选择的时间
const isBegin = ref(false); // 定义是否开始
const inputTime = ref(0); // 输入的时间
const totalTime = ref(0); // 计算成的秒数
let intervalId = null;
const handleChange = () => {
  console.log(totalTime.value, originTime.value);
  totalTime.value = inputTime.value * 60;
  console.log(totalTime.value, originTime.value);
};

const minutes = computed(() =>
  Math.floor(totalTime.value / 60)
    .toString()
    .padStart(2, "0")
);
const seconds = computed(() =>
  (totalTime.value % 60).toString().padStart(2, "0")
);

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
        percent.value = (1 - totalTime.value / originTime.value).toFixed(2); //更新进度条
      } else {
        // 时间结束，做最后的工作
        clearInterval(intervalId);
        // TODO：调用原生弹窗给用户提示
        alert("时间到！");
        // 恢复到之前的状态
        isBegin.value = false;
        isRunning.value = false;
        // 把上一次设置的值同步给计数器
        handleChange();
      }
    }, 1000);
  }
};

const pauseTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  isRunning.value = false;
};

onMounted(() => {
  // 可以在这里设置开始的默认状态
  window.addEventListener("keydown", handleKeyDown);
  Message.info({
    content: "按F键即可退出全屏😊",
    icon: () => h(IconFullscreenExit),
  });
});

onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("keydown", handleKeyDown);
});
const router = useRouter();
// 添加监听事件
const handleKeyDown = (e) => {
  if (e.key === "f") {
    // 先切换到主窗口，因为是spa
    window.electron.switchToMainWindow();
    // 执行跳转逻辑，再跳回去，关闭全屏窗口
    router.push("/countdown");
    // window.electron.closeTimerWindow();
  }
};
</script>
<template>
  <div class="main">
    <div class="pomodoro-timer">
      <!-- 输入框 -->
      <!-- 这个输入框是真的丑，但是我找了15分钟也没找到怎么修改灰色背景，就这样吧唉 -->
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
      />
      <!-- 进度条 -->
      <!-- :show-text="false" -->
      <a-progress
        status="warning"
        :percent="percent"
        type="circle"
        size="small"
        color="rgb(12, 228, 140)"
        v-else
      />
      <div class="timer-display">{{ minutes }}:{{ seconds }}</div>
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
    </div>
  </div>
</template>

<style scoped>
/* 在CSS文件中使用@import引入Roboto字体 */
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
  text-align: center;
  font-family: "Roboto", sans-serif;
  color: white;
  font-weight: 700;
  background-image: url(/timeBGI.jpg);
  background-size: cover; /* 覆盖整个容器 */
  background-repeat: no-repeat; /* 不重复 */
  background-position: center center; /* 图像居中显示 */
}
.pomodoro-timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 320px;
  height: 80px;
  border: 2px solid white;
  border-radius: 10px;
  padding: 0 15px;
}

.timer-display {
  font-size: 3em;
}

button {
  cursor: pointer;
}
/* 自定义字体颜色 */
>>> .arco-progress-circle-text {
  color: white;
}
</style>
