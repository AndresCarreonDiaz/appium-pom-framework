import TabBar from '../../src/components/TabBar.ts'
import NativeAlert from '../../src/components/NativeAlert.ts'
import LoginPage from '../../src/pages/LoginPage.ts'
import { invalidEmailUser, shortPasswordUser, validUser } from '../../src/data/users.ts'

describe('Login and sign up', () => {
  beforeEach(async () => {
    await TabBar.waitForDisplayed()
    await TabBar.open('Login')
    await LoginPage.waitForDisplayed()
  })

  it('logs in with valid credentials', async () => {
    await LoginPage.login(validUser)

    await NativeAlert.waitForDisplayed()
    expect(await NativeAlert.text()).toContain('You are logged in!')
    await NativeAlert.tap('OK')
  })

  it('rejects an email address with an invalid format', async () => {
    await LoginPage.login(invalidEmailUser)

    expect(await LoginPage.isErrorShown('Please enter a valid email address')).toBe(true)
  })

  it('rejects a password shorter than 8 characters', async () => {
    await LoginPage.login(shortPasswordUser)

    expect(await LoginPage.isErrorShown('Please enter at least 8 characters')).toBe(true)
  })

  it('signs up a new user', async () => {
    await LoginPage.signUp(validUser)

    await NativeAlert.waitForDisplayed()
    expect(await NativeAlert.text()).toContain('You successfully signed up!')
    await NativeAlert.tap('OK')
  })

  it('rejects a sign up when the passwords do not match', async () => {
    await LoginPage.signUp(validUser, 'DifferentPassw0rd')

    expect(await LoginPage.isErrorShown('Please enter the same password')).toBe(true)
  })
})
