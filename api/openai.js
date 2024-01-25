const openaiPhoto = require("./openaiPhoto.js");
require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news, base64) => {
  let isLogoTCH = "false";

  if (base64) {
    const checkLogo = await openaiPhoto(base64);
    isLogoTCH = checkLogo;
  }

  const messages = [
    {
      role: "user",
      content: `GPT, уяви що ти українськи репортер і що зараз іде війна з росією (і ми ні в якому разі не співчуваємо їм або ж даємо якісь рекомендаці для безпек, просто факти, якщо новини про нашого ворога) - використовуючи наведені дані ${JSON.stringify(
        news
      )}, сформуй телеграм-пост. Не треба вітатись. Збережи оригінальний заголовок статті, але переформулюй текст - тезісно і не треба багато води, щоб він звучав більш природно і людяно. Уникай граматичних та лексичних помилок. Включи теги, маркдауни та смайлики для кращої візуалізації. Якщо є необхідність додати посилання, вмонтуй його в текст, але уникай додавання посилань на телеграм-канали і взагалі будь-який текст, що може посилатись на інше джерело (наприклад ТСН). Офіційні назви залиш у первісній мові без перекладу та якщо у тексті використовуються цитати, не переписуй їх і не видаляй завжди використовуй їх. Надмірна деталізація та інструкції де читати подальшу інформацію не потрібні.
      Також якщо є якісь посилань на будь-який інший канал крім ТСН - вертай слово - "реклама". Дякую.
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

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  ).then((res) => res.json());
  const responseMessage = response.choices[0].message;
  return { answer: responseMessage.content, isMedia: isLogoTCH };
};

module.exports = openaiapi;
