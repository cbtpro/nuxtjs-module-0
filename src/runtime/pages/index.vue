<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">🎮 喜加一日历</h1>
      <p class="app-subtitle">追踪游戏限免和免费活动</p>
    </header>

    <main class="app-main">
      <FreebieCalendar />
    </main>

    <footer class="app-footer">
      <p>© 2025 喜加一日历 - 永远不错过免费游戏</p>
    </footer>
  </div>
</template>
<script setup lang="ts">
import FreebieCalendar from '../components/freebie-calendar.vue';
defineOptions({
  name: 'IndexPage',
});
</script>
<style>
:root {
  --icon-normal-size: 20px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #2d3748;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0px;
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
}

.app-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  padding: 40px 20px;
  background: #f7fafc;
  margin: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: white;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 28px;
  }

  .app-subtitle {
    font-size: 16px;
  }

  .app-main {
    margin: 10px;
    padding: 20px 10px;
  }
}
</style>
