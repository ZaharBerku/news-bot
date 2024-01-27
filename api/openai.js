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
      content:
        "GPT, уяви, що ти - український репортер, і зараз іде війна з росією. Ми зосереджуємося лише на фактах без співчуття або безпекових рекомендацій для нашого ворога. Використовуючи дані " +
        JSON.stringify(news) +
        ", сформуй телеграм-пост, дотримуючись вказівок HTML-форматування:" +
        " - Використовуй `<b>` або `<strong>` для виділення жирним шрифтом." +
        " - Використовуй `<i>` або `<em>` для курсиву." +
        "- Використовуй `<code>` для вставки інлайнового коду." +
        "  - Використовуй `<s>`, `<strike>`, або `<del>` для тексту, що перекреслений." +
        "- Використовуй `<u>` для підкресленого тексту." +
        " - Для вставки блоків коду використовуй `<pre>`." +
        "Забезпеч, щоб всі HTML-теги були використані безпосередньо в тексті. Збережи оригінальний заголовок статті, використовуючи HTML-теги для заголовків. Переформулюй текст стисло і ясно, зберігаючи основну інформацію. Використовуй до 3 тегів без виділення словом 'Теги', використовуй HTML-маркдауни та смайлики для кращої візуалізації. Не додавай жодних посилань. Залиш офіційні назви без перекладу. Якщо у тексті є цитати, залиш їх як є, завжди використовуй їх. Уникай надмірної деталізації та інструкцій де читати подальшу інформацію - не потрібні. Пост повинен бути не більше ніж на " +
        numberOfChar +
        " символів і без побажань в кінець. Дякую.",
      // "GPT, уяви, що ти - український репортер, і зараз іде війна з росією. Ми зосереджуємося лише на фактах без співчуття або безпекових рекомендацій щодо нашого ворога. Використовуючи дані" +
      // JSON.stringify(news) +
      // ", сформуй телеграм-пост без використання блоків коду (таких як ```html ```) і забезпеч, щоб всі HTML-теги були використані безпосередньо в тексті і не треба писати Примітки в постах від себе тільки пост. Збережи оригінальний заголовку статті у вигляді HTML-заголовка. Переформулюй текст стисло і ясно, зберігаючи основну інформацію. Використовуй коректну граматику та лексику. Додай до 3 тегів (писати слово для тега разом і не треба виділяти теги словом -Теги), використовуй HTML-маркдауни та смайлики для кращої візуалізації. Ні в якому разі не додава ніяких посилань. Залиш офіційні назви без перекладу. Якщо у тексті є цитати, залиш їх як є і не видаляй, завжди використовуй їх. Уникай надмірної деталізації та інструкцій де читати подальшу інформацію - не потрібні. Пост повинен бути не більше ніж на" + numberOfChar + "символів і без побажань в кінець. Дякую.",
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
      max_tokens: 2000,
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
