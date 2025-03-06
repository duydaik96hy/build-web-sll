export enum IMethodType {
  Post = 'Post',
  Get = 'Get',
  Patch = 'Patch',
}

export enum IApiUrl {
  login = '/authentications/login',
  editUserInfo = '/users/',
}

export interface IBaseSettings {
  btInfo: {
    link: string
    userName: string
    password: string
    ipList: Array<Array<string>>
  }
  themeList: Array<string>
  loginInfo: {
    username: string
    password: string
    rememberPwd: boolean
  }
}

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  avatar: string
  username: string
  phone: string
  zalo?: string
  company?: string
  btInfo: {
    link: string
    userName: string
    password: string
    ipList: string[][]
  }
}
