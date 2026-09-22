import BasePage from './BasePage.ts'
import type { Credentials } from '../data/users.ts'

class LoginPage extends BasePage {
  protected readonly screenId = 'Login-screen'

  private get loginTab() { return this.byId('button-login-container') }
  private get signUpTab() { return this.byId('button-sign-up-container') }
  private get email() { return this.byId('input-email') }
  private get password() { return this.byId('input-password') }
  private get repeatPassword() { return this.byId('input-repeat-password') }
  private get loginButton() { return this.byId('button-LOGIN') }
  private get signUpButton() { return this.byId('button-SIGN UP') }

  private errorText(text: string) {
    return this.byPlatform({
      android: `//android.widget.TextView[@text="${text}"]`,
      ios: `-ios predicate string:label == "${text}"`,
    })
  }

  async login({ email, password }: Credentials): Promise<void> {
    await this.loginTab.click()
    await this.email.setValue(email)
    await this.password.setValue(password)
    await this.submit(this.loginButton)
  }

  async signUp({ email, password }: Credentials, repeatPassword = password): Promise<void> {
    await this.signUpTab.click()
    await this.email.setValue(email)
    await this.password.setValue(password)
    await this.repeatPassword.setValue(repeatPassword)
    await this.submit(this.signUpButton)
  }

  async isErrorShown(text: string): Promise<boolean> {
    return this.errorText(text).isDisplayed()
  }

  private async submit(button: ReturnType<typeof this.byId>): Promise<void> {
    await this.hideKeyboard()
    await button.scrollIntoView({ scrollableElement: await this.screen })
    await button.click()
  }
}

export default new LoginPage()
