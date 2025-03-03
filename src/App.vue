<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Store } from './stores'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const store = Store()
const win: any = window
if (win && win.api) {
  win.api.send('init-data')
  win.api.receive('init-data', (data: any) => {
    store.initData(data)
    if (!data.token) {
      router.replace({ name: 'Login' })
    }
  })
}

const activeRouter: any = ref('base-setting')
const showSettingsDialog = ref(false)
const hideSelect = ref(false)

const navMenu = ref([
  {
    name: 'baseSetting',
    path: '/',
    pathName: 'base-setting',
  },
  {
    name: 'webManage',
    path: '/web-manage',
    pathName: 'web-manage',
  },
])
const isFirst = ref(false)
watch(route, (o, n) => {
  activeRouter.value = n.name
})
</script>

<template>
  <div class="main-bg">
    <!-- // -->
    <div class="main">
      <div class="base left">
        <div style="text-align: center; margin-bottom: 50px">
          <img src="@/assets/logo.png" width="200px" />
        </div>
        <ul>
          <li
            v-for="item in navMenu"
            :key="item.name"
            :class="{ active: item.pathName == activeRouter }"
            @click="proxy.$toPage(item.path)"
          >
            {{ $t(item.name) }}
          </li>
        </ul>
        <div class="setting">
          <div>
            <EleIcon icon="setting" :size="32" @click="showSettingsDialog = true" />
          </div>
          <!-- <p>v{{ setting.version }}</p> -->
        </div>
      </div>
      <div class="base right">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <el-dialog
        v-model="showSettingsDialog"
        width="80%"
        append-to-body
        top="2vh"
        @click="hideSelect = !hideSelect"
      >
        <template #header>
          <h3 style="font-size: 24px">
            {{ $t('setting') }}
          </h3>
        </template>
        <ISettings />
        <template #footer>
          <div>
            <button class="btn-4" @click="showSettingsDialog = false">
              {{ $t('cancel') }}
            </button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss">
@import url('@/assets/global.scss');
</style>

<style scoped lang="scss">
.loader {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  color: #fff;
  left: -160px;
  box-sizing: border-box;
  animation: shadowRolling 2s linear infinite;
}

@keyframes shadowRolling {
  0% {
    box-shadow:
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0);
  }
  12% {
    box-shadow:
      100px 0 #f06305,
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0);
  }
  25% {
    box-shadow:
      120px 0 #f06305,
      100px 0 #f06305,
      0px 0 rgba(255, 255, 255, 0),
      0px 0 rgba(255, 255, 255, 0);
  }
  36% {
    box-shadow:
      140px 0 #f06305,
      120px 0 #f06305,
      100px 0 #f06305,
      0px 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow:
      160px 0 #f06305,
      140px 0 #f06305,
      120px 0 #f06305,
      100px 0 #f06305;
  }
  62% {
    box-shadow:
      300px 0 rgba(255, 255, 255, 0),
      180px 0 #f06305,
      160px 0 #f06305,
      140px 0 #f06305;
  }
  75% {
    box-shadow:
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0),
      180px 0 #f06305,
      160px 0 #f06305;
  }
  87% {
    box-shadow:
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0),
      180px 0 #f06305;
  }
  100% {
    box-shadow:
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0),
      300px 0 rgba(255, 255, 255, 0);
  }
}
input {
  outline: none;
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  font-size: 18px;
}

:global(body) {
  cursor: url('@/assets/cursor-1.png'), pointer;
}
.loading {
  background: url('@/assets/bg.png') top left repeat;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.main {
  width: 100vw;
  height: 100vh;
  padding: 14px;
  box-sizing: border-box;
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .left,
  .right {
    height: 100%;
    position: relative;
  }
  .left {
    width: 300px;
    margin-right: 20px;
    background: url('@/assets/bg.png') top left repeat;
    li {
      text-transform: capitalize;
    }
    .active {
      background-color: #eee;
      border-left: 6px solid #f06305;
      position: relative;
      border-bottom: 1px solid #f06305;
      font-weight: 600;
      &::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: all 0.2s linear;
        border: 0 solid;
        border-width: 5px 10px;
        border-color: transparent transparent transparent #f06305;
      }
    }
    .setting {
      width: 100%;
      min-height: 100px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      p {
        margin: 10px 0;
        font-size: 18px;
      }
    }
  }
  .right {
    width: calc(100% - 320px);
    background-color: #f3f6fb;
    padding: 0;
    overflow: hidden;
    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ff7300;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #267e03;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 5px;
    }
  }
}
.select-lang {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
