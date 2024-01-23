const { TelegramClient } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const openaiapi = require("../api/openai");
require("dotenv").config();

const {
  API_HASH: apiHash,
  CHANNEL_ID,
  LISTEN_CHANNEL_ID,
  API_ID: apiId,
  SESSION_TOKEN,
  SECOND_LISTEN_CHANNEL_ID,
} = process.env;

const ACTIVE = "Вся Україна — ракетна небезпека";
const DIACTIVETE = "Загроза минула — відбій повітряної тривоги.";

let idTimeout = null;
let medias = [];
let messagePost = null;

const stringSession = new StringSession(SESSION_TOKEN);

const client = new TelegramClient(stringSession, +apiId, apiHash, {
  connectionRetries: 5,
});

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

async function eventHandler(event) {
  const message = event.message;
  console.log(message, "message");
  if (message && message.message) {
    if (!messagePost) {
      messagePost = message.message;
    }
    if (message.media) {
      medias.push(message.media);
    }
    if (
      messagePost &&
      !idTimeout &&
      !messagePost.includes(ACTIVE) &&
      !messagePost.includes(DIACTIVETE)
    ) {
      idTimeout = setTimeout(async () => {
        const answer = await openaiapi(messagePost);
        if (medias.length) {
          await client.sendFile(CHANNEL_ID, {
            file: medias,
            caption: answer,
            parseMode: "md2",
          });
        } else {
          await client.sendMessage(CHANNEL_ID, {
            message: answer,
            parseMode: "md2",
          });
        }

        messagePost = null;
        medias = [];
        clearTimeout(idTimeout);
        idTimeout = null;
      }, 2000);
    } else if (messagePost) {
      const isAttac = messagePost.includes(ACTIVE);
      await client.sendMessage(CHANNEL_ID, {
        message: isAttac ? messagePost : "🟢 **ВІДБІЙ ПОВІТРЯНОЇ ТРИВОГИ** 🟢",
        parseMode: "md2",
      });
      messagePost = null;
      medias = [];
    } else {
      medias = [];
    }
  } else {
    run();
  }
}

async function run() {
  const client = await authorize();

  client.addEventHandler(
    (event) => eventHandler(event),
    new NewMessage({ chats: [LISTEN_CHANNEL_ID] })
  );
}

module.exports = run;
