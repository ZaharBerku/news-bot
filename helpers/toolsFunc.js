const sendMessage = (arg, bot, channelId) => {
  const { message } = arg;
  bot.sendMessage(channelId, message, { parse_mode: "Markdown" });
};
const sendMessageWithVideo = async (arg, bot, channelId) => {
  const { message, link } = arg;
  try {
    await bot.sendVideo(channelId, link, {
      caption: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    bot.sendMessage(channelId, message, { parse_mode: "Markdown" });
  }
};
const sendMessageWithPhoto = async (arg, bot, channelId) => {
  const { message, link } = arg;
  try {
    await bot.sendPhoto(channelId, link, {
      caption: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    bot.sendMessage(channelId, message, { parse_mode: "Markdown" });
  }
};

const toolsFunc = {
  send_message: sendMessage,
  send_message_with_video: sendMessageWithVideo,
  send_message_with_photo: sendMessageWithPhoto,
};

module.exports = toolsFunc;
