<template>
  <div id="app">
    <div id="building"></div>
    <div class="centered-container">
      <!-- 居中容器 -->
      <h1 class="title">视频真伪鉴定</h1>
      <div class="container">
        <!-- <img :src="logoPath" alt="Logo" class="logo" />   -->
        <label class="upload-button" for="fileInput">
          选择视频文件
          <input
            type="file"
            id="fileInput"
            @change="onFileSelected"
            accept="video/*"
            style="display: none"
          />
          <p v-if="choose_path">选择文件：{{ choose_path }}</p>
        </label>
        <br />

        <button class="custom-button" @click="upVideo">上传视频</button>

        <p v-if="uploadStatus === 'success'">上传成功！文件 ID: {{ fileId }}</p>
        <p v-if="uploadStatus === 'error'">{{ uploadError }}</p>
        <button class="custom-button" @click="detectVideo(fileId)">
          检测视频
        </button>
      </div>

      <div class="table_container">
        <button @click="addrow">add</button>
        <table>
          <thead>
            <tr>
              <th>文件</th>
              <th>状态</th>
              <th>判定</th>
              <th>得分</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              {{
                fileId
              }}
            </tr>
            <tr>
              {{
                status
              }}
            </tr>
            <tr>
              {{
                status
              }}
            </tr>
            <tr>
              {{
                score
              }}
            </tr>
            <!-- <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.fileId }}</td>
              <td>{{ item.status }}</td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
    <!-- 新增的表格 -->
  </div>
</template>

<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import axios from "axios";
import querystring from "querystring";
import { ref } from "vue";



const selectedFile = ref<File | null>(null);

const up_url = "http://183.252.181.232:7658/api/resource/upload";
const detect_url = "http://183.252.181.232:7658/api/DFDetect";
let fileId = ref(""); // 文件ID
let uploadStatus = ref("");
let choose_path = ref("");
let tableData = ref([]);

let index_detect = ref([]);
let status = ref(true);
let index = ref(0); //0 未检测 1 真 2 假

let query_data = {};

// 定义视频检测的请求参数
interface VideoDetectionParams {
  fileId: string;
  type: string;
  task: string;
  algorithms: string[];
  spf: number;
  threshold: number;
}

// 定义视频检测的请求参数
interface VideoDetectionParams {
  fileId: string;
  type: string;
  task: string;
  algorithms: string[];
  spf: number;
  threshold: number;
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];

    console.log(
      "selectedFile:",
      selectedFile.value,
      selectedFile.value.name,
      "choose_path:",
      choose_path
    ); // 检查是否正确获取了文件
    choose_path.value = selectedFile.value.name;
  }
}

function upVideo() {
  if (!selectedFile.value) {
    console.error("请选择一个文件再上传");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  console.log(formData);

  const res = axios
    .post(up_url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200 && response.data.code === 20000) {
        console.log(`文件上传成功，返回的文件 ID 是：${response.data.data}`);
        // 获取文件 ID，之后可用于视频检测接口
        fileId = response.data.data;
        console.log("fileId:", fileId);
        uploadStatus.value = "success";
        // 这里可以继续调用视频检测接口
      } else {
        console.error("上传失败，请检查返回的错误信息。", response.data);
        uploadStatus.value = "error";
      }
    })
    .catch((error) => {
      console.error("请求过程中发生错误。", error);
    });
}



// 视频检测接口函数
function detectVideo(fileId: string): void {
  const detectionParams: VideoDetectionParams = {
    fileId: fileId,
    type: "video",
    task: "DALLE3", // 根据实际情况调整为正确的任务名
    algorithms: ["CORE"], // 根据实际情况调整算法列表
    spf: 1,
    threshold: 0.5,
  };

  const jsonString = JSON.stringify(detectionParams);
  console.log("Sending JSON String:", jsonString);

  // 发送请求
  const res = axios
    .post(
      "/api/DFDetect", // 替换为实际的API地址
      jsonString, // 发送JSON字符串
      {
        headers: {
          "Content-Type": "application/json", // 设置Content-Type为JSON
        },
      }
    )
    .then((response) => {
      if (response.status === 200 && response.data.code === 20000) {
        // 假设这是成功的响应码
        console.log("视频检测成功:", response.data);
        const detectionResult = response.data.data;

        status.value = detectionResult.conclusion.authenticity; //真假
        //
        if (status.value === true) {
          index_detect[index.value] = 1;
        } else {
          index_detect[index.value] = 2;
        }

        // 处理检测结果
        console.log("总体结论:", detectionResult.conclusion);
        console.log("详细信息:", detectionResult.detail);
        console.log("真假：", index_detect[index.value]);

        // 进一步处理检测结果...
      } else {
        if (response.data.msg == "Can not detect face") {
          index_detect[index.value] = 0;
          console.log("视频检测失败，请检查返回的错误信息。", response.data);
        }
      }
    })
    .catch((error) => {
      console.error("请求过程中发生错误。", error);
    });
}


</script>

<style scoped>
/* 全局样式 */
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  color: #333;
}

/* 背景图片样式 */
#building {
  background: url("data/img/搜图神器_1729046446453.png") no-repeat center center
    fixed;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1; /* 确保背景图片在内容之后 */
}

/* 居中容器样式 */
.centered-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  width: 80vh;
  max-width: 1800px; /* 调整为更合适的最大宽度 */
  /* width: 100%;   */
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* 添加半透明背景以改善可读性 */
  gap: 20px; /* 子元素之间的间距 */
}

/* 容器样式 */
.container {
  position: relative;
  top: -30px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 60vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%; /* 确保容器不会超出其父容器的宽度 */
  gap: 40px; /* 子元素之间的间距 */
}

/* Logo 样式 */
.logo {
  background: url("data/img/搜图神器_1729046446453.png") no-repeat center center
    fixed;
  background-size: cover;
  width: 120px; /* 稍微增大Logo尺寸 */
  margin-bottom: 30px;
}

/* 上传按钮样式 */
.upload-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4caf50; /* 更改为主题绿色 */
  color: white;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 20px;
  text-decoration: none; /* 移除下划线 */
  text-align: center; /* 文本居中 */
  transition: background-color 0.3s ease; /* 添加过渡效果 */
}

.upload-button:hover {
  background-color: #45a049; /* 悬停时更改背景色 */
}

/* 自定义按钮样式 */
.custom-button {
  display: inline-block;
  font-size: 24px;
  padding: 12px 24px;
  background-color: #2196f3; /* 蓝色主题 */
  color: white;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  margin-top: 10px; /* 添加顶部外边距 */
  margin-right: 40px;
  margin-left: 40px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border: white;
}
.table_container {
  width: 100%;
  max-width: 600px; /* 可以根据需要调整宽度 */
}

.custom-button:hover {
  background-color: #1976d2; /* 悬停时更改背景色 */
}

/* 段落样式 */
p {
  margin-top: 20px;
  color: #666; /* 稍微降低文本颜色以改善可读性 */
}

.title {
  position: relative;
  top: -30px;
}
</style>
