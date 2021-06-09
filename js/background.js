const config = {
  COIN_NAME: 'BTC',
  DISPLAY_INTERVAL: 15 * 1000,
  REQUEST_INTERVAL: 15 * 1000,
}

;(function () {
  chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'option.html' })
  })
})()

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....')
  scheduleRequest()
  startRequest()
})

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup....')
  startRequest()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  scheduleRequest()
  startRequest()
})

function scheduleRequest() {
  chrome.alarms.create('update', {
    when: Date.now() + config.REQUEST_INTERVAL,
  })
}

async function startRequest() {
  return fetchData().then((json) => {
    chrome.storage.local.get((data) => {
      const items = data[config.COIN_NAME] || []
      if (items.length > 10) items.splice(0, items.length - 10)
      items.push(json)
      data[config.COIN_NAME] = items
      chrome.storage.local.set(data)
    })
  })
}

function fetchData() {
  const endPoint = 'https://api.coin.z.com/public'
  const path = '/v1/ticker?symbol=BTC'
  return fetch(endPoint + path).then((res) => {
    if (!res || !res.ok) return {}
    return res.json()
  })
}
