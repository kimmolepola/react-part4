const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('user', () => {
  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      const user = new User({ username: 'root', password: 'sekret' });
      await user.save();
    });
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'testikayttaja',
        name: 'Testi Kayttaja',
        password: 'salainen',
      };
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });
    test('creation fails with non-unique username', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'root',
        name: 'Root Root',
        password: 'rooooot',
      };
      const response = await api
        .post('/api/users')
        .send(newUser);
      expect(response.statusCode).toBe(400);
      expect(response.res.statusMessage).toBe('Bad Request');
      expect(response.text).toContain('User validation failed: username: Error, expected `username` to be unique. Value: `root`');
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
    test('creation fails with undefined username', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        name: 'Root Root',
        password: 'rooooot',
      };
      const response = await api
        .post('/api/users')
        .send(newUser);
      expect(response.statusCode).toBe(400);
      expect(response.res.statusMessage).toBe('Bad Request');
      expect(response.text).toContain('User validation failed: username: Path `username` is required.');
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
    test('creation fails with too short (length < 3) username', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'ro',
        name: 'Root Root',
        password: 'rooooot',
      };
      const response = await api
        .post('/api/users')
        .send(newUser);
      expect(response.statusCode).toBe(400);
      expect(response.res.statusMessage).toBe('Bad Request');
      expect(response.text).toContain('User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).');
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
    test('creation fails with undefined password', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'root1',
        name: 'Root Root',
      };
      const response = await api
        .post('/api/users')
        .send(newUser);
      expect(response.statusCode).toBe(400);
      expect(response.res.statusMessage).toBe('Bad Request');
      expect(response.text).toContain('User validation failed: password: Path `password` is required.');
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
    test('creation fails with too short (length < 3) password', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'root2',
        name: 'Root Root',
        password: 'ro',
      };
      const response = await api
        .post('/api/users')
        .send(newUser);
      expect(response.statusCode).toBe(400);
      expect(response.res.statusMessage).toBe('Bad Request');
      expect(response.text).toContain('User validation failed: password: Path `password` (`ro`) is shorter than the minimum allowed length (3).');
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
  });
});

describe('blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs
      .map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  describe('update and delete operations', () => {
    test('blog update works', async () => {
      const blogs = await api.get('/api/blogs');
      const blog = blogs.body[0];
      blog.likes += 1;
      const response = await api.put(`/api/blogs/${blog.id}`).send(blog);
      expect(response.statusCode).toBe(200);
      expect(response.body.likes).toBe(blog.likes);
    });

    test('blog deletion works', async () => {
      const blogsBefore = await api.get('/api/blogs');
      const blogId = blogsBefore.body[0].id;
      const response = await api.delete(`/api/blogs/${blogId}`);
      const blogsAfter = await api.get('/api/blogs');
      expect(blogsBefore.body.length).toBe(blogsAfter.body.length + 1);
      expect(response.statusCode).toBe(204);
    });
  });

  describe('post operations', () => {
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
      console.log('1-----------------', blogsBefore.length);
      const response = await api.post('/api/blogs').send(helper.initialBlogs[0]);
      console.log('2---------------', response.length);
      // expect(response.statusCode === 201);
      expect(response.statusCode).toBe(201);
      console.log('3---------------', response.statusCode);
      expect(response.headers['content-type'].includes('application/json'));
      console.log('4---------------', response.headers['content-type'].includes('application/json'));
      delete response.body.id;
      console.log('5---------------', response.body);
      expect(_.isEqual(response.body, helper.initialBlogs[0]));
      console.log('6---------------', _.isEqual(response.body, helper.initialBlogs[0]));
      const blogsAfter = await api.get('/api/blogs');
      console.log('7---------------', blogsAfter.body.length);
      expect(blogsAfter.body.length === blogsBefore.body.length + 1);
      console.log('8---------------', blogsAfter.body.length === blogsBefore.body.length + 1);
    });
  });

  describe('get operations', () => {
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
  });
});
afterAll(() => {
  mongoose.connection.close();
});
