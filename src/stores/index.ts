/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IBaseSettings, IUser } from '../electron/model/baseSetiings'
import { IWebInfomation } from '../electron/model/webInfomation'
import { InitWebInfo } from '../electron/model/dto/webInfoDto'

function editInfo(data: { type: string; data: any }) {
  if (window) {
    const win = window as any
    if (win.api) {
      console.log(win.api)
      win.api.send('edit-info', { type: data.type, data: JSON.stringify(data.data) })
    }
  }
}

export const Store = defineStore('setting', () => {
  const userInfo = ref<IUser | null>(null)
  const token = ref<string | null>(null)
  const listWeb = ref<Array<IWebInfomation>>([])
  const baseSetting = ref<IBaseSettings>({
    btInfo: {
      ipList: [],
      link: '',
      userName: '',
      password: '',
    },
    themeList: [],
    loginInfo: {
      username: '',
      password: '',
      rememberPwd: false,
    },
  })

  const initData = (data: any) => {
    if (data.userInfo) userInfo.value = data.userInfo
    if (data.token) userInfo.value = data.token
    if (data.baseSetting) userInfo.value = data.baseSetting
  }

  const editUserInfo = (user: IUser) => {
    userInfo.value = user
    editInfo({ type: 'userInfo', data: user })
  }

  const editToken = (t: string) => {
    token.value = t
    editInfo({ type: 'token', data: t })
  }

  const editBaseSetting = (data: IBaseSettings) => {
    baseSetting.value = data
    editInfo({ type: 'baseSetting', data: baseSetting.value })
  }

  const addWeb = (data: Partial<InitWebInfo>) => {
    if (listWeb.value.findIndex((x) => x.hostName === data.hostName) == -1) {
      listWeb.value.push(InitWebInfo.init(data))
    }
  }

  const editWeb = (data: IWebInfomation) => {
    const index: number = listWeb.value.findIndex((x) => x.hostName === data.hostName)
    if (index != -1) {
      listWeb.value = [
        ...listWeb.value.slice(0, index),
        { ...listWeb.value[index], ...data },
        ...listWeb.value.slice(index + 1),
      ]
    }
  }

  const deleteWeb = (hostName: keyof IWebInfomation) => {
    const index: number = listWeb.value.findIndex((x) => x.hostName === hostName)
    if (index != -1) {
      listWeb.value.splice(index, 1)
    }
  }

  return {
    userInfo,
    token,
    baseSetting,
    initData,
    editUserInfo,
    editToken,
    editBaseSetting,
    addWeb,
    editWeb,
    deleteWeb,
  }
})
