require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news) => {
  const messages = [
    {
      role: "user",
      content: `GPT, використовуючи наведені дані ${JSON.stringify(
        news
      )}, сформуй телеграм-пост. Збережи оригінальний заголовок статті, але переформулюй текст, щоб він звучав більш природно і людяно. Уникай граматичних та лексичних помилок. Включи теги, маркдаун та смайлики для кращої візуалізації. Якщо є необхідність додати посилання на первинне джерело інформації, вмонтуй його в текст, але уникай додавання посилань на телеграм-канали і взагалі будь-який текст, що може посилатись на інше джерело ТІЛЬКИ посилання. Офіційні назви залиш у первісній мові без перекладу та якщо у тексті використовуються цитати, не переписуй їх. Надмірна деталізація та інструкції де читати подальшу інформацію не потрібні.
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
  return responseMessage.content;
};

module.exports = openaiapi;
