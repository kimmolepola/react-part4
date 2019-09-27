const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  try {
    const savedBlog = await blog.save();
    response.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

/* const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error });
  }
};
 */

module.exports = blogsRouter;
