// Find Subtitles file and setup extension button
const setSrtUrlAndShowPageAction = async (details: {
  url: string
  tabId: string
  documentUrl: string
  originUrl: string
}): Promise<void> => {
  if (details?.url?.includes('.txt') && details.documentUrl && details.originUrl) {
    const { tabId } = details
    try {
      await browser.storage.local.set({ [`${tabId}SrtSrc`]: details.url })
      browser.pageAction.show(tabId)
    } catch (e) {
      // Do nothing if there's an error while setting the url
      return
    }
  }
}

browser.webRequest.onCompleted.addListener(setSrtUrlAndShowPageAction, {
  urls: ['https://v.vrv.co/*'],
})

// Download srt file on page Action Click
const downloadSRTFile = async (tab: { id: string; title: string }): Promise<void> => {
  let filename = 'subs.srt'
  let url

  try {
    const storage = await browser.storage.local.get()

    const { id, title } = tab
    url = storage[`${id}SrtSrc`]

    if (!title || !url) throw new Error('no info')

    const [episodeTitle] = title.split(title.includes(',') ? ',' : '-')
    filename = `${episodeTitle?.replace(/[/\\?%*:|"<>]/g, '')?.trim()}.srt`
  } catch (e) {
    // Do nothing if there's an error while getting the url or the tab title
    return
  }

  browser.downloads.download({
    method: 'GET',
    url,
    filename,
  })
}
browser.pageAction.onClicked.addListener(downloadSRTFile)

export {}
