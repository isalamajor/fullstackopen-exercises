const { test, expect, describe, beforeEach } = require('@playwright/test')


describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/user', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {

    const locator = await page.getByText('Blogs App')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Blogs App')).toBeVisible()
  })


  test('login is shown', async ({ page }) => {
    const usernameInput = await page.getByPlaceholder('Username')
    const passwordInput = await page.getByPlaceholder('Password')
    const loginBtn = await page.getByRole('button', { name: 'login' })

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginBtn).toBeVisible()
  })

  test('login with valid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    const blogsPage = page.getByText('Blogs List')
    await expect(blogsPage).toBeVisible()
  })

  test('fail with wrong username', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('madeup')
    await page.getByPlaceholder('Password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    const errorMessage = page.getByText('invalid username')
    const blogsPage = page.getByText('Blogs List')

    await expect(errorMessage).toBeVisible()
    await expect(blogsPage).not.toBeVisible()
  })
  test('fail with wrong password', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('madeup')
    await page.getByRole('button', { name: 'login' }).click()

    const errorMessage = page.getByText('invalid password')
    const blogsPage = page.getByText('Blogs List')

    await expect(errorMessage).toBeVisible()
    await expect(blogsPage).not.toBeVisible()
  })
})

describe('When logged in', () => {

  beforeEach(async ({ page, request }) => {
    const resetRes = await request.post('/api/testing/reset')
    expect(resetRes.ok()).toBe(true)

    const userRes = await request.post('/api/user', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    expect(userRes.ok()).toBe(true)

    await page.goto('/')
    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('a new blog can be created and updated', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Blog' }).click()
    await page.getByPlaceholder('Title').fill('TitleTest')
    await page.getByPlaceholder('Author').fill('AuthorTest')
    await page.getByPlaceholder('Url').fill('UrlTest')
    await page.getByRole('button', { name: 'Post' }).click()

    const newBlog = await page.getByText('TitleTest').last()
    expect(newBlog).toBeVisible()

    await newBlog.getByRole('button', { name: 'View' }).click()
    await newBlog.getByRole('button', { name: 'Like' }).click()
    const likes = await page.getByText('1 likes').locator('..')
    await expect(likes).toHaveText(/1 likes/)
  })
  test('a blog can be deleted by its creator', async ({ page }) => {
    // Accept dialog
    page.on('dialog', async dialog => {
      console.log('Confirm dialog shown with message:', dialog.message())
      await dialog.accept()
    })

    // Add blog
    await page.getByRole('button', { name: 'Add Blog' }).click()
    await page.getByPlaceholder('Title').fill('TitleTest')
    await page.getByPlaceholder('Author').fill('AuthorTest')
    await page.getByPlaceholder('Url').fill('UrlTest')
    await page.getByRole('button', { name: 'Post' }).click()

    // Search blog
    const newBlog = page.getByText('TitleTest').last()
    await expect(newBlog).toBeVisible()

    // View details and delete
    await newBlog.getByRole('button', { name: 'View' }).click()
    await newBlog.getByRole('button', { name: 'Delete' }).click()

    // Check it's not there
    const deletedBlog = await page.getByText('TitleTest').last()
    await expect(deletedBlog).toHaveCount(0)
  })


  test('a blog cannot deleted if user is not creator', async ({ page, request }) => {

    const userRes = await request.post('/api/user', {
      data: {
        name: 'Not Matti Luukkainen',
        username: 'NotMluukkai',
        password: 'salainen2'
      }
    })

    expect(userRes.ok()).toBe(true)

    await request.post('/api/blog',)

    // Accept dialog
    page.on('dialog', async dialog => {
      console.log('Confirm dialog shown with message:', dialog.message())
      await dialog.accept()
    })

    // Add blogs
    await page.getByRole('button', { name: 'Add Blog' }).click()
    await page.getByPlaceholder('Title').fill('TitleTest')
    await page.getByPlaceholder('Author').fill('AuthorTest')
    await page.getByPlaceholder('Url').fill('UrlTest')
    await page.getByRole('button', { name: 'Post' }).click()

    // Log Out
    await page.getByRole('button', { name: 'Logout' }).click()

    // Log In with the other user
    await page.getByPlaceholder('Username').fill('NotMluukkai')
    await page.getByPlaceholder('Password').fill('salainen2')
    await page.getByRole('button', { name: 'login' }).click()

    const blog = page.getByText('TitleTest')
    await expect(blog).toBeVisible()

    const newBlog = page.getByText('TitleTest').last()
    await expect(newBlog).toBeVisible()

    // Show details. Delete should not be there
    await newBlog.getByRole('button', { name: 'View' }).click()
    await page.pause()
    const deleleteBtn = await newBlog.getByRole('button', { name: 'Delete' })

    expect(deleleteBtn).toHaveCount(0)
  })
})

describe('Seed and logged in', () => {

  beforeEach(async ({ page, request }) => {
    // Add some test blogs
    const seed = await request.post('/api/testing/reset-and-seed', {})
    expect(seed.ok()).toBe(true)

    const userRes = await request.post('/api/user', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    expect(userRes.ok()).toBe(true)

    await page.goto('/')
    await page.getByPlaceholder('Username').fill('mluukkai')
    await page.getByPlaceholder('Password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  })


  test('blogs are in order of likes', async ({ page, request }) => {

    // Obtain blogs
    await page.waitForSelector('[data-testid="blog-test-id"]')
    const blogElements = await page.locator('[data-testid="blog-test-id"]')
    const count = await blogElements.count()
    expect(count).toBeGreaterThan(0)

    // Go through likes
    const likesArray = []
    for (let i = 0; i < count; i++) {
      const blog = blogElements.nth(i)
      await blog.getByRole('button', { name: 'View' }).click()
      const likesText = await blog.locator('text=likes').textContent()
      const likes = parseInt(likesText)
      likesArray.push(likes)
    }

    // Check order
    const sortedLikes = [...likesArray].sort((a, b) => b - a)
    expect(likesArray).toEqual(sortedLikes)
  })


})

