import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { asyncWriteFile } from '../../utils/helpers'
import axios from "axios";

test.describe('KERASOTES', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.kerasotesSetup()
        //console.log(hooks.kerasotesurl)
        
    })

    test.skip('Secaucus', async ({ page, request }) => {

        navigation = new Navigation(page)
        



        if (true) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')

                try {
                    //twilio creds
                    let sid = process.env.twilioSid
                    let apiToken = process.env.twilioApi
                    //console.log('Twilio token: ' + apiToken)

                    if(apiToken === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioApi
                        //console.log('Twilio token: ' + apiToken)
                    }

                    if(sid === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioSid
                    }

                    const accountSid = sid
                    const authToken = apiToken
                    //twilio SMS
                    const client = require("twilio")(accountSid, authToken);
                    client.messages
                        .create({ body: 'https://www.comedymob.com/comedy-mob-east-1', from: "+18882966538", to: "+12019209227" })
                            .then(message => console.log(message.sid));
                    
                    await page.waitForTimeout(navigation.slowmo)

                    //twilio VOICE CALL
                    const client2 = require('twilio')(accountSid, authToken);

                    client2.calls
                        .create({
                            url: 'http://demo.twilio.com/docs/voice.xml',
                            to: '+12019209227',
                            from: '+18882966538'
                        })
                        .then(call => console.log(call.sid));

                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Twitter request failed')
                    }

                //pushover push notifications
                try {
                    let url = 'https://api.pushover.net/1/messages.json'                    
                    let token = process.env.pushover_token
                    let user = process.env.pushover_user

                    if(token === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        token = process.env.pushoverToken
                    }
                    
                    if(user === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        user = process.env.pushoverUser
                        asyncWriteFile('\n' + user)
                    }

                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/comedy-mob-east-1' } )
                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Pushover API Request failed')
                    }
           }
        
        //await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
        
    })
})


test.describe('COMEDY MOB FULL SIGNUPS', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.Comedy24setup()
        console.log(hooks.comedyMob24url)
        
    })

    test.skip('Minute-man check', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.getByText('The form Sign-ups for this week\'s Mob Mics is no longer accepting responses.Try ').isEnabled()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')

                try {
                    //twilio creds
                    let sid = process.env.twilioSid
                    let apiToken = process.env.twilioApi
                    //console.log('Twilio token: ' + apiToken)

                    if(apiToken === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config({path: './page-objects/components/secrets.env'})
                        apiToken = process.env.twilioApi
                        //console.log('Twilio token: ' + apiToken)
                    }

                    if(sid === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config({path: './page-objects/components/secrets.env'})
                        sid = process.env.twilioSid
                    }

                    const accountSid = sid
                    const authToken = apiToken

                    //twilio SMS
                    const client = require("twilio")(accountSid, authToken);
                    client.messages
                        .create({ body: 'https://www.comedymob.com/perform-with-us', from: "+18336090184", to: "+12019209227" })
                            .then(message => console.log(message.sid));
                    
                    await page.waitForTimeout(navigation.slowmo)

                    //twilio VOICE CALL
                    const client2 = require('twilio')(accountSid, authToken);

                    client2.calls
                        .create({
                            url: 'http://demo.twilio.com/docs/voice.xml',
                            to: '+12019209227',
                            from: '+18336090184'
                        })
                        .then(call => console.log(call.sid));

                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error(error)
                    }

                //pushover push notifications
                try {
                    let url = 'https://api.pushover.net/1/messages.json'                    
                    let token = process.env.pushover_token
                    let user = process.env.pushover_user

                    if(token === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        token = process.env.pushoverToken
                    }
                    
                    if(user === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        user = process.env.pushoverUser
                        asyncWriteFile('\n' + user)
                    }

                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/perform-with-us' } )
                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        //console.log(error)
                        throw new Error('Pushover API Request failed')
                    }
           }
        
        //await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
        
    })
})


test.describe('COMEDY MOB EAST - MEH', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.ComedyEastsetup()
        console.log(hooks.comedyMobEasturl)
        
    })

    test.skip('On the minute checkss', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')

                try {
                    //twilio creds
                    let sid = process.env.twilioSid
                    let apiToken = process.env.twilioApi
                    //console.log('Twilio token: ' + apiToken)

                    if(apiToken === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioApi
                        //console.log('Twilio token: ' + apiToken)
                    }

                    if(sid === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioSid
                    }

                    const accountSid = sid
                    const authToken = apiToken

                    //twilio SMS
                    const client = require("twilio")(accountSid, authToken);
                    client.messages
                        .create({ body: 'https://www.comedymob.com/comedy-mob-east', from: "+18882966538", to: "+12019209227" })
                            .then(message => console.log(message.sid));
                    
                    await page.waitForTimeout(navigation.slowmo)

                    //twilio VOICE CALL
                    const client2 = require('twilio')(accountSid, authToken);

                    client2.calls
                        .create({
                            url: 'http://demo.twilio.com/docs/voice.xml',
                            to: '+12019209227',
                            from: '+18882966538'
                        })
                        .then(call => console.log(call.sid));

                    await page.waitForTimeout(navigation.slowmo)

                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Twitter request failed')
                    }
                //pushover push notifications
                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = process.env.pushover_token
                    let user = process.env.pushover_user

                    if(token === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        token = process.env.pushoverToken
                    }
                    
                    if(user === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        user = process.env.pushoverUser
                        asyncWriteFile('\n' + user)
                    }


                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/comedy-mob-east' } )
                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Pushover API Request failed')
                    }
           }
        
        await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
        
    })
})

test.describe('COMEDY MOB MONDAY - MEH', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        
        hooks = new Hooks(page)
        await hooks.ComedyMondaysetup()
        console.log(hooks.comedyMobMondayurl)
        
    })

    test.skip('On the minute checks', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')

                try {
                    //twilio creds
                    let sid = process.env.twilioSid
                    let apiToken = process.env.twilioApi
                    //console.log('Twilio token: ' + apiToken)

                    if(apiToken === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioApi
                        //console.log('Twilio token: ' + apiToken)
                    }

                    if(sid === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        apiToken = process.env.twilioSid
                    }

                    const accountSid = sid
                    const authToken = apiToken
                    
                    //twilio SMS
                    const client = require("twilio")(accountSid, authToken);
                    client.messages
                        .create({ body: 'https://www.comedymob.com/monday-night-mob', from: "+18882966538", to: "+12019209227" })
                            .then(message => console.log(message.sid));
                    
                    await page.waitForTimeout(navigation.slowmo)

                    //twilio VOICE CALL
                    const client2 = require('twilio')(accountSid, authToken);

                    client2.calls
                        .create({
                            url: 'http://demo.twilio.com/docs/voice.xml',
                            to: '+12019209227',
                            from: '+18882966538'
                        })
                        .then(call => console.log(call.sid));

                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Twitter request failed')
                    }

                
                //pushover push notifications
                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = process.env.pushover_token
                    let user = process.env.pushover_user

                    //console.log('Pushover Token: ' + token)

                    if(token === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        token = process.env.pushoverToken
                        //console.log('Pushover Token: ' + token)
                    }
                    
                    if(user === undefined){
                        const dotenv = require('dotenv');
                        dotenv.config()
                        user = process.env.pushoverUser
                        asyncWriteFile('\n' + user)
                    }

                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/monday-night-mob' } )
                    await page.waitForTimeout(navigation.slowmo)
                    
                  } catch (error) {
                        console.log(error)
                        throw new Error('Pushover API Request failed')
                    }
           }
        
        await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
    })

})