const app = require("./app");

const { PORT } = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : require("./config");

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});
