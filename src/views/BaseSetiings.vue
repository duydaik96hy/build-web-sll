<script lang="ts" setup>
import { ref, watch } from 'vue'
import { IBaseSettings } from '../electron/model/baseSetiings'
import { Store } from '../stores'

const store = Store()

const baseSettings = ref<IBaseSettings>(store.baseSetting)
const ipList = ref<Array<Array<string>>>([])
const addIp = () => {
  ipList.value.push(Array.from({ length: 5 }))
}
const ipFormat = (value: string) => {
  let n = value.replace(/\D/, '')
  if (Number(n) > 256) n = '256'
  return n
}

const timeout = ref<NodeJS.Timeout>()

watch(ipList.value, (n) => {
  const list: Array<string> = []
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    n.forEach((x) => {
      let flag = true
      x.forEach((i, k) => {
        if (k < 3 && !i) flag = false
      })
      if (flag) {
        if (!!x[4]) {
          const length: number = Number(x[4]) - Number(x[3])
          Array.from({ length: Math.abs(length) + 1 }).forEach((i, k) => {
            list.push(
              [...x.slice(0, 3), length > 0 ? Number(x[3]) + k : Number(x[3]) - k].join('.'),
            )
          })
        } else {
          list.push(x.slice(0, 4).join('.'))
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
      <button class="btn-3">{{ $t('save') }}</button>
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
