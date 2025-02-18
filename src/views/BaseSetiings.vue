<script lang="ts" setup>
import { ref } from 'vue'
import { IBaseSettings } from '../model/baseSetiings'

const baseSettings = ref<IBaseSettings>({
  btInfo: {
    userName: '',
    password: '',
    link: '',
    ipList: [],
  },
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
