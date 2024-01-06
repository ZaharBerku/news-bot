const tools = require("./tools");
const OpenAI = require("openai");
const { getJson } = require("serpapi");
require("dotenv").config();

const { OPENAI_API_KEY, SERP_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const serpapiNews = async (params) => {
  const response = await getJson({
    api_key: SERP_API_KEY,
    tbm: "nws",
    location: "Ukraine",
    ...params,
  });
  return {
    news_results: response.news_results,
  };
};

const openaiapi = async () => {
  const messages = [
    {
      role: "user",
      content:
        "Привіт, ChatGPT! Мені потрібна інформація про найактуальніші новини з України. Будь ласка, використай свої інструменти пошуку для збору найсвіжіших новин, вибери одну з них, яка, на твою думку, є найважливішою чи цікавою, і напиши короткий пост для публікації в Telegram. Включи в цей пост посилання на джерела, з яких ти отримав цю інформацію. Пост створи ураїнською мовою. Пиши тільки пост, нічого зайвого. Дякую!",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    temperature: 0.5,
    messages,
    max_tokens: 4096,
    tool_choice: "auto",
    tools,
  });
  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
    const availableFunctions = {
      serpapi_news: serpapiNews,
    };
    messages.push(responseMessage);
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = await functionToCall(functionArgs);

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: JSON.stringify(functionResponse),
      }); // extend conversation with function response
    }
    const { choices } = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: messages,
    });
    console.log(choices, "functionResponse 2");

    return choices.at(0).message.content;
  }
};

module.exports = openaiapi;
