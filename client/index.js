const { TelegramClient, Api } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const input = require("input");
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
  console.log(idTimeout, medias, messagePost, 'eventHandler');
  if (message) {
    if (!messagePost) {
      messagePost = message.message;
    }
    if (message.media) {
      medias.push(message.media);
    }
    if (messagePost && !idTimeout) {
      idTimeout = setTimeout(async () => {
        // if (medias.at(0)?.photo?.id) {
        //   const buffer = await client.downloadFile(
        //     new Api.InputPhotoFileLocation({
        //       id: medias.at(0).photo.id,
        //       accessHash: medias.at(0).photo.accessHash,
        //       fileReference: medias.at(0).photo.fileReference,
        //       thumbSize: "y",
        //     }),
        //     {
        //       dcId: medias.at(0).photo.dcId,
        //     }
        //   );
        //   base64 = buffer.toString("base64");
        // }

        try {
          const { answer, isMedia } = await openaiapi(
            messagePost,
            base64,
            medias.length ? 1000 : 4000
          );
          console.log({
            answer,
            isMedia,
          }, 'openaiapi');
          if (medias.length) {
            await client.sendFile(CHANNEL_ID, {
              file: medias,
              caption: answer,
              parseMode: "html",
            });
          } else {
            await client.sendMessage(CHANNEL_ID, {
              message: answer,
              parseMode: "html",
            });
          }

          messagePost = null;
          base64 = null;
          medias = [];
          clearTimeout(idTimeout);
          idTimeout = null;
        } catch (error) {
          console.log(error);
          messagePost = null;
          base64 = null;
          medias = [];
          clearTimeout(idTimeout);
          idTimeout = null;
          await client.sendMessage(TELEGRAM_NAME, {
            message: "/news",
          });
        }
      }, 5000);
    }
  } else {
    messagePost = null;
    base64 = null;
    medias = [];
    clearTimeout(idTimeout);
    idTimeout = null;
    await client.sendMessage(TELEGRAM_NAME, {
      message: "/news",
    });
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
