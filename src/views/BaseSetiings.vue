<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { IApiUrl, IBaseSettings, IMethodType } from '../electron/model/baseSetiings'
import { Store } from '../stores'

const instance = getCurrentInstance()
const proxy: any = instance?.proxy
const store = Store()

const baseSettings = ref<IBaseSettings>(store.baseSetting)
if (store.userInfo) {
  baseSettings.value.btInfo = store.userInfo.btInfo
}
const ipList = ref<Array<Array<string | unknown>>>(initIpList(baseSettings.value.btInfo.ipList))
const timeout = ref<NodeJS.Timeout>()

function initIpList(list: Array<Array<string>>) {
  const returnList: Array<Array<string>> = []
  list.forEach((x) => {
    if (x.length != 1) {
      const firstIp = x[0].split('.')
      const lastIp = x[x.length - 1].split('.')
      const mergeIp = [...x.slice(0, 3), firstIp[3], lastIp[3]]
      returnList.push(mergeIp)
    } else {
      returnList.push(x[0].split('.'))
    }
  })
  return returnList
}
const addIp = () => {
  ipList.value.push(Array.from({ length: 5 }))
}

const save = async () => {
  store.editBaseSetting(baseSettings.value)
  await proxy?.$http(IMethodType.Patch, IApiUrl.editUserInfo + '/' + store.userInfo?.id, {
    btInfo: baseSettings.value.btInfo,
  })
}
const ipFormat = (value: string) => {
  let n = value.replace(/\D/, '')
  if (Number(n) > 256) n = '256'
  return n
}

watch(ipList.value, (n: Array<Array<string | unknown>>) => {
  const list: Array<Array<string>> = []
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    n.forEach((x: Array<string | unknown>) => {
      let flag = true
      x.forEach((i, k) => {
        if (k < 3 && !i) flag = false
      })
      if (flag) {
        if (!!x[4]) {
          const length: number = Number(x[4]) - Number(x[3])
          const childList: Array<string> = []
          Array.from({ length: Math.abs(length) + 1 }).forEach((i, k) => {
            childList.push(
              [...x.slice(0, 3), length > 0 ? Number(x[3]) + k : Number(x[3]) - k].join('.'),
            )
          })
          list.push(childList)
        } else {
          list.push([x.slice(0, 4).join('.')])
        }
      }
    })
    baseSettings.value.btInfo.ipList = list
  }, 500)
})
</script>
<template>
  <div class="base-settings">
    <div class="f-s">
      <p>{{ $t('linkBt') }}</p>
      <el-input
        v-model="baseSettings.btInfo.link"
        :placeholder="$t('typeLinkBtPlease')"
        clearable
      />
    </div>
    <div class="f-s">
      <p>{{ $t('account') }}</p>
      <el-input
        v-model="baseSettings.btInfo.userName"
        :placeholder="$t('typeAccountPlease')"
        clearable
      />
    </div>
    <div class="f-s">
      <p>{{ $t('pwd') }}</p>
      <el-input
        v-model="baseSettings.btInfo.password"
        :placeholder="$t('typePasswordPlease')"
        clearable
      />
    </div>
    <div>
      <p>{{ $t('ipList') }} - {{ baseSettings.btInfo.ipList.length }}&nbsp;IP</p>
      <div v-for="(item, k) in ipList" :key="k">
        <el-input
          v-model="item[0]"
          style="width: 66px"
          :formatter="(v) => ipFormat(v)"
          maxlength="3"
          clearable
        />
        <el-input
          v-model="item[1]"
          :formatter="(v) => ipFormat(v)"
          style="width: 66px"
          maxlength="3"
          clearable
        />
        <el-input
          v-model="item[2]"
          :formatter="(v) => ipFormat(v)"
          style="width: 66px"
          maxlength="3"
          clearable
        />
        <el-input
          v-model="item[3]"
          :formatter="(v) => ipFormat(v)"
          style="width: 66px"
          maxlength="3"
          clearable
        />
        -
        <el-input
          v-model="item[4]"
          :formatter="(v) => ipFormat(v)"
          style="width: 66px"
          maxlength="3"
          clearable
        />
      </div>
      <br />
      <button class="btn-3" @click="addIp">{{ $t('addIp') }}</button>
    </div>
    <div class="f-c action-btn">
      <button class="btn-3" @click="save">{{ $t('save') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-settings {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .action-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 80px;
    width: 100%;
  }
}
</style>
