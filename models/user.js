import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
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

const User = model('user', userSchema);

export default User;
