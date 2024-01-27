function detectMarkdownType(text) {
  if (/#+\s.*|(\*\*?|__?|~~).+?\1|\[.*?\]\(.*?\)/.test(text)) {
    return "md";
  }

  if (/\\[*_()[\]~`>#+-=|{}.!]/.test(text)) {
    return "md2";
  }

  if (/<\/?[a-z][\s\S]*>/i.test(text)) {
    return "html";
  }

  return "md";
}

module.exports = detectMarkdownType;
