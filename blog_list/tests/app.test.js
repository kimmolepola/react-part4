const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs
    .map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('if title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
  let blog = { ...helper.initialBlogs[0] };
  delete blog.title;
  let response = await api.post('/api/blogs').send(blog);
  expect(response.statusCode === 400 && response.statusMessage === 'Bad Request');
  blog = { ...helper.initialBlogs[0] };
  delete blog.url;
  response = await api.post('/api/blogs').send(blog);
  expect(response.statusCode === 400 && response.statusMessage === 'Bad Request');
  blog = { ...helper.initialBlogs[0] };
  delete blog.title;
  delete blog.url;
  response = await api.post('/api/blogs').send(blog);
  expect(response.statusCode === 400 && response.statusMessage === 'Bad Request');
});

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const blog = helper.initialBlogs[0];
  expect(blog.likes !== 0);
  delete blog.likes;
  const response = await api.post('/api/blogs').send(blog);
  expect(response.body.likes === 0);
});

test('content of blog post is saved correctly to the database', async () => {
  const blogsBefore = await api.get('/api/blogs');
  const response = await api.post('/api/blogs').send(helper.initialBlogs[0]);
  expect(response.statusCode === 201);
  expect(response.headers['content-type'].includes('application/json'));
  delete response.body.id;
  expect(_.isEqual(response.body, helper.initialBlogs[0]));
  const blogsAfter = await api.get('/api/blogs');
  expect(blogsAfter.body.length === blogsBefore.body.length + 1);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((x) => {
    expect(x.id).toBeDefined();
  });
});

test('blog list application returns the correct amount of blog posts in the JSON format', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
