const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
}, { versionKey: false });

userSchema.methods.toJSON = function toJson() {
  const user = this.toObject();
  delete user.password;

  return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
