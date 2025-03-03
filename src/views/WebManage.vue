<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { IWebInfomation, IWebType } from '../electron/model/webInfomation'
import { InitWebInfo } from '../electron/model/dto/webInfoDto'
import { FormInstance } from 'element-plus'
import { INotificationType } from '../main'

const list = ref<Array<IWebInfomation>>([])
const formRef = ref<FormInstance>()
const newWebDialog = ref<boolean>(false)
const newWeb = ref<IWebInfomation>(InitWebInfo.init())
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { proxy }: any = getCurrentInstance()
const ipList = ref<Array<string>>(['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4'])
const webTypeList = ref<Array<{ label: string; value: IWebType }>>([
  { label: 'Tin tức', value: IWebType.news },
  { label: 'Landing Page', value: IWebType.landingPage },
])
const webThemeList = ref<Array<{ label: string; value: IWebType }>>([
  { label: 'Tin tức', value: IWebType.news },
  { label: 'Landing Page', value: IWebType.landingPage },
])

const formRules = {
  required: [
    {
      required: true,
      message: 'Không được để trống !',
      trigger: 'blur',
    },
  ],
  requiredChange: [
    {
      required: true,
      message: 'Không được để trống !',
      trigger: 'change',
    },
  ],
}

const submit = (formEle: FormInstance | undefined) => {
  if (!formEle) return
  formEle.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      proxy.$notification(
        INotificationType.error,
        'Vui lòng điền những trường bắt buộc còn trống !',
      )
    }
  })
}

const addWebContent = () => {
  newWeb.value.content.push({
    name: '',
    link: '',
  })
}
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
          <td>{{ item.hostName }}</td>
          <td>
            <button class="btn-3">{{ $t('edit') }}</button>
            <button class="btn-4">{{ $t('delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-if="list.length == 0">{{ $t('noData') }}</div>
    <el-dialog v-model="newWebDialog" modal-class="overide-animation" class="dialog" width="70vw">
      <div>
        <h3>Thêm trang web mới</h3>
        <el-form
          :model="newWeb"
          label-width="auto"
          style="max-width: 1068px; height: 600px; overflow: auto"
          ref="formRef"
        >
          <el-form-item
            v-for="item in ['webName', 'hostName', 'logo']"
            :key="item"
            :prop="item"
            :label="$t(item)"
            :rules="formRules.required"
          >
            <el-input v-model="newWeb[item]" />
          </el-form-item>
          <el-form-item label="IP" prop="ip" :rules="formRules.requiredChange">
            <el-select v-model="newWeb.ip" placeholder="Chọn Ip cho trang web">
              <el-option v-for="item in ipList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label="Thể loại" prop="type" :rules="formRules.requiredChange">
            <el-select
              v-model="newWeb.type"
              placeholder="Chọn thể loại cho trang web"
              :rules="formRules.required"
            >
              <el-option
                v-for="item in webTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Theme Web" :rules="formRules.requiredChange">
            <el-select v-model="newWeb.theme" placeholder="Chọn Theme cho trang web">
              <el-option
                v-for="item in webThemeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Nội dung chèn vào bài viết">
            <table style="margin-top: 0">
              <thead>
                <tr>
                  <td>Tên</td>
                  <td>Link</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, k) in newWeb.content" :key="k">
                  <td>
                    <el-input v-model="item.name" :placeholder="$t('contentName')" clearable />
                  </td>
                  <td>
                    <el-input v-model="item.link" :placeholder="$t('contentLink')" clearable />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="f-c" style="width: 100%">
              <div class="btn-3" @click="addWebContent" style="padding: 2px 20px">Thêm</div>
            </div>
          </el-form-item>
          <el-form-item
            label="TDK của trang chủ"
            :prop="[
              'homePageSeoInfo.title',
              'homePageSeoInfo.description',
              'homePageSeoInfo.keyword',
            ]"
            :rules="formRules.required"
          >
            <el-input v-model="newWeb.homePageSeoInfo.title" placeholder="Title trang web" />
            <el-input
              v-model="newWeb.homePageSeoInfo.description"
              placeholder="Description trang web"
            />
            <el-input v-model="newWeb.homePageSeoInfo.keyword" placeholder="Keyword trang web" />
          </el-form-item>
          <br />
          <el-form-item
            label="TDK của trang danh sách bài"
            :prop="[
              'homePageSeoInfo.title',
              'homePageSeoInfo.description',
              'homePageSeoInfo.keyword',
            ]"
            :rules="formRules.required"
          >
            <el-input v-model="newWeb.listPageSeoInfo.title" placeholder="Title trang web" />
            <el-input
              v-model="newWeb.listPageSeoInfo.description"
              placeholder="Description trang web"
            />
            <el-input v-model="newWeb.listPageSeoInfo.keyword" placeholder="Keyword trang web" />
          </el-form-item>
          <br />
          <el-form-item label="Thông tin liên hệ">
            <el-input v-model="newWeb.contact.email" placeholder="Email" />
            <el-input v-model="newWeb.contact.phone" placeholder="Điện thoại" />
            <el-input v-model="newWeb.contact.company" placeholder="Tên công ty" />
          </el-form-item>
          <el-form-item label="Proxy">
            <el-input v-model="newWeb.proxy.url" placeholder="Url" />
            <el-input v-model="newWeb.proxy.userName" placeholder="Username" />
            <el-input v-model="newWeb.proxy.password" placeholder="Password" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div class="btn-4" @click="newWebDialog = false">Hủy bỏ</div>
          <div class="btn-3" type="primary" @click="submit(formRef)">Thêm</div>
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
  .dialog {
    table {
      td {
        padding: 0;
        width: 50%;
      }
    }
  }
}
</style>
