// npm install puppeteer

import puppeteer from 'puppeteer-extra'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const scraper = async () => {
  // authenticated proxy server info
  // 103.90.230.208:51639:proxymart51639:facebook99123
  const btUrl = 'http://157.15.86.30:8888/d3F7UM4D'
  const defaultBtUrl = 'http://' + btUrl.replace('http://', '').split('/')[0]
  const btUsername = 'P6CUL1w5'
  const btPassword = 'hwmvHFx3'

  // launch a browser instance with the

  // --proxy-server flag enabled

  const browser = await puppeteer.launch({
    headless: false,
    timeout: 150000000,
    executablePath: `D:/tool mkt/tool/test/chrome/win64-124.0.6367.60/chrome-win64/chrome.exe`,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    userDataDir: `D:/tool mkt/tool/test/puppeteer-data/test2`,
  })

  const page = await browser.newPage()
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
  await page.setUserAgent(userAgent)
  await timeout(200)
  await page.goto(btUrl, {
    waitUntil: 'networkidle2',
    timeout: 300000,
  })
  await timeout(1000)
  const url = await page.url()
  console.log(url)
  if (url.includes('login') || url.includes(btUrl)) {
    await page.type('input[name="username"]', btUsername)
    await page.type('input[name="password"]', btPassword)
    await page.click("input[id='login-button']")
    await page.waitForNetworkIdle()
  }

  await page.goto(defaultBtUrl + '/site', {
    waitUntil: 'networkidle2',
    timeout: 300000,
  })

  await page.click('button[title=添加站点]')
  await timeout(1000)
  await page.click('body form textarea[name=webname]')
  await timeout(1000)
  await page.keyboard.type('test.com:80', { delay: 10 })
  await timeout(1000)
  await page.click('body div.layui-layer-btn.layui-layer-btn- a.layui-layer-btn0')
  await timeout(3000)
  await page.goto(defaultBtUrl + '/site', {
    waitUntil: 'networkidle2',
    timeout: 300000,
  })

  await page.click('body div[id=bt_site_table] table tbody tr:nth-child(1) td:nth-child(6) a')

  // await timeout(1000);
  // await page.click(
  //   "body div.layui-layer-content >div >div.bt-w-menu.site-menu.pull-left >p:nth-child(15)"
  // );
  // await timeout(1000);
  // await page.click("#webedit-con button[name=add_proxy]");
  // await timeout(1000);
  // await page.keyboard.press("Tab");
  // await timeout(300);
  // await page.keyboard.press("Tab");
  // await timeout(300);
  // await page.keyboard.press("Tab");
  // await timeout(300);
  // await page.keyboard.press("ArrowRight");
  // await timeout(300);
  // await page.keyboard.type(127);

  // extract the IP the request comes from

  // and print it
}

scraper()
