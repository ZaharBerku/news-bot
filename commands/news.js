// const createKeyboardCountry = (bot, chatId) => {
//   const countries = ["Poland", "Ukraine", "UK", "Germany", "France"];

//   const keyboard = countries.map((country) => {
//     return [{ text: country, callback_data: country }];
//   });

//   // return setInterval(() => {
//   //   bot.sendMessage(chatId, "Please select a country:", {
//   //     reply_markup: {
//   //       inline_keyboard: keyboard,
//   //     },
//   //   });
//   // }, 2000);
// };

const news = (bot, userInfo, chatId) => {
  if (userInfo.location) {
  } else {
    return createKeyboardCountry(bot, chatId);
  }
};

module.exports = news;
