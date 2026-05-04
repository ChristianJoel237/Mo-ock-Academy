const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const blogs = [
    { title: 'Blog A', author: 'C. Joel', likes: 5 },
    { title: 'Blog B', author: 'Expert', likes: 12 },
    { title: 'Blog C', author: 'Junior', likes: 8 }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Blog B',
      author: 'Expert',
      likes: 12
    })
  })

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })
})