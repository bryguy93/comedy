import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { asyncWriteFile } from '../../utils/helpers'
import axios from "axios";


test.describe('COMEDY MOB 24', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.Comedy24setup()
    })

    test('On the minute checks', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')
                //const accountSid = "AC40e5aa76370c612b5bcbcdee5ca7f317";
                //const authToken = 'a612a402ca3bca95b100fbc23c4dda65'
                //const client = require("twilio")(accountSid, authToken);
                //client.messages
                //    .create({ body: 'page.url()', from: "+18882966538", to: "+12019209227" })
                //        .then(message => console.log(message.sid));

                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = 'aimu5mr4v19hb7v975px2361fnrfii'
                    let user = 'uctcbm15r5ij32tpkzg8hmg3gnpauj'
                    const response = await axios.post(url, {'token': token,'user': user, 'message': 'https://www.comedymob.com/comedy-mob-east-1' } )
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


test.describe('COMEDY MOB EAST', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.ComedyEastsetup()
    })

    test('On the minute checks', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')
                //const accountSid = "AC40e5aa76370c612b5bcbcdee5ca7f317";
                //const authToken = 'a612a402ca3bca95b100fbc23c4dda65'
                //const client = require("twilio")(accountSid, authToken);
                //client.messages
                //    .create({ body: 'page.url()', from: "+18882966538", to: "+12019209227" })
                //        .then(message => console.log(message.sid));

                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = 'aimu5mr4v19hb7v975px2361fnrfii'
                    let user = 'uctcbm15r5ij32tpkzg8hmg3gnpauj'
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

test.describe('COMEDY MOB MONDAY', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.ComedyMondaysetup()
    })

    test('On the minute checks', async ({ page, request }) => {

        navigation = new Navigation(page)

        if (await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).isVisible()) {
            console.log('Bidness as usual')
           }
           else{
                console.log('Go time')
                //const accountSid = "AC40e5aa76370c612b5bcbcdee5ca7f317";
                //const authToken = 'a612a402ca3bca95b100fbc23c4dda65'
                //const client = require("twilio")(accountSid, authToken);
                //client.messages
                //    .create({ body: 'page.url()', from: "+18882966538", to: "+12019209227" })
                //        .then(message => console.log(message.sid));

                try {
                    let url = 'https://api.pushover.net/1/messages.json'
                    let token = 'aimu5mr4v19hb7v975px2361fnrfii'
                    let user = 'uctcbm15r5ij32tpkzg8hmg3gnpauj'
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