import { Page } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'
import { LoginPage } from '../LoginPage'
import { DataPage } from '../DataPage'
import { asyncWriteFile } from '../../utils/helpers'

export class Hooks extends AbstractPage{

    readonly enviro: string
    readonly username: string
    readonly password: string
    readonly comedyMob24url: string
    readonly Testurl: string
    readonly comedyMobEasturl: string
    readonly comedyMobMondayurl: string


    constructor(page: Page){
        super(page) // call a constructor from the class from which it extends from
        //this.enviro = envi("TEST_ENVIRO_CLI")
        //const environment = this.enviro.toUpperCase()

        // Need to implement secret environment file for usernames/passwords come CI time.
        this.comedyMob24url = "https://www.comedymob.com/comedy-mob-east-1"
        this.Testurl = 'https://6thboroughcomedy.com/test'
        this.comedyMobEasturl = 'https://www.comedymob.com/comedy-mob-east'
        this.comedyMobMondayurl = 'https://www.comedymob.com/monday-night-mob'
        //this.url = "https://www.comedymob.com/monday-night-mob"
        
        
    }

    //define methods

    async Comedy24setup(){
        let loginPage: LoginPage
        let dataPage: DataPage
        loginPage = new LoginPage(this.page)
        dataPage = new DataPage(this.page)
        
        await this.page.goto(this.comedyMob24url)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async Testsetup(){
        let loginPage: LoginPage
        let dataPage: DataPage
        loginPage = new LoginPage(this.page)
        dataPage = new DataPage(this.page)
        
        await this.page.goto(this.Testurl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async ComedyEastsetup(){
        let loginPage: LoginPage
        let dataPage: DataPage
        loginPage = new LoginPage(this.page)
        dataPage = new DataPage(this.page)
        
        await this.page.goto(this.comedyMobEasturl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async ComedyMondaysetup(){
        let loginPage: LoginPage
        let dataPage: DataPage
        loginPage = new LoginPage(this.page)
        dataPage = new DataPage(this.page)
        
        await this.page.goto(this.comedyMobMondayurl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }
    

    async logIn(){
        let loginPage: LoginPage
        let dataPage: DataPage
        loginPage = new LoginPage(this.page)
        dataPage = new DataPage(this.page)

        this.page.on('websocket', ws => {

            let wsUrl: String
            wsUrl = ws.url()
            if(wsUrl.includes(`hermes`)){
    
                let dateTime: Date = new Date()

                asyncWriteFile('\n' + dateTime + ' | Hermes WebSocket Opened: ' + ws.url())
                ws.on('framesent', event => asyncWriteFile('\n' +  dateTime + ' | WebSocket Message Sent: ' + event.payload + event))
                ws.on('framereceived', event => asyncWriteFile('\n' + dateTime + ' | WebSocket Message Received: ' + event.payload))
                ws.on('close', () => asyncWriteFile('\n' + dateTime + ' | Hermes WebSocket Closed: ' + ws.url()))
            }
        })
        
        await this.page.goto(this.comedyMob24url)
    
        if( await loginPage.notifBanner.isVisible() ){
            await loginPage.notifBannerButton.click()
        }

        await loginPage.usernameInput.click()
        await loginPage.usernameInput.fill(this.username)
        await loginPage.passwordInput.click()
        await loginPage.passwordInput.fill(this.password)
        await loginPage.submitButton.click()
        //await dataPage.keyboardShortcutText.waitFor()
    }

    async clearQueue(){
        let dataPage: DataPage
        dataPage = new DataPage(this.page)

        await dataPage.all911Events.click()
        await dataPage.all911Events.click({button: 'right'})
        await dataPage.removeAllText.waitFor()
        await dataPage.removeAllText.click()
        await dataPage.yesRemoveallText.waitFor()
        await dataPage.yesRemoveallText.click()     
    }

    
}


        