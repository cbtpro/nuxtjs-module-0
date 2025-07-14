<template>
  <div class="freebie-calendar">
    <!-- 日历头部 -->
    <div class="calendar-header">
      <div class="header-top">
        <button @click="goToToday" class="today-button">
          <IconCalendar />
          回到今天
        </button>
      </div>
      <div class="header-bottom">
        <button @click="previousMonth" class="nav-button">
          <IconArrowLeft />
        </button>
        <h2 class="month-title">{{ currentMonth.format('YYYY年MM月') }}</h2>
        <button :title="`前往 ${currentMonth.add(1, 'month').format('YYYY年MM月')}`" @click="nextMonth" class="nav-button">
          <IconArrowRight />
        </button>
      </div>
    </div>

    <!-- 星期标题 -->
    <div class="weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <div v-if="now" v-for="date in calendarDates" :key="date.format('YYYY-MM-DD')" :class="[
        'calendar-date',
        {
          'other-month': !date.isSame(currentMonth, 'month'),
          'today': now && date.isSame(now, 'day'),
          'has-freebie': hasFreebieOnDate(date),
          'selected': selectedDate && date.isSame(selectedDate, 'day')
        }
      ]" @click="selectDate(date)">
        <span class="date-number">{{ date.date() }}</span>
        <div v-if="hasFreebieOnDate(date)" class="freebie-indicator"></div>
      </div>
    </div>

    <!-- 选中日期的详情 -->
    <div v-if="selectedDate && selectedFreebies.length > 0" class="selected-date-details">
      <h3 class="details-title">{{ selectedDate.format('MM月DD日') }} 的喜加一</h3>
      <div class="freebies-list">
        <div v-for="freebie in selectedFreebies" :key="freebie.id" class="freebie-card">
          <img :src="freebie.image" :alt="freebie.title" class="freebie-image" />
          <div class="freebie-info">
            <h4 class="freebie-title">{{ freebie.title }}</h4>
            <div class="freebie-meta">
              <span class="platform">{{ freebie.platform }}</span>
              <span :class="['status', getStatusClass(freebie.status)]">{{ freebie.status }}</span>
            </div>
            <p class="freebie-description">{{ freebie.description }}</p>
            <div class="freebie-price">
              <span class="original-price">原价: ¥{{ freebie.originalPrice }}</span>
              <span class="free-price">现在免费</span>
            </div>
            <button @click="claimGame(freebie)" :disabled="!freebie.isActive"
              :class="['claim-button', { 'disabled': !freebie.isActive }]">
              {{ freebie.isActive ? '立即领取' : '活动已结束' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日喜加一 -->
    <div class="today-freebies">
      <h3 class="today-title">今日喜加一</h3>
      <div v-if="todayFreebies.length > 0" class="today-list">
        <div v-for="freebie in todayFreebies" :key="freebie.id" class="today-freebie">
          <img :src="freebie.image" :alt="freebie.title" class="today-image" />
          <div class="today-info">
            <h5 class="today-freebie-title">{{ freebie.title }}</h5>
            <span class="today-platform">{{ freebie.platform }}</span>
          </div>
          <button @click="claimGame(freebie)" :disabled="!freebie.isActive" class="today-claim-button">
            {{ freebie.isActive ? '领取' : '已结束' }}
          </button>
        </div>
      </div>
      <div v-else class="no-freebies">
        <p>今日暂无免费游戏</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import IconCalendar from './icons/icon-calendar.vue';
import IconArrowLeft from './icons/icon-arrow-left.vue';
import IconArrowRight from './icons/icon-arrow-right.vue';

dayjs.locale('zh-cn');

defineOptions({
  name: 'FreebieCalendar',
});

interface Freebie {
  id: string;
  title: string;
  platform: string;
  description: string;
  image: string;
  originalPrice: number;
  status: string;
  date: string;
  claimUrl: string;
  isActive: boolean;
}

const freebieData: Freebie[] = [
  {
    id: '1',
    title: 'Epic Games 神秘游戏',
    platform: 'Epic Games',
    description: '每周免费游戏，限时领取',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200',
    originalPrice: 129,
    status: '限免中',
    date: dayjs().format('YYYY-MM-DD'),
    claimUrl: 'https://store.epicgames.com/zh-CN/free-games',
    isActive: true
  },
  {
    id: '2',
    title: 'Steam 周末免费',
    platform: 'Steam',
    description: '周末免费试玩活动',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=200',
    originalPrice: 89,
    status: '免费试玩',
    date: dayjs().format('YYYY-MM-DD'),
    claimUrl: 'https://store.steampowered.com/search/?maxprice=free&specials=1',
    isActive: true
  },
  {
    id: '3',
    title: 'GOG 老游戏免费',
    platform: 'GOG',
    description: '经典怀旧游戏永久免费',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=200',
    originalPrice: 59,
    status: '永久免费',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    claimUrl: 'https://www.gog.com/games?price=free',
    isActive: true
  },
  {
    id: '4',
    title: 'Ubisoft Connect 免费游戏',
    platform: 'Ubisoft',
    description: 'Ubisoft 免费游戏活动',
    image: 'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=200',
    originalPrice: 199,
    status: '限时免费',
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    claimUrl: 'https://store.ubisoft.com/cn/free-games',
    isActive: true
  }
];

const now = ref<dayjs.Dayjs | null>(null);
onMounted(() => {
  now.value = dayjs();
});
const currentMonth = ref(dayjs());
const selectedDate = ref<dayjs.Dayjs | null>(null);
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const calendarDates = computed(() => {
  const startOfMonth = currentMonth.value.startOf('month');
  const endOfMonth = currentMonth.value.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const dates = [];
  let current = startOfCalendar;

  while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
    dates.push(current);
    current = current.add(1, 'day');
  }

  return dates;
});

const selectedFreebies = computed(() => {
  if (!selectedDate.value) return [];
  const dateStr = selectedDate.value.format('YYYY-MM-DD');
  return freebieData.filter(freebie => freebie.date === dateStr);
});

const todayFreebies = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return freebieData.filter(freebie => freebie.date === today);
});

const hasFreebieOnDate = (date: dayjs.Dayjs) => {
  const dateStr = date.format('YYYY-MM-DD');
  return freebieData.some(freebie => freebie.date === dateStr);
};

const selectDate = (date: dayjs.Dayjs) => {
  if (hasFreebieOnDate(date)) {
    selectedDate.value = date;
  }
};

const previousMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month');
};

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month');
};

const goToToday = () => {
  currentMonth.value = dayjs();
  selectedDate.value = null;
};

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '限免中': 'active',
    '免费试玩': 'trial',
    '永久免费': 'permanent',
    '限时免费': 'limited'
  };
  return statusMap[status] || 'default';
};

const claimGame = (freebie: Freebie) => {
  if (freebie.isActive && freebie.claimUrl) {
    window.open(freebie.claimUrl, '_blank');
  }
};
</script>

<style scoped>
.freebie-calendar {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.calendar-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.header-top {
  display: flex;
  justify-content: center;
}

.today-button {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
}

.today-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.month-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 10px;
}

.weekday {
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
}

.calendar-date {
  background: white;
  padding: 12px 8px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.calendar-date:hover {
  background: #f7fafc;
}

.calendar-date.other-month {
  color: #cbd5e0;
  background: #f8f9fa;
}

.calendar-date.today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 600;
}

.calendar-date.has-freebie {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  cursor: pointer;
}

.calendar-date.has-freebie:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.calendar-date.selected {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
  transform: scale(1.05);
}

.date-number {
  font-size: 16px;
  font-weight: 500;
}

.freebie-indicator {
  width: 6px;
  height: 6px;
  background: #ffd700;
  border-radius: 50%;
  margin-top: 4px;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

.selected-date-details {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.details-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.freebies-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.freebie-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.freebie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.freebie-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.freebie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.freebie-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.freebie-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.platform {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #48bb78;
  color: white;
}

.status.trial {
  background: #ed8936;
  color: white;
}

.status.permanent {
  background: #9f7aea;
  color: white;
}

.status.limited {
  background: #f56565;
  color: white;
}

.freebie-description {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.freebie-price {
  display: flex;
  gap: 12px;
  align-items: center;
}

.original-price {
  color: #a0aec0;
  text-decoration: line-through;
  font-size: 14px;
}

.free-price {
  color: #48bb78;
  font-weight: 600;
  font-size: 16px;
}

.claim-button {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.claim-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.claim-button.disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

.today-freebies {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.today-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.today-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.today-freebie {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.today-freebie:hover {
  background: #edf2f7;
}

.today-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.today-info {
  flex: 1;
}

.today-freebie-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.today-platform {
  font-size: 12px;
  color: #718096;
}

.today-claim-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.today-claim-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.today-claim-button:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

.no-freebies {
  text-align: center;
  color: #718096;
  padding: 20px;
}

@media (max-width: 768px) {
  .freebie-calendar {
    padding: 16px;
  }

  .calendar-date {
    min-height: 50px;
    padding: 8px 4px;
  }

  .date-number {
    font-size: 14px;
  }

  .freebie-card {
    flex-direction: column;
    text-align: center;
  }

  .freebie-image {
    width: 100%;
    height: 120px;
    align-self: center;
  }

  .claim-button {
    align-self: stretch;
  }

  .today-claim-button {
    width: 80px;
  }
}
</style>
