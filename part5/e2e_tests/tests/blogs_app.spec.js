const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, createUser } = require('./helper')

describe('Blogs app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    // await request.post('/api/users', {
    //   data: {
    //     name: 'Username One',
    //     username: 'username1',
    //     password: 'username1'
    //   }
    // })

    await createUser(request, 'Username One', 'username1', 'username1')

    await page.goto('/') // baseURL is set in playwright.config.js, so this will go to http://localhost:5173/
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('username')
    await expect(locator).toBeVisible()
  })

  // npm test -- --project chromium

  test ('login form can be opened', async ({ page }) => {
    await loginWith(page, 'username1', 'username1')
    const loggedInUser = page.getByText('Username One logged in')
    await expect(loggedInUser).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    // const usernameInput = page.getByLabel('username')
    // await usernameInput.fill('username1')
    // const passwordInput = page.getByLabel('password')
    // await passwordInput.fill('wrongpassword')
    await loginWith(page, 'username1', 'wrongpassword')
    // Listen for the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Wrong username or password')
      await dialog.accept()
    })
    // const loginButton = page.getByText('Login')
    // await loginButton.click()
    await expect(page.getByText('Username One logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'username1', 'username1')
      const loggedInUser = page.getByText('Username One logged in')
      await expect(loggedInUser).toBeVisible()
    })

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
        await createBlog(page, 'E2E Test Blog Title', 'E2E Test Blog Author', 'http://e2e.test/blog/url')
        const createdBlog = page.getByText('E2E Test Blog Title by E2E Test Blog Author')
        await expect(createdBlog).toBeVisible()
      })

      test('it can be liked', async ({ page }) => {
        const viewButton = page.getByText('view')
        await viewButton.click()
        const likeButton = page.getByText('like')
        await likeButton.click()
        const likesText = page.getByText('likes: 1')
        await expect(likesText).toBeVisible()
      })
      test('it can be deleted by the user who created it', async ({ page }) => {
        const viewButton = page.getByText('view')
        await viewButton.click()
        const deleteButton = page.getByText('delete')
        await page.pause()

        await Promise.all([
          page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Remove blog "E2E Test Blog Title" by E2E Test Blog Author?')
            await dialog.accept()
          }),
          deleteButton.click()
        ])
        // Wait for the blog to be removed from the page
        const deletedBlog = page.getByText('E2E Test Blog Title by E2E Test Blog Author')
        await expect(deletedBlog).not.toBeVisible()
      })
      test('it cannot be deleted by another user', async ({ page, request }) => {
        await createUser(request, 'Username Two', 'username2', 'username2')
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'username2', 'username2')
        const viewButton = page.getByText('view')
        await viewButton.click()
        const deleteButton = page.getByText('delete')
        await expect(deleteButton).not.toBeVisible()
      })
      test('blogs are ordered by likes in descending order', async ({ page }) => {
        // await page.pause()
        // Create a second blog
        await createBlog(page, 'Second Blog Title', 'Second Blog Author', 'http://e2e.test/blog/url2')
        const secondBlog = page.getByText('Second Blog Title by Second Blog Author')
        await expect(secondBlog).toBeVisible()

        // Like the second blog twice
        const secondBlogViewButton = secondBlog.getByText('view')
        await secondBlogViewButton.click()
        const secondBlogLikeButton = secondBlog.getByText('like')
        await secondBlogLikeButton.click()
        await secondBlogLikeButton.click()

        // Like the first blog once
        const firstBlog = page.getByText('E2E Test Blog Title by E2E Test Blog Author')
        const firstBlogViewButton = firstBlog.getByText('view')
        await firstBlogViewButton.click()
        const firstBlogLikeButton = firstBlog.getByText('like')
        await firstBlogLikeButton.click()

        await page.pause()
        // Check that the second blog is now above the first blog
        const blogDivs = page.locator('div', { has: page.getByText('by') }) // selects divs containing 'by'
        await expect(blogDivs.nth(0)).toContainText('Second Blog Title by Second Blog Author')
        await expect(blogDivs.nth(1)).toContainText('E2E Test Blog Title by E2E Test Blog Author')
      })
    })
  })
})
