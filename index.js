const TelegramApi = require("node-telegram-bot-api");
const news = require("./commands/news.js");
const clearIdInterval = require("./helpers/clearIdInterval.js");
require("dotenv").config();

const { TELEGRAM_BOT_TOKEN, CHANNEL_ID } = process.env;

const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });

let idInterval = null;
let prevTitle = null;
let isLoading = false;

const start = () => {
  bot.setMyCommands([
    {
      command: "/news",
      description: "Почати відслітковувати акруальні новини.",
    },
    { command: "/stop", description: "Зупинити відслітковувати новини." },
  ]);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    try {
      if (text?.startsWith("/news")) {
        if (idInterval) {
          clearIdInterval(idInterval);
        }
  
        idInterval = setInterval(async () => {
          if (!isLoading) {
            isLoading = true;
            const result = await news(prevTitle, bot, CHANNEL_ID);
            if (result) {
              const { lastNews } = result;
              prevTitle = lastNews?.title;
            }
            isLoading = false;
          }
        }, 5000);
        return bot.sendMessage(
          CHANNEL_ID,
          "Почав дивитись на новинами України."
        );
      }
      if (text?.startsWith("/stop")) {
        if (idInterval) {
          clearIdInterval(idInterval);
          return bot.sendMessage(CHANNEL_ID, "Генерація новин - призепинена.");
        }
      }
      return bot.sendMessage(chatId, "I don't understand you, try again!");
    } catch (e) {
      console.error(e);
      return bot.sendMessage(chatId, "There's been some kind of mistake!");
    }
  });
};

start();
