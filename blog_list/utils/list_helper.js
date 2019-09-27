const _ = require('lodash');

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const grouped = _.groupBy(blogs, (x) => x.author);
  const mapped = _.mapValues(grouped, (x) => x.reduce((acc, cur) => acc + cur.likes, 0));
  const highest = _.maxBy(Object.keys(mapped), (x) => mapped[x]);
  return { author: highest, likes: mapped[highest] };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const grouped = _.groupBy(blogs, (x) => x.author);
  const highest = _.maxBy(Object.keys(grouped), (x) => grouped[x].length);
  return { author: highest, blogs: grouped[highest].length };
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let favBlog = blogs[0];
  blogs.forEach((blog) => {
    favBlog = blog.likes > favBlog.likes ? blog : favBlog;
  });
  return ({ title: favBlog.title, author: favBlog.author, likes: favBlog.likes });
};

const totalLikes = (blogs) => blogs.reduce(((acc, cur) => acc + cur.likes), 0);

const dummy = (blogs) => 1;

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
