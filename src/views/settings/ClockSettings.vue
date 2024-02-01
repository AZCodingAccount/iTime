<script setup>
import { ref } from "vue";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { Message } from "@arco-design/web-vue";

const customSettingsStore = useCustomSettingsStore();
const defaultForm = {
  duration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}; // 默认表单对象属性值，可以使用这种方式，但一般还是在pinia里面存储
const form = ref({
  duration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}); // 表单对象

const fFile = ref(null); // 文件对象
const wFile = ref(null); // 文件对象

// 绑定对象——双向，直接是引用
if (customSettingsStore.customSettings.pomodoroSettings) {
  form.value = customSettingsStore.customSettings.pomodoroSettings;
}

// 给滑动栏一个标识
const durationMarks = {
  15: "15",
  25: "25",
  35: "35",
  45: "45",
  55: "55",
};
const shortBreakDurationMarks = {
  3: "3",
  6: "6",
  9: "9",
  12: "12",
  15: "15",
};
const longBreakDurationMarks = {
  5: "5",
  10: "10",
  15: "15",
  20: "20",
  25: "25",
};
const longBreakIntervalMarks = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
};

// 重置表单
const resetForm = () => {
  Object.assign(form.value, { ...defaultForm });
  Message.success("重置成功🙂");
};
// 存储全屏背景图片
const onFChange = (_, currentFile) => {
  fFile.value = {
    ...currentFile,
  };
  //   此时把文件传递过去让node保存到本地
  window.electron
    .saveFile("f-pomodoro", fFile.value.file.path)
    .then((filepath) => {
      if (filepath) {
        Message.success(`背景图设置成功 ٩(◕‿◕｡)۶`);
        // 保存到pinia里面
        customSettingsStore.customSettings["f-pomodoro-bgi"] = handlePath(
          window.electron.getAppPath() + filepath
        );
      }
    })
    .catch((error) => {
      console.log(error);
      Message.error("背景图设置失败 (｡•́︿•̀｡)");
    });
};
// 存储小部件背景图(widget)
const onWChange = (_, currentFile) => {
  wFile.value = {
    ...currentFile,
  };
  console.log(wFile.value.file.path);
  //   此时把文件传递过去让node保存到本地
  window.electron
    .saveFile("w-pomodoro", wFile.value.file.path)
    .then((filepath) => {
      if (filepath) {
        Message.success(`背景图设置成功 ٩(◕‿◕｡)۶`);
        // 保存到pinia里面
        customSettingsStore.customSettings["w-pomodoro-bgi"] = handlePath(
          window.electron.getAppPath() + filepath
        );
      }
    })
    .catch((error) => {
      console.log(error);
      Message.error("背景图设置失败 (｡•́︿•̀｡)");
    });
};
// 处理路径
const handlePath = (originPath) => {
  const formattedValue = originPath.replace(/\\/g, "/").replace(/\s/g, "%20");
  return `file:///${formattedValue}`;
};
// 显示上传进度
const onFProgress = (currentFile) => {
  fFile.value = currentFile;
};
const onWProgress = (currentFile) => {
  wFile.value = currentFile;
};

// 重置背景图——就是使用store提供的方法重置规范一点
const resetBGI = () => {
  customSettingsStore.resetPomodoroBGI();
  Message.success("重置成功🙂");
  // 去除预览
  fFile.value = null;
  wFile.value = null;
};
</script>
<template>
  <div class="app">
    <!-- 番茄钟设置 -->
    <a-form
      :model="form"
      ref="formRef"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item
        field="duration"
        tooltip="您每轮专注持续的时间"
        label="专注时段"
      >
        <a-slider
          v-model="form.duration"
          :default-value="25"
          :style="{ width: '300px' }"
          :min="15"
          :max="55"
          :marks="durationMarks"
        />
      </a-form-item>
      <a-form-item
        field="shortBreakDuration"
        tooltip="您每轮专注后休息的时间"
        label="短休息"
      >
        <a-slider
          v-model="form.shortBreakDuration"
          :default-value="5"
          :style="{ width: '300px' }"
          :max="15"
          :min="3"
          :marks="shortBreakDurationMarks"
        />
      </a-form-item>
      <a-form-item
        field="longBreakDuration"
        tooltip="一个番茄周期后休息的时间"
        label="长休息"
      >
        <a-slider
          v-model="form.longBreakDuration"
          :default-value="15"
          :style="{ width: '300px' }"
          :max="25"
          :min="5"
          :marks="longBreakDurationMarks"
        />
      </a-form-item>
      <a-form-item
        field="longBreakInterval"
        tooltip="您本次专注的轮数"
        label="番茄周期"
      >
        <a-slider
          v-model="form.longBreakInterval"
          :default-value="4"
          :style="{ width: '300px' }"
          :max="6"
          :min="2"
          :marks="longBreakIntervalMarks"
        />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetForm">恢复默认设置</a-button>
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <!-- 设置背景图 -->
    <div class="background">
      <div
        class="hint"
        style="color: rgb(78, 89, 105); margin: 20px 0px 0 10px"
      >
        更改全屏背景图：
      </div>
      <a-upload
        action="/"
        :fileList="fFile ? [fFile] : []"
        :show-file-list="false"
        @change="onFChange"
        @process="onFProgress"
        :auto-upload="false"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
              fFile && fFile.status === 'error'
                ? ' arco-upload-list-item-error'
                : ''
            }`"
          >
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="fFile && fFile.url"
            >
              <img :src="fFile.url" style="object-fit: cover" />
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
              <a-progress
                v-if="fFile.status === 'uploading' && fFile.percent < 100"
                :percent="fFile.percent"
                type="circle"
                size="mini"
                :style="{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                }"
              />
            </div>
            <div class="arco-upload-picture-card" v-else>
              <div class="arco-upload-picture-card-text">
                <IconPlus />
                <div style="margin-top: 10px; font-weight: 600">上传</div>
              </div>
            </div>
          </div>
        </template>
      </a-upload>
      <div
        class="hint"
        style="color: rgb(78, 89, 105); margin: 20px 0px 0 30px"
      >
        更改组件背景图：
      </div>
      <a-upload
        action="/"
        :fileList="wFile ? [wFile] : []"
        :show-file-list="false"
        @change="onWChange"
        @process="onWProgress"
        :auto-upload="false"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
              wFile && wFile.status === 'error'
                ? ' arco-upload-list-item-error'
                : ''
            }`"
          >
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="wFile && wFile.url"
            >
              <img :src="wFile.url" />
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
              <a-progress
                v-if="wFile.status === 'uploading' && wFile.percent < 100"
                :percent="wFile.percent"
                type="circle"
                size="mini"
                :style="{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                }"
              />
            </div>
            <div class="arco-upload-picture-card" v-else>
              <div class="arco-upload-picture-card-text">
                <IconPlus />
                <div style="margin-top: 10px; font-weight: 600">上传</div>
              </div>
            </div>
          </div>
        </template>
      </a-upload>
      <!-- 重置背景图按钮 -->
      <a-button @click="resetBGI" style="margin: auto 0px auto 30px"
        >恢复默认背景</a-button
      >
    </div>
  </div>
</template>
<style scoped>
/* 背景图设置部分样式 */
.background {
  display: flex;
  margin: 40px 0px 0px 0px;
}
/* 对arco design的组件间距进行微调 */
>>> .arco-form-item-label-col {
  line-height: 60px;
}
>>> .arco-form-item {
  margin-bottom: 0px;
}
</style>
