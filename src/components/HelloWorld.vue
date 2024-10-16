<template>
<div id="app">
  <table border="1">
    <thead>
      <tr>
        <th>姓名</th>
        <th>年龄</th>
      </tr>
    </thead>
    <tbody>
      <!-- 使用 v-for 指令来渲染每一行 -->
      <tr v-for="(row, index) in rows" :key="index">
        <td>{{ row.name }}</td>
        <td>{{ row.age }}</td>
      </tr>
    </tbody>
  </table>
  <!-- 添加一个按钮来增加行 -->
  <button @click="addRow">添加行</button>
</div>
  
</template>

<script>
new Vue({
  el: '#app',
  data: {
    // 初始化一些数据
    rows: [
      { name: '张三', age: 28 },
      { name: '李四', age: 22 }
    ]
  },
  methods: {
    // 方法用来增加行
    addRow: function () {
      this.rows.push({ name: '新用户', age: 0 });
    }
  }
});

</script>

<style scoped>

</style>
