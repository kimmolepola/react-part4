const testInput = require('./test_input');
const listHelper = require('../utils/list_helper');


test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
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
