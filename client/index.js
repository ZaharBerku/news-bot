const { TelegramClient, Api } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const input = require("input");
const detectMarkdownType = require("../helpers/detectMarkdownType");
const openaiapi = require("../api/openai");
require("dotenv").config();

const {
  API_HASH: apiHash,
  CHANNEL_ID,
  LISTEN_CHANNEL_ID,
  API_ID: apiId,
  SESSION_TOKEN,
  TELEGRAM_NAME,
} = process.env;

// const ACTIVE = "Вся Україна — ракетна небезпека";
// const DIACTIVETE = "Загроза минула — відбій повітряної тривоги.";

let idTimeout = null;
let medias = [];
let messagePost = null;
let base64 = null;

const stringSession = new StringSession(SESSION_TOKEN);

const client = new TelegramClient(stringSession, +apiId, apiHash, {
  connectionRetries: 5,
});
// +
//                 "\n\n" +
//                 (parseMode === "md" || parseMode === "md2"
//                   ? "[ІнфоШоТи](https://t.me/info_sho_tu)"
//                   : "<a href='https://t.me/info_sho_tu'>ІнфоШоТи</a>"),
async function authorize() {
  await client.connect();
  const isAuth = await client.checkAuthorization();

  if (isAuth) {
    console.log("I am logged in!");
  } else {
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    const seesion = client.session.save();
    console.log(seesion, "seesion");
    console.log(
      "I am connected to telegram servers but not logged in with any account. Let's autorize"
    );
  }
  return client;
}

const resetValues = () => {
  messagePost = null;
  base64 = null;
  medias = [];
  clearTimeout(idTimeout);
  idTimeout = null;
};

const sendPost = async (message, medias, parseMode) => {
  const cleanDialogIdString = CHANNEL_ID.replace("n", "");
  const dialogIdBigInt = BigInt(cleanDialogIdString);
  if (medias.length) {
    await client.sendFile(dialogIdBigInt, {
      file: medias,
      caption: message,
      parseMode,
    });
  } else if (message) {
    await client.sendMessage(dialogIdBigInt, {
      message: message,
      parseMode,
    });
  }
};

async function eventHandler(event) {
  const message = event.message;
  if (message) {
    if (!messagePost) {
      messagePost = message.message;
    }
    if (message.media) {
      medias.push(message.media);
    }
    if (!idTimeout) {
      idTimeout = setTimeout(async () => {
        try {
          const { answer, isMedia } = await openaiapi(
            messagePost || "",
            base64,
            medias.length ? 800 : 3000
          );
          const parseMode = detectMarkdownType(answer);
          console.log(
            {
              answer,
              isMedia,
              parseMode,
            },
            "openaiapi"
          );
          await sendPost(answer, medias, parseMode);
          resetValues();
        } catch (error) {
          console.log(error);
          await sendPost(messagePost, medias, "md");
          resetValues();
          await client.sendMessage(TELEGRAM_NAME, {
            message: "/news",
          });
        }
      }, 5000);
    }
  } else {
    resetValues();
    await client.sendMessage(TELEGRAM_NAME, {
      message: "/news",
    });
  }
}

async function run() {
  const client = await authorize();

  client.addEventHandler(
    (event) => eventHandler(event),
    new NewMessage({ chats: LISTEN_CHANNEL_ID.split(",") })
  );
}

module.exports = run;
