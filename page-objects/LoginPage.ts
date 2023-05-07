import {expect, Locator, Page} from '@playwright/test'
import { AbstractPage} from './AbstractPage'

export class LoginPage extends AbstractPage{
    // Define Selectors
    // readonly page: Page
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator
    readonly notifBanner: Locator
    readonly notifBannerButton: Locator
    // readonly errorMessage: Locator
    // readonly loginForm: Locator

    // Init selectors using constructor
    constructor(page: Page){
        //this.page = page
        super(page)
        this.usernameInput = page.locator('#email')
        this.passwordInput = page.locator('#password')
        this.submitButton = page.getByRole("button", { name: "Log in" })
        this.notifBanner = page.locator('[data-test="notification-banner"]')
        this.notifBannerButton = page.locator('[data-test="notification-close"]')
        
        // this.errorMessage = page.locator('.alert-error')
        // this.loginForm = page.locator('#login_form')
    }

    async loginRSP(username: string,password: string){
        await this.usernameInput.type(username)
        await this.passwordInput.type(password)
        await this.submitButton.click()
        //await this.page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html')
    }

//    async assertErrorMessage(){
//     await expect(this.errorMessage).toContainText('Login and/or password are wrong')
//    }
}