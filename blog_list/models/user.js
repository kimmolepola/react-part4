const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {
    type: String, required: true, minlength: 3, unique: true,
  },
  name: String,
  passwordHash: { type: String },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    /* eslint-enable no-param-reassign, no-underscore-dangle */
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
