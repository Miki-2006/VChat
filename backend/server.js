const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb')
const userRoutes = require('./routes/auth'); // Ваши маршруты
const cors = require('cors'); // Для разрешения запросов с другого домена (например, с React-приложения)

const app = express();
app.use( userRoutes);
const MongoDBuri = 'mongodb+srv://rys5ek0v111:evX6QaSgI8sJsbBr@cluster0.llzlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// Подключаемся к MongoDB
const client = new MongoClient(MongoDBuri);

client.connect()
  .then(() => {
    console.log('Подключено к MongoDB');
    db = client.db('test'); // Указываем базу данных
  })
  .catch(error => console.error('Ошибка подключения к MongoDB:', error));

// Настройка CORS для разрешения запросов с порта 3000
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Укажите заголовки, которые вы используете
  credentials: true // Если необходимо передавать cookies или заголовки авторизации
};

app.use(cors(corsOptions));

app.use(express.json());

// Обработка preflight-запросов
app.options('*', cors(corsOptions));

// Ваш основной маршрут
app.post('/api/register', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const { name, surname, account,  password } = req.body;

    // Добавляем данные в коллекцию users через insertOne
    const result = await db.collection('users').insertOne({ name, surname, account, password });

    res.status(201).json({ message: 'Пользователь зарегистрирован!', result });
  } catch (err) {
    console.error('Ошибка при добавлении данных:', err);
    res.status(500).json({ error: 'Ошибка регистрации пользователя' });
  }

});


app.post('/api/auth/verify', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const {registeredAccount, registeredAccountPassword} = req.body;

    const result = await db.collection('users').findOne({account: registeredAccount, password: registeredAccountPassword})
    if(!result){
      return res.status(404).json({ message: 'Пользователь не найден!' });
    }

    res.status(201).send({message: 'Пользователь найден', result})
  } catch (err) {
    console.error('Ошибка при верификации:', err);
    res.status(500).json({ error: 'Ошибка верификации пользователя' });
  }
})

app.get('/api/auth/find/:otherAccount', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const {otherAccount} = req.params

    const user = await db.collection('users').findOne({account: otherAccount})

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    } 
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
})


// Маршруты

app.get('/', (req, res) => {
  res.json("Hello!")
  // res.redirect('/api/register');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});