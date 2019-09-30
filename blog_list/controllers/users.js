const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');


usersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request;
    if (!body.password) {
      response.status(400).send({ error: 'User validation failed: password: Path `password` is required.' });
      return;
    }
    if (body.password.length < 3) {
      response.status(400).send({ error: `User validation failed: password: Path \`password\` (\`${body.password}\`) is shorter than the minimum allowed length (3).` });
      return;
    }
    const saltRounds = 10;
    const passwordHash = await (bcrypt.hash(body.password, saltRounds));
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 });
    response.json(users.map((x) => x.toJSON()));
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
