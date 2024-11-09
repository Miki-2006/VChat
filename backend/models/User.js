const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    account: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    password: {type: String, required: true},
    // id: {type: String, required: true, unique: true}
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });

module.exports = mongoose.model('User', userSchema);