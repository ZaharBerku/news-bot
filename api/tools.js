module.exports = [
  {
    type: "function",
    function: {
      name: "serpapi_search",
      description:
        "This function facilitates web research by conducting a Google search query which retrieves data from Google's Knowledge Graph and organic search results. The Knowledge Graph is a vast database of interconnected facts about people, places, and things, enabling the answering of factual queries with a high degree of accuracy and reliability. This function can provide a wealth of verified information from various sources, including public data, licensed data, and direct contributions from content owners. It is ideal for obtaining precise answers to specific questions, as well as for comprehensive research that requires access to a wide range of web content and factual data. The call only if the final message requires it. Previous messages are not taken into account.",
      parameters: {
        type: "object",
        properties: {
          q: {
            type: "string",
            description:
              "The search query to be executed, crafted to extract in-depth, accurate, and pertinent information from both Google's Knowledge Graph and the broader web's organic search results.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "serpapi_news",
      description:
        "Facilitates news search using SerpAPI, akin to the functionality found in platforms like Google News. Users can execute search queries to retrieve relevant news, allowing them to stay informed about current events, trends, and topics of interest. This function serves as a valuable tool for accessing a curated collection of news articles, similar to the experience provided by dedicated news search features. It enables users to tailor their searches and obtain timely updates on a wide range of subjects directly through the SerpAPI service. The call only if the final message requires it. Previous messages are not taken into account.",
      parameters: {
        type: "object",
        properties: {
          q: {
            type: "string",
            description:
              "The search query used to fetch news, enabling users to specify their areas of interest and receive news articles matching their criteria.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
];
