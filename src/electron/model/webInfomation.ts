export enum IWebType {
  news = 'news',
  landingPage = 'landingPage',
}

export interface IWebContent {
  name: string
  link: string
}

export interface ITheme {
  name: string
  fileName: string
}

export interface IWebSeoInfo {
  title: string
  description: string
  keyword: string
}

export interface IProxy {
  url: string
  userName: string
  password: string
}

export interface IWebInfomation {
  id?: string
  webName: string
  hostName: string
  ip: string
  type: IWebType
  theme: string
  content: Array<IWebContent>
  logo: string
  homePageSeoInfo: IWebSeoInfo
  listPageSeoInfo: IWebSeoInfo
  contact: {
    phone: string
    email: string
    company?: string
  }
  proxy: IProxy
}
