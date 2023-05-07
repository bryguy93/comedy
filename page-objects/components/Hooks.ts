import { Page } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'


export class Hooks extends AbstractPage{    
    
    readonly Testurl: string
    readonly comedyMob24url: string
    readonly comedyMobEasturl: string
    readonly comedyMobMondayurl: string


    constructor(page: Page){
        super(page) // call a constructor from the class from which it extends from

        this.Testurl = 'https://6thboroughcomedy.com/test'
        this.comedyMob24url = "https://www.comedymob.com/comedy-mob-east-1"
        this.comedyMobEasturl = 'https://www.comedymob.com/comedy-mob-east'
        this.comedyMobMondayurl = 'https://www.comedymob.com/monday-night-mob'
        
    }

    //define methods
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


        