const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const groups = lodash.groupBy(blogs, 'author')
    const authorsList = lodash.map(groups, (authorBlogs, authorName) => {
        return {
            author: authorName,
            blogs: authorBlogs.length
        }
    })

    return lodash.maxBy(authorsList, 'blogs')
} 
const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const groups = lodash.groupBy(blogs, 'author')
    const authorsLikesList = lodash.map(groups, (authorBlogs, authorName) => {
        return {
            author: authorName,
            likes: lodash.sumBy(authorBlogs, 'likes')
        }
    })

    return lodash.maxBy(authorsLikesList, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes 
}