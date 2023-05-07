import { test, expect } from '@playwright/test'
import { DataPage } from '../../page-objects/DataPage'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { convertPhoneToQueue, elsV1Call, setEnvironment, asyncWriteFile } from '../../utils/helpers'
import axios from "axios";


test.describe('COMEDY', () => {

    let hooks: Hooks
    let dataPage: DataPage
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        //await hooks.Comedy24setup()
        await hooks.Testsetup()
    })

    test('Comedy Mob Final Test', async ({ page, request }) => {
        dataPage = new DataPage(page) //  POM
        navigation = new Navigation(page)

        await page.waitForTimeout(navigation.slowmo)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')
                const accountSid = "AC40e5aa76370c612b5bcbcdee5ca7f317";
                //const authToken = process.env.TWILIO_AUTH_TOKEN;
                const authToken = 'a612a402ca3bca95b100fbc23c4dda65'
                const client = require("twilio")(accountSid, authToken);
                client.messages
                    .create({ body: 'page.url()', from: "+18882966538", to: "+12019209227" })
                        .then(message => console.log(message.sid));

                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = 'aimu5mr4v19hb7v975px2361fnrfii'
                    let user = 'uctcbm15r5ij32tpkzg8hmg3gnpauj'
                    let tempp = 'client_credentials'  
                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/comedy-mob-east-1' } )
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Pushover API Request failed')
                    }
           }
        

        await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()

        const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        asyncWriteFile('\n' + currentFormText)
        
    })

    test.skip('Positive Test', async ({ page, request }) => {
        dataPage = new DataPage(page) //  POM
        navigation = new Navigation(page)

        const myFrames = await page.frames();
        //console.log("Parent IFrame = "+myFrames.length)
        asyncWriteFile('\n' + "Parent IFrame = "+myFrames.length);

        let test: any

        for ( test of myFrames) { // Getting all iFrames
            try {
                const frameContent = await test.content();
                //console.log(frameContent)
                asyncWriteFile('\n' + frameContent);
            } catch(error){
                 //console.log(error)
                 asyncWriteFile('\n' + error);
            }
        }
    })

    test.skip('SMS', async ({ page, request }) => {
        dataPage = new DataPage(page) //  POM
        navigation = new Navigation(page)

        await page.waitForTimeout(navigation.slowmo)

        // Download the helper library from https://www.twilio.com/docs/node/install
        // Set environment variables for your credentials
        // Read more at http://twil.io/secure
        const accountSid = "AC40e5aa76370c612b5bcbcdee5ca7f317";
        //const authToken = process.env.TWILIO_AUTH_TOKEN;
        const authToken = 'a612a402ca3bca95b100fbc23c4dda65'
        const client = require("twilio")(accountSid, authToken);
        client.messages
            .create({ body: "Hello from Twilio", from: "+18882966538", to: "+12019209227" })
                .then(message => console.log(message.sid));
        
        asyncWriteFile('\n' + 'currentFormText')
        
    })

})
