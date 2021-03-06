import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import cors from 'cors';
import config from 'config';

import userRouter from './routes/user.js';
import mealRouter from './routes/meal.js';
import favoritesRouter from './routes/favorites.js';
import ownRouter from './routes/own.js';

const PORT = process.env.PORT || config.get('port') || 5000;
const DB_URL = config.get('dbUrl');

const app = express();

const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

mongoose.connect(DB_URL, dbConfig)
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use(fileUpload({}));

app.use('/api/users', userRouter);
app.use('/api/meal', mealRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/own', ownRouter);

app.get('/', (req, res) => res.send('Yo` Recipes API'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));