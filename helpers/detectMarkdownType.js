function detectMarkdownType(text) {
  if (/<\/?[a-z][\s\S]*>/i.test(text)) {
    return "html";
  }
  
  if (/#+\s.*|(\*\*?|__?|~~).+?\1|\[.*?\]\(.*?\)/.test(text)) {
    return "md";
  }

  if (/\\[*_()[\]~`>#+-=|{}.!]/.test(text)) {
    return "md2";
  }

  return "md";
}

module.exports = detectMarkdownType;
