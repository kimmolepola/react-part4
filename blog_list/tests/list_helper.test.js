const testInput = require('./test_input');
const listHelper = require('../utils/list_helper');

describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(null);
  });
  test('when list has only one blog equals that', () => {
    const result = listHelper.mostLikes([testInput.blogs[0]]);
    expect(result).toEqual(
      {
        author: 'Michael Chan',
        likes: 7,
      },
    );
  });
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(testInput.blogs);
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      },
    );
  });
});


describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  });
  test('when list has only one blog equals that', () => {
    const result = listHelper.mostBlogs([testInput.blogs[0]]);
    expect(result).toEqual(
      {
        author: 'Michael Chan',
        blogs: 1,
      },
    );
  });
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(testInput.blogs);
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3,
      },
    );
  });
});


describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });
  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog([testInput.blogs[0]]);
    expect(result).toEqual(
      {
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7,
      },
    );
  });
  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(testInput.blogs);
    expect(result).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    );
  });
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([testInput.blogs[0]]);
    expect(result).toBe(testInput.blogs[0].likes);
  });
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testInput.blogs);
    expect(result).toBe(36);
  });
});

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});
