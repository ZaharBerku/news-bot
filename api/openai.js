const openaiPhoto = require("./openaiPhoto.js");
require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news, base64, numberOfChar) => {
  let isLogoTCH = "false";
  const lengthString = news && news.split(" ").length;

  // if (base64) {
  //   const checkLogo = await openaiPhoto(base64);
  //   isLogoTCH = checkLogo;
  // }

  const messages = [
    {
      role: "user",
      content: `GPT, уяви, що ти - український репортер, і зараз іде війна з росією. 
      Ми зосереджуємося лише на фактах без співчуття або безпекових рекомендацій щодо нашого ворога. 
      Використовуючи дані ${JSON.stringify(
        news
      )}, сформуй телеграм-пост. 
      Збережи оригінальний заголовок статті. Переформулюй текст стисло і ясно, зберігаючи основну інформацію.
       Використовуй коректну граматику та лексику. Додай до 3 тегів (писати слово для тега разом), використовуй 
       HTML-маркдауни та смайлики для кращої візуалізації. Якщо є необхідність додати посилання, вставляй їх як HTML-посилання, але уникай 
       додавання посилань на будь-які телеграм-канали. 
       Залиш офіційні назви без перекладу. Якщо у тексті є цитати, залиш їх як є і не 
       видаляй, завжди використовуй їх. Уникай надмірної деталізації та інструкцій де читати подальшу інформацію не потрібні. 
       Пост повинен бути не більше ніж на ${numberOfChar} символів і без побажань на кінець. Дякую.
      `,
    },
  ];

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview",
      messages: messages,
    }),
  };
  if (lengthString > 20) {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    ).then((res) => res.json());
    const responseMessage = response.choices[0].message;
    return { answer: responseMessage.content, isMedia: isLogoTCH };
  } else {
    return { answer: news, isMedia: isLogoTCH };
  }
};

module.exports = openaiapi;
