import { IWebType } from '../webInfomation'

export class InitWebInfo {
  webName = ''
  hostName = ''
  ip = ''
  type = IWebType.news
  theme = ''
  content = []
  logo = ''
  homePageSeoInfo = {
    title: '',
    description: '',
    keyword: '',
  }
  listPageSeoInfo = {
    title: '',
    description: '',
    keyword: '',
  }
  detailPageSeoInfo = {
    title: '',
    description: '',
    keyword: '',
  }
  contact = {
    phone: '',
    email: '',
  }
  proxy = {
    url: '',
    userName: '',
    password: '',
  }

  static init = (src?: Partial<InitWebInfo>): InitWebInfo => {
    const obj = new InitWebInfo()
    return {
      ...obj,
      ...src,
    }
  }
}
