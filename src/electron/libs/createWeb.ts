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
    await page.type('input[name="password"]', baseSetiings.btInfo.password)
    await page.click("input[id='login-button']")
    await page.waitForNetworkIdle()
  }
  await page.close()
  return browser
}

export async function createNewWeb(baseSetiings: IBaseSettings, hostName: string) {
  try {
    const btUrl = baseSetiings.btInfo.link
    const defaultBtUrl = 'http://' + btUrl.replace('http://', '').split('/')[0]
    const browser = await launchBt(baseSetiings)
    const page = await browser.newPage()
    await page.goto(defaultBtUrl + '/site', {
      waitUntil: 'networkidle2',
      timeout: 300000,
    })

    await page.click('button[title=添加站点]')
    await timeout(1000)
    await page.click('body form textarea[name=webname]')
    await timeout(1000)
    await page.keyboard.type(hostName, { delay: 10 })
    await timeout(1000)
    await page.click('body div.layui-layer-btn.layui-layer-btn- a.layui-layer-btn0')
    await timeout(5000)
    await page.goto(defaultBtUrl + '/site', {
      waitUntil: 'networkidle2',
      timeout: 300000,
    })

    await timeout(2000)

    await page.click('body div[id=bt_site_table] table tbody tr:nth-child(1) td:nth-child(2) a')
    await timeout(2000)
    await page.waitForSelector(
      'body >div > div.layui-layer-content > div > div.bt-w-menu.site-menu.pull-left >p:nth-child(11)',
      { timeout: 5000 },
    )
    await page.click(
      'body >div > div.layui-layer-content > div > div.bt-w-menu.site-menu.pull-left >p:nth-child(11)',
    )
    await timeout(1000)
    await page.click('#ssl_tabs >span:nth-child(4)')
    await timeout(1000)
    await page.click('#ymlist li:nth-child(2) input')
    await timeout(1000)
    await page.click('#webedit-con > div.tab-con > div:nth-child(3) > div > button')
    await timeout(1000)
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
