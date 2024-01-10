import { Page } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'


export class Hooks extends AbstractPage{    
    
    readonly Testurl: string
    readonly comedyMob24url: string
    readonly comedyMobEasturl: string
    readonly comedyMobMondayurl: string
    readonly kerasotesurl: string


    constructor(page: Page){
        super(page) // call a constructor from the class from which it extends from

        this.Testurl = 'https://6thboroughcomedy.com/test'
        this.comedyMob24url = "https://www.comedymob.com/comedy-mob-east-1"
        this.comedyMobEasturl = 'https://www.comedymob.com/comedy-mob-east'
        this.comedyMobMondayurl = 'https://www.comedymob.com/monday-night-mob'
        this.kerasotesurl = 'https://www.showplaceicon.com/Browsing/Cinemas/Compare?Cinemas=8875&Date=2024-01-09'


        
    }

    //define methods
    async kerasotesSetup(){

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()

        let date = yyyy + '-' + dd + '-' + mm

        console.log(this.kerasotesurl + date)
        await this.page.goto(this.kerasotesurl + date)
        await this.page.locator('.page-header-banner').waitFor()
    }
    
    async Testsetup(){
        
        await this.page.goto(this.Testurl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async Comedy24setup(){

        await this.page.goto(this.comedyMob24url)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async ComedyEastsetup(){
        
        await this.page.goto(this.comedyMobEasturl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async ComedyMondaysetup(){
        
        await this.page.goto(this.comedyMobMondayurl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }    
}


        