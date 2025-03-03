<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { Store } from '../stores'
import ITextField from '../components/ITextField.vue'
import router from '../router'
import { INotificationType } from '../main'
const store = Store()
const { proxy } = getCurrentInstance()

const loginInfo = ref({
  username: '',
  password: '',
})

if (store.baseSetting.loginInfo.rememberPwd)
  loginInfo.value = {
    username: store.baseSetting.loginInfo.username,
    password: store.baseSetting.loginInfo.password,
  }

const login = async () => {
  const res = await proxy.$http('post', '/authentications/login', {
    ...loginInfo.value,
  })
  if (res && res.type && res.type == INotificationType.error) {
    proxy.$notification(INotificationType.error, res.message)
  } else if (res) {
    proxy.$notification(INotificationType.success, proxy.$t('loginSuccess'), 2000)

    store.editUserInfo(res.data.user)
    store.editToken(res.data.access_token)
    setTimeout(() => {
      router.replace({ name: 'base-setting' })
    }, 2000)
  }
}
</script>
<template>
  <div class="login-bg">
    <div class="login-main">
      <img src="@/assets/logo.png" alt="logo" width="200" />
      <div>
        <div class="login">
          <ITextField :label="$t('account')" v-model="loginInfo.username"></ITextField>
          <ITextField :label="$t('pwd')" type="password" v-model="loginInfo.password"></ITextField>
          <div class="f-s-b" style="margin-top: 10px">
            <span class="f-s">
              <el-checkbox v-model="store.baseSetting.loginInfo.rememberPwd" size="large" />&nbsp;
              <span style="transform: translateY(1px)">{{ $t('rememberPwd') }}</span>
            </span>
            <span>{{ $t('forgetPwd') }}</span>
          </div>
          <div class="f-s" style="flex-direction: column; margin-top: 5vh">
            <button class="btn-1" @click="login">{{ $t('login') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-main {
  position: fixed;
  text-align: center;
  top: 50%;
  left: 50%;
  width: fit-content;
  min-width: 40vw;
  transform: translate(-50%, -50%);
  padding: 5vh 5vw;
  border-radius: 2vw;
  background-color: #f3f6fb;
  box-shadow:
    6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
  border: 1px solid #e8e8e8;
  z-index: 100;
}
.login-bg {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  z-index: 1;
  background: url('@/assets/bg.png') top left repeat;
}
@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    height: auto;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    height: 0;
  }
}

.show {
  animation: show 1 0.3s cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
}
.hide {
  animation: hide 1 0.01s cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
}

@media screen and (max-width: 800px) {
  .login-main {
    width: 90vw;
  }
}
</style>
