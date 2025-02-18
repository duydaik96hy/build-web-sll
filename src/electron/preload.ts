import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: unknown) => {
    // whitelist channels
    const validChannels: Array<string> = ['init-data', 'update']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  receive: (channel: string, func: Function) => {
    const validChannels: Array<string> = ['init-data', 'update']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
