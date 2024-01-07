require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
// const news = require("./commands/news.js");
const openaiapi = require("./api/openai.js");

const { TELEGRAM_BOT_TOKEN } = process.env;

const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });

const userInfo = {
  lang: "",
  location: "",
};

const start = async () => {
  bot.setMyCommands([
    {
      command: "/news",
      description: "Generate the most relevant news in your country",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text.startsWith("/news")) {
        const text= await openaiapi()
        return bot.sendMessage(chatId, text);
      }
      return bot.sendMessage(chatId, "I don't understand you, try again!)");
    } catch (e) {
      console.log(e, "e");
      return bot.sendMessage(chatId, "There's been some kind of mistake!)");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    userInfo.location = data;
  });
};

start();
