<script setup>
import { ref, nextTick } from "vue";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { List, Message } from "@arco-design/web-vue";
const customSettingsStore = useCustomSettingsStore();
let form = ref({ ...customSettingsStore.customSettings.shortcutKeys });

// 定义控制是否可以输入的变量
const fPomodoroDisabled = ref(true);
const wPomodoroDisabled = ref(true);
const fTimerDisabled = ref(true);
const wTimerDisabled = ref(true);
// 定义当前允许输入的输入框，后续还需要根据这个值更新
const currentInput = ref(""); // 可以是 'fPomodoro', 'wPomodoro', 'fTimer', 'wTimer' 或者 ""

const removeListener = ref(null); // 一个函数，移除监听器

// 处理这些按钮点击的事件
// 每次只允许一个输入框是可输入的
const isSingleInput = () => {
  if (currentInput.value) {
    Message.error("只允许同时设置一个快捷方式🧐");
    return false;
  }
  return true;
};
// 实时监听键盘的组合键并在输入框回显
const beginKeyBoardListener = () => {
  const pressedKeys = new Array(); // 存储按下的键
  const keyDownHandler = (event) => {
    form.value[currentInput.value] = "";
    let bigKey = event.key;
    // 转换成大写更好看，也可以跟API对接
    if (event.key.length == 1) {
      bigKey = event.key.toUpperCase();
    }
    pressedKeys.push(bigKey); // 添加按下的键
    const combination = Array.from(pressedKeys).join("+"); // 构建组合键字符串

    // 检查当前是否有输入框被激活
    if (currentInput.value && form.value.hasOwnProperty(currentInput.value)) {
      // 将组合键回显到激活的输入框
      form.value[currentInput.value] += `${combination}`;
      event.preventDefault(); // 阻止默认行为
    }
  };
  // 捕捉不到Meta（win）弹起事件，特殊处理一下
  const keyUpHandler = (event) => {
    console.log("up", event.key);
    pressedKeys.pop(); // 释放键时移除
  };

  // 添加键盘事件监听器
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  // 不需要时移除监听器
  removeListener.value = () => {
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
  };
};

// 定义点击事件 @params type 'fPomodoro'|'wPomodoro'|'fTimer'|'wTimer'
const handleClick = (type) => {
  // 先禁用所有快捷键
  window.electron.disableAllShortcut();
  if (isSingleInput()) {
    // 做四件事，0：提醒用户。1：取消禁用输入框。2：更新当前输入框的值 3：开启键盘监听事件并回显到输入框
    Message.info("直接按下键盘即可记录 😎");

    if (type == "fPomodoro") {
      fPomodoroDisabled.value = false;
      currentInput.value = "fPomodoro";
    } else if (type == "wPomodoro") {
      wPomodoroDisabled.value = false;
      currentInput.value = "wPomodoro";
    } else if (type == "fTimer") {
      fTimerDisabled.value = false;
      currentInput.value = "fTimer";
    } else if (type == "wTimer") {
      wTimerDisabled.value = false;
      currentInput.value = "wTimer";
    }
    beginKeyBoardListener();
  }
};
const updateForm = () => {
  form.value = customSettingsStore.customSettings.shortcutKeys;
};
// 定义保存事件 @params type 'fPomodoro'|'wPomodoro'|'fTimer'|'wTimer'
const handleSave = async (type) => {
  // 如果输入了不允许输入的值，就给用户提示
  for (const value of Object.values(form.value)) {
    if (
      value === "Control+Alt" ||
      value === "Alt+Control" ||
      value.includes("Meta")
    ) {
      Message.error("不允许设置  (｡•́︿•̀｡)");
      return; // 退出整个 handleSave 函数
    }
  }
  // 如果快捷键被占用了，给用户提示
  const res = await window.electron.shortcutSetting(
    JSON.parse(JSON.stringify(form.value))
  );
  if (res) {
    Message.error("快捷键被占用  (｡•́︿•̀｡)");
    // 把注册的快捷键先清空
    window.electron.disableAllShortcut();
    return;
  }
  // 重置状态
  currentInput.value = "";
  if (type == "fPomodoro") {
    fPomodoroDisabled.value = true;
  } else if (type == "wPomodoro") {
    wPomodoroDisabled.value = true;
  } else if (type == "fTimer") {
    fTimerDisabled.value = true;
  } else if (type == "wTimer") {
    wTimerDisabled.value = true;
  }
  // 手动更新本地存储的值;
  customSettingsStore.customSettings.shortcutKeys = { ...form.value };
  // updateForm(); // 更新表单显示的值
  Message.success("保存成功    (˃ᴗ˂)");
};
// 恢复默认设置
const resetForm = () => {
  customSettingsStore.resetShortcutKeys();
  updateForm(); // 重新渲染
  Message.success("重置成功🙂");
};

// 位置设置
const positionForm = ref(null);
positionForm.value = customSettingsStore.customSettings.position;

const resetPositionForm = () => {
  customSettingsStore.resetPositionSettings();
  positionForm.value = customSettingsStore.customSettings.position;
  // 重新渲染
  Message.success("重置成功🙂");
};

// 语音设置
const voiceForm = ref(null);
voiceForm.value = customSettingsStore.customSettings.voice;
const resetVoiceForm = () => {
  customSettingsStore.resetVoiceSettings();
  voiceForm.value = customSettingsStore.customSettings.voice;
  // 重新渲染
  Message.success("重置成功🙂");
};
</script>
<template>
  <div class="app">
    <!-- 全局快捷键设置 -->
    <a-form :model="form" :style="{ width: '600px', 'margin-left': '1em' }">
      <div
        class="hin"
        style="
          width: 600px;
          text-align: center;
          margin: 10px 0px 20px;
          font-size: 14px;
          font-weight: 600;
        "
      >
        快捷键设置
      </div>
      <a-form-item field="fPomodoro" label="全屏显示番茄钟">
        <a-input v-model="form.fPomodoro" :disabled="fPomodoroDisabled" />
        <a-button @click="handleClick('fPomodoro')" v-if="fPomodoroDisabled"
          >开始录制</a-button
        >
        <a-button @click="handleSave('fPomodoro')" v-else>结束录制</a-button>
      </a-form-item>

      <a-form-item field="wPomodoro" label="召唤番茄钟挂件">
        <a-input v-model="form.wPomodoro" :disabled="wPomodoroDisabled" />
        <a-button @click="handleClick('wPomodoro')" v-if="wPomodoroDisabled"
          >开始录制</a-button
        >
        <a-button @click="handleSave('wPomodoro')" v-else>结束录制</a-button>
      </a-form-item>
      <a-form-item field="fTimer" label="全屏显示计时器">
        <a-input v-model="form.fTimer" :disabled="fTimerDisabled" />
        <a-button @click="handleClick('fTimer')" v-if="fTimerDisabled"
          >开始录制</a-button
        >
        <a-button @click="handleSave('fTimer')" v-else>结束录制</a-button>
      </a-form-item>
      <a-form-item field="wTimer" label="召唤计时器挂件">
        <a-input v-model="form.wTimer" :disabled="wTimerDisabled" />
        <a-button @click="handleClick('wTimer')" v-if="wTimerDisabled"
          >开始录制</a-button
        >
        <a-button @click="handleSave('wTimer')" v-else>结束录制</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="resetForm">恢复默认设置</a-button>
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <!-- 设置倒计时、番茄钟、便签是否总是在底层 -->
    <a-form :model="positionForm" layout="inline">
      <a-form-item style="font-weight: 600">挂件是否在顶层设置</a-form-item>
      <a-form-item field="positionForm.pomodoroP" label="番茄钟">
        <a-switch v-model="positionForm.pomodoroP" />
      </a-form-item>

      <a-form-item field="positionForm.timerP" label="计时器">
        <a-switch v-model="positionForm.timerP" />
      </a-form-item>
      <a-form-item field="positionForm.todoP" label="待办">
        <a-switch v-model="positionForm.todoP" />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetPositionForm">恢复默认设置</a-button>
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <!-- 设置提示语音、待办，倒计时、番茄钟 -->
    <a-form :model="voiceForm" layout="inline">
      <a-form-item style="font-weight: 600">提示语音设置</a-form-item>
      <a-form-item field="voiceForm.pomodoroV" label="番茄钟">
        <a-select
          size="small"
          style="width: 100px"
          v-model="voiceForm.pomodoroV"
        >
          <a-option value="default">东雪莲</a-option>
          <a-option value="dingzhen">丁真</a-option>
          <a-option value="jiaran">嘉然</a-option>
          <a-option value="Kobe">科比</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="voiceForm.timerV" label="计时器">
        <a-select size="small" style="width: 100px" v-model="voiceForm.timerV">
          <a-option value="default">东雪莲</a-option>
          <a-option value="dingzhen">丁真</a-option>
          <a-option value="jiaran">嘉然</a-option>
          <a-option value="Kobe">科比</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="voiceForm.todoV" label="待办">
        <a-select size="small" style="width: 100px" v-model="voiceForm.todoV">
          <a-option value="default">东雪莲</a-option>
          <a-option value="dingzhen">丁真</a-option>
          <a-option value="jiaran">嘉然</a-option>
          <a-option value="Kobe">科比</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="voiceForm.isClosedV" label="关闭语音提示">
        <a-switch v-model="voiceForm.isClosedV" />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetVoiceForm">恢复默认</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<style></style>
