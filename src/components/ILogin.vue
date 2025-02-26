<script lang="ts" setup>
import { ref } from 'vue'
import { Store } from '../stores'
import ITextField from './ITextField.vue'
const store = Store()

const emit = defineEmits(['loginSuccess'])

const loginInfo = ref({
  userName: '',
  password: '',
})

const login = async () => {
  emit('loginSuccess')
  //   const res = await proxy.$http('post', '/login', {
  //     ...loginInfo.value,
  //     password: Base64.encode(loginInfo.value.password),
  //     isAdmin: props.isAdminPage
  //   })
  //   if (res && res.status == 200) {
  //     proxy.$notification({
  //       text: proxy.$t('loginSuccess'),
  //       type: 'success',
  //       customClass: 'success-alert',
  //       duration: 2000
  //     })
  //     if (props && props.isAdminPage) {
  //       props.loginSuccess()
  //     } else {
  //       localStorage.setItem('userInfo', JSON.stringify(res.data))
  //       store.updateUserInfo(res.data)
  //       setTimeout(() => {
  //         router.replace({ name: 'home' })
  //       }, 2000)
  //     }
  //   } else {
  //     proxy.$notification({
  //       text: proxy.$t('code.1000'),
  //       type: 'error',
  //       customClass: 'error-alert'
  //     })
  //   }
}
</script>
<template>
  <div class="login-main">
    <img src="@/assets/logo.png" alt="logo" width="200" />
    <div>
      <div class="login">
        <ITextField :label="$t('account')" v-model="loginInfo.userName"></ITextField>
        <ITextField :label="$t('pwd')" v-model="loginInfo.password"></ITextField>
        <div class="f-s-b" style="margin-top: 10px">
          <span>{{ $t('forgetPwd') }}</span>
        </div>
        <div class="f-s" style="flex-direction: column; margin-top: 5vh">
          <button class="btn-1" @click="login">{{ $t('login') }}</button>
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
  min-width: 40vw;
  transform: translate(-50%, -50%);
  padding: 5vh 5vw;
  border-radius: 2vw;
  background-color: #f3f6fb;
  box-shadow:
    6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
  border: 1px solid #e8e8e8;
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
