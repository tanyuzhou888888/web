<template>
  <div class="logo">
    <div class="logo_img">
      <img
        src="@/assets/image/logo.png"
        alt="" />
      <div class="title tw-h-full">
        <p class="chinese">COURSE MANAGEMENT SYSTEM </p>
      </div>
    </div>
    <div class="cool tw-w-[45px] tw-h-[45px] tw-rounded-[50%] tw-mr-[80px] tw-cursor-pointer">
      <img
        class="tw-w-full tw-h-full tw-rounded-[50%]"
        :src="
          userInfo?.userInfo?.avatarUrl ||
          'http://18.142.149.25/course-login-api/api/v1/file/451295543514365952'
        "
        alt=""
        @mouseenter="exit = true"
        @mouseleave="exit = false" />
    </div>
  </div>
  <div class="box tw-w-full">
    <Aside></Aside>
    <div class="main">
      <div class="tw-flex tw-w-full tw-h-[64px] tw-items-center">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item
            v-for="(item, index) in currentRouter"
            :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <transition name="el-zoom-in-top">
    <Exit v-model:show="exit"></Exit>
  </transition>
</template>

<script setup>
  import Aside from './components/aside/index.vue'
  import { ArrowRight } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useUserStore } from '@/stores/user'
  const userInfo = useUserStore()
  const route = useRoute()
  const currentRouter = computed(() => {
    console.log(route.meta.routerName)
    return route.meta.routerName.split('-')
  })
  const exit = ref(false)
</script>

<style lang="scss" scoped>
  .logo {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_img {
      display: flex;
      margin-left: 20px;
      height: 44px;
    }
    .title {
      margin-left: 18px;
      .chinese {
        line-height: 28px;
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #409dfe;
      }
      .english {
        font-size: 14px;
        letter-spacing: 1px;
        color: #409dfe;
      }
    }
  }
  .box {
    display: flex;
    height: calc(100% - 80px);
    .main {
      width: 100%;
      min-width: 1240px;
      height: 100%;
      background-color: #f5f7fa;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
      &_content {
        width: 100%;
        height: calc(100% - 64px);
        background-color: #ffffff;
        border-radius: 20px;
      }
    }
  }

  :deep(.el-breadcrumb) {
    .el-breadcrumb__item > span {
      line-height: 28px;
      font-size: 14px;
      color: #8c8c8c;
      letter-spacing: 0;
      font-weight: 500;
      &:hover {
        color: #4584f8;
      }
    }
    .el-breadcrumb__item[aria-current='page'] > span {
      line-height: 28px;
      font-size: 14px;
      color: #131314;
      letter-spacing: 0;
      font-weight: bold;
    }
  }
</style>
