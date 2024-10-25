const { TelegramClient, Api } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");
const input = require("input");
const detectMarkdownType = require("../helpers/detectMarkdownType");
const openaiapi = require("../api/openai");
require("dotenv").config();

Sentry.init({
  dsn: "https://226a2d352a309c7d580b264926e16caf@o4506622533959680.ingest.sentry.io/4506722310619136",
  integrations: [new ProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const {
  API_HASH: apiHash,
  CHANNEL_ID,
  LISTEN_CHANNEL_ID,
  API_ID: apiId,
  SESSION_TOKEN,
} = process.env;

let idTimeout = null;
let idNotSend = null;
let queue = {};

const stringSession = new StringSession(SESSION_TOKEN);

const client = new TelegramClient(stringSession, +apiId, apiHash, {
  connectionRetries: 5,
});

async function authorize() {
  try{
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
  }catch(error){
    console.log(error, 'error')
  }

}

const resetValues = () => {
  queue = {};
  clearTimeout(idTimeout);
  idTimeout = null;
};

const sendPost = async (message, medias, parseMode) => {
  const cleanDialogIdString = CHANNEL_ID.replace("n", "");
  const dialogIdBigInt = BigInt(cleanDialogIdString);
  const linkInEndMessage =
    parseMode !== "md"
      ? "\n\n" +
        (parseMode === "md2"
          ? "[ІнфоШоТи | Новини України | Повітряні тривоги](https://t.me/info_sho_tu)"
          : "<a href='https://t.me/info_sho_tu'>ІнфоШоТи | Новини України | Повітряні тривоги</a>")
      : "";
  if (medias.length) {
    await client.sendFile(dialogIdBigInt, {
      file: medias,
      caption: message + linkInEndMessage,
      parseMode,
    });
  } else if (message) {
    await client.sendMessage(dialogIdBigInt, {
      message: message.length >= 3000 ? message : message + linkInEndMessage,
      parseMode,
    });
  }
};

const fetchSendPost = async (messagePost = "", medias = [], name) => {
  try {
    const parseMode = detectMarkdownType(messagePost);
    await sendPost(messagePost, medias, parseMode);
  } catch (error) {
    console.log(error, "error");

    await sendPost(messagePost, medias, "md");
  } finally {
    const { [name]: alreadySend, ...lastQueue } = queue;
    queue = lastQueue || {};
  }
};

async function eventHandler(event) {
  const message = event.message;
  const groupId = message.groupedId?.value || message.id;
  if (
    !message.message.includes("monobank") &&
    groupId !== idNotSend &&
    !message.replyTo &&
    !message.replyMarkup
  ) {
    queue = { ...queue, [groupId]: queue[groupId] || {} };
    if (message) {
      if (!queue[groupId]?.messagePost) {
        queue[groupId].messagePost = message.message;
      }
      if (message.media) {
        queue[groupId].medias = [
          ...(queue[groupId].medias || []),
          message.media,
        ];
      }
      if (idTimeout) {
        clearTimeout(idTimeout);
        idTimeout = null;
      }
      idTimeout = setTimeout(async () => {
        await Promise.allSettled(
          Object.entries(queue).map(([name, post]) =>
            fetchSendPost(post.messagePost, post.medias, name)
          )
        );
      }, 5000);
    } else {
      resetValues();
    }
  } else {
    idNotSend = groupId;
  }
}

async function run() {
  console.log(client.connected, client, "client.connected");
  if (!client.connected) {
    const authClient = await authorize();

    authClient.addEventHandler(
      eventHandler,
      new NewMessage({ chats: LISTEN_CHANNEL_ID.split(",") })
    );
  }
}

module.exports = run;
