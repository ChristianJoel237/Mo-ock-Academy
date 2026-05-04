const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Edsger W. Dijkstra', likes: 5 },
    { title: 'Blog 2', author: 'Robert C. Martin', likes: 10 },
    { title: 'Blog 3', author: 'Edsger W. Dijkstra', likes: 12 }
  ]

  test('returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    
    
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})