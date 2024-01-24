const tools = [
  {
    type: "function",
    function: {
      name: "send_message",
      description:
        "To send posts to a Telegram channel that contains only text without video and photos",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Qualitatively generated content of telegram posts with emojis, tags and markdowns according to the text",
          },
        },
        required: ["message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_message_with_video",
      description:
        "To send posts to a Telegram channel that contains with text and video without photo",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Qualitatively generated content of telegram posts with emojis, tags and markdowns according to the text",
          },
          link: {
            type: "string",
            description: "Link to the video",
          },
        },
        required: ["message", "link"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_message_with_photo",
      description:
        "To send posts to a Telegram channel that contains with text and photo without video",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Qualitatively generated content of telegram posts with emojis, tags and markdowns according to the text",
          },
          link: {
            type: "string",
            description: "Link to the photo",
          },
        },
        required: ["message", "link"],
      },
    },
  },
];


module.exports = tools;
