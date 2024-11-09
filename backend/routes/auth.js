const express = require('express');
const User = require('../models/User'); // Подключение модели пользователя
const router = express.Router();

// Маршрут для регистрации пользователя
router.post('/register', async (req, res) => {
  const { name, username, account,  password } = req.body;

  try {
    // Проверка, существует ли пользователь с таким аккаунтом
    // const existingUser = await User.findOne({ account });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Account already exists' });
    // }

    // Создание нового пользователя
    const newUser = new User({ name, username, account,  password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

module.exports = router;
