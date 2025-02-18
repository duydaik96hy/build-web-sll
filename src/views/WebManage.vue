<script setup lang="ts">
import { ref } from 'vue'
import { IWebInfomation } from '../model/webInfomation'

const list = ref<Array<IWebInfomation>>([])
const newWebDialog = ref<boolean>(false)
</script>

<template>
  <div class="web-manage">
    <h1 class="f-s-b">
      <span>{{ $t('webManage') }}</span>
      <button class="btn-3" @click="newWebDialog = true">{{ $t('addNewWeb') }}</button>
    </h1>
    <table>
      <thead>
        <tr>
          <td>{{ $t('webName') }}</td>
          <td>{{ $t('action') }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.name }}</td>
          <td>
            <button class="btn-3">{{ $t('edit') }}</button>
            <button class="btn-4">{{ $t('delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-if="list.length == 0">{{ $t('noData') }}</div>
    <el-dialog v-model="newWebDialog" modal-class="overide-animation">
      <span>It's a event Dialog</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="newWebDialog = false">Cancel</el-button>
          <el-button type="primary" @click="newWebDialog = false"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.web-manage {
  padding: 20px;
  .empty {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
</style>
