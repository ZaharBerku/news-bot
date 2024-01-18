const clearIdInterval = (idInterval) => {
  clearInterval(idInterval);
  idInterval = null;
};

module.exports = clearIdInterval;
