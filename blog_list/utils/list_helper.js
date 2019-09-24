const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce(((acc, cur) => acc + cur.likes), 0);

module.exports = { dummy, totalLikes };
