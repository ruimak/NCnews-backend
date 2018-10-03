const app = require('./app');
const { PORT } =
  process.env.NODE_ENV === 'production' ? process.env : require('./config');

// app listening function
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});
