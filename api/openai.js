require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news) => {

  const messages = [
    {
      role: "user",
      content: `Привіт GPT згенеруй та надішли телеграм пост, використовуючи цю інформацію - ${JSON.stringify(
        news
      )}, але створюй пост наче ти людина яка веде його і враховуй граматику та не допускай лексичних помилок, перепиши трохи текст своїми словами, але не міняй заголовок статі, використовуй теги, маркадауни та смайлики у вигляді візуальних символів і не використовуй привітання, якщо хочеш додати посилання на перше джерело, додавай його в текст статі не явно, але якщо це посилання на телеграм канал, нетреба це додавати і якщо використовується офіційна назва будь-якою мовою не треба її перекладати, на любе слово і не треба про більш детальну інформації і де можна це почитати. Дякую!`,
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
