import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const response: any = await myFetch("https://www.aquafeed.com/newsroom/news/")
  const $ = cheerio.load(response)
  const news: NewsItem[] = []

  $(".list-group-flush li").each((_, el) => {
    const $el = $(el)
    const $link = $el.find("a")
    const url = "https://www.aquafeed.com" + $link.attr("href")
    const title = $link.find("h4").text().trim()
    const dateStr = $link.find("time").attr("datetime")
    const description = $link.find(".text-muted p").text()

    if (url && title && dateStr) {
      news.push({
        url,
        title,
        id: url,
        description,
        pubDate: new Date(dateStr).valueOf()
      })
    }
  })

  return news.sort((a, b) => b.pubDate! - a.pubDate!)
})