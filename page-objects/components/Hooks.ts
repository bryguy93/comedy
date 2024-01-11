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
        this.comedyMob24url = "https://www.comedymob.com/perform-with-us"
        this.comedyMobEasturl = 'https://www.comedymob.com/comedy-mob-east'
        this.comedyMobMondayurl = 'https://www.comedymob.com/monday-night-mob'
        this.kerasotesurl = 'https://www.showplaceicon.com/Browsing/Cinemas/Compare?Cinemas=8875&Date='


        
    }

    //define methods
    async kerasotesSetup(){

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()

        let date = yyyy + '-' + mm + '-' + dd

        console.log(this.kerasotesurl + date)
        //await this.page.goto(this.kerasotesurl + date)
        //await this.page.locator('.page-header-banner').waitFor()
        //this.page.waitForLoadState('domcontentloaded')

        const [resp]= await Promise.all([ //trigger Avive emergency
            this.page.waitForResponse(resp => resp.url().includes('https://www.showplaceicon.com/Browsing/Cinemas/Compare?Cinemas=8875')),
            this.page.goto(this.kerasotesurl + date),
           ]);
       
        let dateTime: Date = new Date()
        let initialTrigger: number
        const body= await resp.text()
        // www & -time " & 133 shars

        //let scope = body.indexOf('-time \"')  // 1
        //console.log('Index is ' + scope)
        //scope = body.indexOf('-time \"',scope + 1) // 2
        //console.log('Index is ' + scope)

        let scope: number = 0
        let i: number = 0
        let instances: number[]=[]
        while (i != -1){
            scope = body.indexOf('-time \"',i)
            
            if(scope > 0){
                i = scope + 1
                instances.push(scope)
            } else{
                i = scope
            }
            
        }
        console.log(instances)
        console.log(instances.length)

        scope = 0
        i = 0
        let www: number[]=[]
        while (i != instances.length){
            scope = body.indexOf('www',instances[i] - 133)
            i = i + 1
            www.push(scope) 
        }
        console.log(www)
        console.log(www.length)

        i = 0
        while (i != instances.length){

            let first = 'https://' + body.slice(www[i],instances[i]-16)
            first = first.replace(/amp;/g,'')
            console.log(first)
            i = i + 1 
        }

        

        //const parser = new DOMParser()
        //const htmlDoc = parser.parseFromString(body, 'text/html')
        //let times = htmlDoc.getElementsByClassName('session-time ')
        //console.log(times)
        //initialTrigger = resp.status()
       
        //if( initialTrigger > 199 && initialTrigger < 300){
          //  console.log('Avive Trigger success: ' + initialTrigger)
            //asyncWriteFile('\n' + dateTime +' | ' + 'Avive trigger: '+' | '+ initialTrigger + ': | ' + JSON.stringify(body));
        //} else {
          //  console.log('Avive Trigger failed: ' + initialTrigger)
            //asyncWriteFile('\n' + dateTime +' | ' + 'Avive trigger: '+' | '+ initialTrigger + ': | ' + JSON.stringify(body));
        //}

        //await dataPage.aviveAedReqMadeText.waitFor() 
    }
    
    async Testsetup(){
        
        await this.page.goto(this.Testurl)
        await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
    }

    async Comedy24setup(){

        await this.page.goto(this.comedyMob24url)
        await this.page.getByRole('link', { name: 'Click here to sign up for our mics' }).click();
        this.page.waitForLoadState('domcontentloaded')
        //await this.page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').locator('html').waitFor()
        
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


        