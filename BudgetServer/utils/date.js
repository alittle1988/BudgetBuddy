/* utils/date.js */
function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

module.exports = {
  getCurrentMonth,
};
