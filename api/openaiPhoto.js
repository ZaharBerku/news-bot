require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (base64) => {
  const messages = [
    {
      role: "user",
      content: [
        {
          text: "Чи є на картинці ці три букв ТСН? Якщо так то верни просто => true, якщо ні то false і нічого іншого і яких слів тільки true або false",
          type: "text",
        },
        {
          image_url: {
            url: `data:image/jpeg;base64,${base64}`,
          },
          type: "image_url",
        },
      ],
    },
  ];

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
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
