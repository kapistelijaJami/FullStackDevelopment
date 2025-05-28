const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let faveBlog = null

  for (let blog of blogs) {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      faveBlog = blog
    }
  }
  return faveBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}