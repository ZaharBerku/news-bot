const Parser = require("rss-parser");
const openaiapi = require("../api/openai");

require("dotenv").config();

const parser = new Parser();

const { FEED_URL } = process.env;

const news = async (prevTitle, bot, channelId) => {
  const rss_feed = await parser.parseURL(FEED_URL);
  const news = rss_feed.items.filter((entry) => {
    const publishedDate = new Date(entry.pubDate);
    const currentDate = new Date();

    const twentyMinutesAgo = new Date(currentDate.getTime() - 30 * 60 * 1000);
    return publishedDate > twentyMinutesAgo;
  });
  const lastNews = news.at(0);
  console.log("prevTitle", new Date());
  if (lastNews && lastNews.title !== prevTitle) {
    await openaiapi(lastNews, bot, channelId);
    return {
      lastNews,
    };
  } else {
    return null;
  }
};

module.exports = news;
