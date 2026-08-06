const errorLogger = (err) => {
  console.error('Error:', err);
};

const debugLogger = (...message) => {
  console.debug('Debug:', ...message);
};

module.exports = {
  errorLogger,
  debugLogger
};
