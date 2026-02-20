import { url } from "inspector"
import { expect } from '@playwright/test'

const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  // Wait for the blog to actually appear
  const createdBlog = page.getByText(`${title} by ${author}`)
  await expect(createdBlog).toBeVisible()
}

const createUser = async (request, name, username, password) => {
  await request.post('/api/users', {
    data: {
      name,
      username,
      password
    }
  })
}

export { loginWith, createBlog, createUser }
