import puppeteer from 'puppeteer-extra'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { IBaseSettings } from '../model/baseSetiings'
import { ITheme } from '../model/webInfomation'
import { join } from 'path'

puppeteer.use(StealthPlugin())

export const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function launchBt(baseSetiings: IBaseSettings) {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 150000000,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  })
  const page = await browser.newPage()
  const btUrl = baseSetiings.btInfo.link
  await page.goto(btUrl, {
    waitUntil: 'networkidle2',
    timeout: 300000,
  })
  await timeout(1000)
  const url = await page.url()
  if (url.includes('login') || url.includes(btUrl)) {
    try {
      await page.waitForSelector(`input[name="username"]`)
    } catch (e) {
      console.log(e)
      await page.goto(btUrl, {
        waitUntil: 'networkidle2',
        timeout: 300000,
      })
      await timeout(1000)
    }
    await page.type('input[name="username"]', baseSetiings.btInfo.userName)
    await timeout(100)
    await page.type('input[name="password"]', baseSetiings.btInfo.password)
    await timeout(100)
    await page.click("button[class='login-form-button login-submit']")
    await page.waitForNavigation()
  }
  await page.close()
  return browser
}

export async function createNewWeb(
  baseSetiings: IBaseSettings,
  hostName: string,
  ip: string,
  proxy?: string,
) {
  try {
    const btUrl = baseSetiings.btInfo.link
    const defaultBtUrl = 'http://' + btUrl.replace('http://', '').split('/')[0]
    const browser = await launchBt(baseSetiings)
    const page = await browser.newPage()
    await page.goto(defaultBtUrl + '/site', {
      waitUntil: 'networkidle2',
      timeout: 300000,
    })

    await page.click(
      '#layout-main >div >div:nth-child(2) >div >div >div >div.flex.justify-between.flex-wrap >div:nth-child(1) >div:nth-child(1) > button.el-button.el-button--primary',
    )
    await timeout(1000)
    await page.click('#pane-domain >div >div.flex.items-end >div >div textarea')
    await timeout(1000)
    await page.keyboard.type(hostName, { delay: 10 })
    await timeout(1000)
    await page.click('#pane-domain >div >div.flex.items-end >button')
    await timeout(3000)
    await page.keyboard.press('Escape')
    await timeout(1000)
    await page.click('#tab-ssl')
    await timeout(1000)
    await page.click('#tab-letsEncryptList')
    await timeout(1000)
    await page.click(
      '#pane-letsEncryptList > div > div > div.flex.justify-between.flex-wrap > div:nth-child(1) > button',
    )
    await timeout(1000)
    await page.click('form > div:nth-child(2) > div > div > label > span.el-checkbox__input')

    await timeout(1000)
    await page.click('form > div:nth-child(3) > div.el-form-item__content > button')
    await timeout(1000)
    if (proxy) {
      await page.goto(defaultBtUrl + '/site', {
        waitUntil: 'networkidle2',
        timeout: 300000,
      })
      await timeout(300)
      await page.click(
        '#layout-main >div >div:nth-child(2) >div >div >div >div.flex.justify-between.flex-wrap >div:nth-child(1) >div:nth-child(1) > button.el-button.el-button--primary',
      )
      await timeout(300)
      await page.click('#tab-proxy')
      await timeout(1300)
      await page.click(
        '#pane-proxy > div > div > div.flex.justify-between.flex-wrap > div:nth-child(1) > button',
      )
      await timeout(300)
      await page.click('form > div:nth-child(2) > div > div > div:nth-child(1)')
      await timeout(300)
      await page.keyboard.type(hostName)
      await timeout(300)
      await page.click('form > div:nth-child(3) > div > div > div:nth-child(1)')
      await timeout(300)
      await page.keyboard.type(ip + ':' + proxy, { delay: 30 })
      await timeout(300)
      await page.keyboard.press('Tab')
      await timeout(300)
      await page.keyboard.type('$host')
      await timeout(300)
      await page.click(
        '#dialogBox > div > div > div > div > footer > div > div > button:nth-child(2)',
      )
    }
    await page.close()
  } catch (error) {
    console.log(error)
  }
}

export async function uploadTheme(baseSetiings: IBaseSettings, theme: ITheme, defaultDir: string) {
  const btUrl = baseSetiings.btInfo.link
  const defaultBtUrl = 'http://' + btUrl.replace('http://', '').split('/')[0]
  const browser = await launchBt(baseSetiings)
  const page = await browser.newPage()
  await page.goto(defaultBtUrl + '/site', {
    waitUntil: 'networkidle2',
    timeout: 300000,
  })
  await timeout(2000)
  await page.click('body div[id=bt_site_table] table tbody tr:nth-child(1) td:nth-child(6) a')

  await timeout(2000)
  await page.mouse.click(228, 100)
  await timeout(1000)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadFileEle: any = await page.waitForSelector(
    "body >div > div.layui-layer-content input[type='file']",
  )
  await uploadFileEle.uploadFile(join(defaultDir, 'themes', theme.fileName))
  let uploading = true
  page.on('response', async (response) => {
    if (response.url().includes('files?action=upload')) {
      const res = await response.json()
      if (res && res.status) {
        uploading = false
      }
    }
  })

  await page.click(
    'body >div > div.layui-layer-content > div.upload_file_gourp > button.btn.btn-success.btn-sm.startUpload',
  )
  await new Promise((resolve) => {
    const inter = setInterval(() => {
      if (!uploading) {
        clearInterval(inter)
        resolve(true)
      }
    }, 1000)
  })
  await timeout(2000)
  await page.click(
    'body >div > div.layui-layer-content > div.upload_file_gourp > button.btn.btn-defalut.btn-sm.cancelUpload',
  )
  await timeout(1000)
  await page.click(
    `#container > div.main-content > div.file_bodys > div.file_table_view.list_view > div.file_list_content >div[data-filename='${theme.fileName}'] >div:nth-child(2)`,
    { count: 2 },
  )
  await timeout(500)
  await page.click('body div.layui-layer-btn.layui-layer-btn- a.layui-layer-btn0')
  await timeout(500)
  await page.close()
  await browser.close()
}
