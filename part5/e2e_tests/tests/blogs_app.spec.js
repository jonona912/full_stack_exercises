const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blogs app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Username One',
        username: 'us1',
        password: 'us1'
      }
    })

    await page.goto('http://localhost:5173')
  })

  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('username')
    await expect(locator).toBeVisible()
  })

  // npm test -- --project chromium

  test ('login form can be opened', async ({ page }) => {
    const usernameInput = page.getByLabel('username')
    await usernameInput.fill('us1')
    const passwordInput = page.getByLabel('password')
    await passwordInput.fill('us1')
    const loginButton = page.getByText('Login')
    await loginButton.click()
    const loggedInUser = page.getByText('Username One logged in')
    await expect(loggedInUser).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      const usernameInput = page.getByLabel('username')
      await usernameInput.fill('us1')
      const passwordInput = page.getByLabel('password')
      await passwordInput.fill('us1')
      const loginButton = page.getByText('Login')
      await loginButton.click()
      const loggedInUser = page.getByText('Username One logged in')
      await expect(loggedInUser).toBeVisible()
    })

    // test('a new blog can be created', async ({ page }) => {
    //   const newBlogButton = page.getByText('new blog')
    //   await newBlogButton.click()
    //   const titleInput = page.getByLabel('title:')
    //   await titleInput.fill('E2E Test Blog Title')
    //   const authorInput = page.getByLabel('author:')
    //   await authorInput.fill('E2E Test Blog Author')
    //   const urlInput = page.getByLabel('url:')
    //   await urlInput.fill('http://e2e.test/blog/url')
    //   const createButton = page.getByText('create')
    //   await createButton.click()
    //   const createdBlog = page.getByText('E2E Test Blog Title E2E Test Blog Author')
    //   await expect(createdBlog).toBeVisible()
    // })
    test('a new blog can be created', async ({ page }) => {
      // Wait for the "new blog" button to be visible and enabled
      const newBlogButton = page.getByRole('button', { name: 'new blog' })
      await expect(newBlogButton).toBeVisible()
      await newBlogButton.click()

      // Now wait for the form to appear
      const titleInput = page.getByLabel('title:')
      await expect(titleInput).toBeVisible()
      await titleInput.fill('Blog Title')

      const authorInput = page.getByLabel('author:')
      await authorInput.fill('Blog Author')

      const urlInput = page.getByLabel('url:')
      await urlInput.fill('http://e2e.test/blog/url')

      const createButton = page.getByRole('button', { name: 'create' })
      await createButton.click()

      const createdBlog = page.getByText('Blog Title by Blog Author')
      await expect(createdBlog).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        const newBlogButton = page.getByText('new blog')
        await expect(newBlogButton).toBeVisible()
        await newBlogButton.click()
        const titleInput = page.getByLabel('title:')
        await titleInput.fill('E2E Test Blog Title')
        const authorInput = page.getByLabel('author:')
        await authorInput.fill('E2E Test Blog Author')
        const urlInput = page.getByLabel('url:')
        await urlInput.fill('http://e2e.test/blog/url')
        const createButton = page.getByText('create')
        await createButton.click()
        const createdBlog = page.getByText('E2E Test Blog Title E2E Test Blog Author')
        await expect(createdBlog).toBeVisible()
      })

      test('it can be liked', async ({ page }) => {
        const viewButton = page.getByText('view')
        await viewButton.click()
        const likeButton = page.getByText('like')
        await likeButton.click()
        const likesText = page.getByText('likes 1')
        await expect(likesText).toBeVisible()
      })
    })

  })
})