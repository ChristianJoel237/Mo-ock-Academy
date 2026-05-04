const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Robert C. Martin', likes: 1 },
    { title: 'Blog 2', author: 'Robert C. Martin', likes: 2 },
    { title: 'Blog 3', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Blog 4', author: 'Robert C. Martin', likes: 0 }
  ]

  test('returns the author with most blogs and their count', () => {
    const result = listHelper.mostBlogs(blogs)
    
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})