<script setup>
import { ref, reactive } from "vue";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { Message } from "@arco-design/web-vue";

const customSettingsStore = useCustomSettingsStore();
const defaultForm = {
  duration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}; // 表单对象
const form = ref({
  duration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}); // 表单对象

const fFile = ref(null); // 文件对象
const wFile = ref(null); // 文件对象

// 绑定响应式对象
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
const handleSubmit = (data) => {
  console.log(data);
};
const resetForm = () => {
  Object.assign(form.value, { ...defaultForm });
  Message.success("重置成功🙂");
};
// 存储全屏背景图片
const onFChange = (_, currentFile) => {
  fFile.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
  //   console.log(file.value.file.path);   // 本地路径
  //   此时把文件传递过去让node保存到本地
  window.electron
    .saveFile("f-pomodoro", fFile.value.file.path)
    .then((filepath) => {
      if (filepath) {
        Message.success(`背景图设置成功 ٩(◕‿◕｡)۶`);
        // 保存到pinia里面
        if (customSettingsStore.customSettings["f-pomodoro-bgi"]) {
          customSettingsStore.customSettings["f-pomodoro-bgi"] = filepath;
        }
      }
    })
    .catch((error) => {
      console.log("背景图设置失败 (｡•́︿•̀｡)");
    });
};
// 存储小部件背景图(widget)
const onWChange = (_, currentFile) => {
  wFile.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
  //   console.log(file.value.file.path);   // 图片路径
  //   此时把文件传递过去让node保存到本地
  window.electron
    .saveFile("w-pomodoro", wFile.value.file.path)
    .then((filepath) => {
      if (filepath) {
        Message.success(`背景图设置成功 ٩(◕‿◕｡)۶`);
        // 保存到pinia里面
        if (customSettingsStore.customSettings["w-pomodoro-bgi"]) {
          customSettingsStore.customSettings["w-pomodoro-bgi"] = filepath;
        }
      }
    })
    .catch((error) => {
      console.log("背景图设置失败 (｡•́︿•̀｡)");
    });
};
// 显示上传进度
const onFProgress = (currentFile) => {
  fFile.value = currentFile;
};
const onWProgress = (currentFile) => {
  wFile.value = currentFile;
};

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
.background {
  display: flex;
  /* align-items: center; */
  margin: 40px 0px 0px 0px;
}
>>> .arco-form-item-label-col {
  line-height: 60px;
}
>>> .arco-form-item {
  margin-bottom: 0px;
}
/* /deep/ .menu .arco-menu-horizontal .arco-menu-inner {
  display: flex;
  align-items: center;
  padding: 7px 20px !important;
} */
</style>
