require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news) => {
  const messages = [
    {
      role: "user",
      content: `Привіт, ChatGPT! Зроби на основі цієї інформації пост для Телеграм каналу про новини України - ${JSON.stringify(
        news
      )}. І опиши цю новину більш делатьно. Дякую!`,
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

  const completion = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  ).then((res) => res.json());
  return completion.choices[0].message.content;
};

module.exports = openaiapi;
