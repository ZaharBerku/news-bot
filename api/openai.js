require("dotenv").config();
const tools = require("../helpers/tools.js");
const toolsFunc = require("../helpers/toolsFunc.js");

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news, bot, channelId) => {
  const messages = [
    {
      role: "user",
      content: `Привіт GPT згенеруй та надішли телеграм пост, використовуючи цю інформацію - ${JSON.stringify(
        news
      )}, але створюй пост наче ти людина яка веде його і враховуй граматику та не допускай лексичних помилок, переши трохи текст, використовуй теги, маркадауни та смайлики у вигляді візуальних символівґ і не використовуй привітання. Дякую!`,
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
      tools,
      tool_choice: "auto",
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  ).then((res) => res.json());
  const responseMessage = response.choices[0].message;

  const toolCalls = responseMessage.tool_calls;

  if (responseMessage.tool_calls) {
    const availableFunctions = toolsFunc;

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      await functionToCall(functionArgs, bot, channelId);
    }
  }
};

module.exports = openaiapi;
