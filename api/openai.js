const openaiPhoto = require("./openaiPhoto.js");
require("dotenv").config();

const { OPENAI_API_KEY } = process.env;

const openaiapi = async (news = "", numberOfChar) => {
  try {
    const lengthString = news && news.split(" ").length;

    const messages = [
      {
        role: "user",
        content:
          "GPT, уяви, що ти - український репортер, і зараз іде війна з росією. Ми зосереджуємося лише на фактах без співчуття або безпекових рекомендацій для нашого ворога. Використовуючи дані " +
          JSON.stringify(news) +
          ",сформуй телеграм-пост без використання блоків коду (таких як ```html ```), дотримуючись вказівок HTML-форматування:" +
          " - `<b>` або `<strong>` для виділення жирним шрифтом." +
          " - `<i>` або `<em>` для курсиву." +
          " - `<u>` для підкресленого тексту." +
          " - `<blockquote>` для виділення цитат людей з предоставленого контенту, не треба придумувати свої НІВЯКОМУ разі і переписуквати з контенту залиши цитати слово в слово." +
          "Забезпеч, щоб всі HTML-теги були використані безпосередньо в тексті. Збережи оригінальний заголовку статті у вигляді HTML-заголовка і завжди виділяй заголовок жирним шрифтом. Переформулюй текст стисло і ясно, зберігаючи основну інформацію і не треба писати Примітки в постах від себе тільки пост. Обов'язково враховуй граматику та не допускай лексичних помилок. Використовуй (необов'язково) до 3 тегів, без виділення словом 'Теги:' і завжди теги пишуться разом та з решіткою (#) на початку, використовуй HTML-маркдауни (необов'язково) та смайлики для кращої візуалізації. Не додавай жодних посилань. Залиш офіційні назви без перекладу. Якщо у тексті є цитати, залиш їх як є, завжди використовуй їх. Уникай надмірної деталізації та інструкцій де читати подальшу інформацію - не потрібні. Пост повинен бути не більше ніж на " +
          numberOfChar +
          " символів і без побажань в кінець, і не треба писати щось після тегів від себе. І завжди пиши з малької букви - росія, росії і т.д. Дякую.",
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
    if (news && lengthString > 20) {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        requestOptions
      ).then((res) => res.json());
      const responseMessage = response.choices[0].message;
      const [message] = responseMessage.content.split("Примітка:");
      return {
        answer: message.replace("```html", "").replace("```", ""),
      };
    } else {
      return { answer: news };
    }
  } catch (error) {
    throw Error(error);
  }
};

module.exports = openaiapi;
