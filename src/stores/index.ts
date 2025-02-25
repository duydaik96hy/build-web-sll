import { ref } from 'vue'
import { defineStore } from 'pinia'
import { IBaseSettings } from '../electron/model/baseSetiings'
import { IWebInfomation } from '../electron/model/webInfomation'
import { InitWebInfo } from '../electron/model/dto/webInfoDto'

export const Store = defineStore('setting', () => {
  const baseSetting = ref<IBaseSettings>({
    btInfo: {
      ipList: [],
      link: '',
      userName: '',
      password: '',
    },
    themeList: [],
  })

  const editBaseSetting = (data: IBaseSettings) => {
    baseSetting.value = data
  }

  const listWeb = ref<Array<IWebInfomation>>([])

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

  return { baseSetting, editBaseSetting, addWeb, editWeb, deleteWeb }
})
