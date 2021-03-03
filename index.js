const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const userRouter = require('./routes/user');
const mealRouter = require('./routes/meal');
const favoriteRouter = require('./routes/favorite');

const PORT = config.get('port') || 5000;
const DB_URL = config.get('dbUrl');

const app = express();

const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose.connect(DB_URL, dbConfig)
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/meal', mealRouter);
app.use('/api/favorites', favoriteRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));