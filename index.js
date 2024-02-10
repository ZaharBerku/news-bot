const TelegramApi = require("node-telegram-bot-api");
const runClient = require("./client/index.js");
require("dotenv").config();

const { TELEGRAM_BOT_TOKEN, USER_ID } = process.env;

const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });

const start = () => {
  bot.on('error', (error) => {
    console.log(error.code, 'error start');
  });
  
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
    if (!USER_ID.includes(msg.from.id)) {
      return;
    }

    try {
      if (text?.startsWith("/news")) {
        runClient();
        return;
      }
      return bot.sendMessage(chatId, "I don't understand you, try again!");
    } catch (e) {
      console.error(e);
      return bot.sendMessage(chatId, "There's been some kind of mistake!");
    }
  });
};

start();
