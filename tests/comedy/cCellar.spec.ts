import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { asyncWriteFile, postRequest } from '../../utils/helpers'
import axios from "axios";

test.describe('COMEDY CELLAR', () => {

    let navigation: Navigation

    test('On the minute checks', async ({ page, request }) => {

        //const headers2 = {
          //  'content-type': 'application/x-www-form-urlencoded'
        //}

        const headers = { 
            'authority': 'www.comedycellar.com', 
            'accept': '*/*', 
            'accept-language': 'en-US,en;q=0.9', 
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
            'origin': 'https://www.comedycellar.com', 
            'referer': 'https://www.comedycellar.com/new-york-line-up/', 
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        
        let dayIndex: Date = new Date() //current index in day string
        var dd = String(dayIndex.getDate()).padStart(2, '0')
        var mm = String(dayIndex.getMonth() + 1).padStart(2, '0')
        var yyyy = dayIndex.getFullYear()
        let dateFormatted = '\"'+yyyy + '-' + mm + '-' + dd+'\"'


        const url = 'https://www.comedycellar.com/lineup/api/'
        let data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
        //*****************************************                  ********************            ************************ */
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let placeholder: number = 0
        let exampleArray: number[][]=[[],[]] //push()
        
       
        while ( index != 1){ // change this to iterate for 30 days

            const [answer] = await Promise.all([
                postRequest(url, headers, data),
                
            ])

            
            if(answer.toString().indexOf('No Comedians added yet!') == -1){ // ON EACH IN SCOPE DATES
                console.log(dateFormatted)
                console.log('html load')
                //console.log(answer.toString().includes('No Comedians added yet!'))
                
                let finalIndex = answer.length
                // Now we're iterating on each inscope date's raw HTML as String
                //Parse string for showtime and then Comedian and loop

                let tempIndexArrayStart: number[]=[]
                let tempIndexArrayEnd: number[]=[]
                let i: number = htmlStringIndex
                let tempTimeIndex: number = 0
                while (i != -1){
                    console.log('LOOPING i = ' + i)
                    tempTimeIndex = answer.indexOf('<h2><span class=\\"bold\\">',i)
                    console.log('Time Starting Indexes = ' + tempTimeIndex)
                        
                    if(tempTimeIndex > 0){
                        i = tempTimeIndex + 2
                        tempIndexArrayStart.push(tempTimeIndex + 25)
                        //tempArrayIndex = tempArrayIndex + 1
                        tempTimeIndex = answer.indexOf('<span class=\\"hide-mobile\\">',i)
                        tempIndexArrayEnd.push(tempTimeIndex)

                    } else{
                        i = tempTimeIndex
                    }


                    //let Def = 0
                    //while(Def != tempIndexArrayStart.length){
                    //console.log('START')
                    //console.log(tempIndexArrayStart[Def],tempIndexArrayEnd[Def])
                    //console.log('Comedians ' + answer.substring(tempIndexArrayStart[Def],tempIndexArrayEnd[Def]))
                    //Def = Def + 1
                    //}


                    
                    //console.log(substringArrayStart)
                    //console.log(substringArrayEnd)
                    //let De = 0
                    //while(De != tempIndexArrayStart.length){
                    //console.log('START')
                    //console.log(substringArrayStart[De],substringArrayEnd[De])
                    //console.log('Comedians ' + answer.substring(substringArrayStart[De],substringArrayEnd[De]))
                    //De = De + 1
                    //}
                } // GRAB ALL THE TIMES DATA FOR THIS DAY

                let De = 0
                while(De != tempIndexArrayStart.length){
                console.log('Comedians ' + answer.substring(tempIndexArrayStart[De],tempIndexArrayEnd[De]))
                De = De + 1
                }

                let finalTimeArray: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    finalTimeArray.push(answer.substring(tempIndexArrayStart[i],tempIndexArrayEnd[i]))
                }
                console.log(finalTimeArray)

                // HERE WE HAVE ALL TIME DATA in tempIndexArrayStart and End for the current day
                //Get substring based on collected times data

                let substringArrayStart: number[]=[]
                let substringArrayEnd: number[]=[]
                console.log(tempIndexArrayStart.length)
                let tempSub = tempIndexArrayStart.length - 1
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    //console.log('ADD: '+ tempIndexArrayEnd[i])
                    //console.log('array lwength: ' + tempIndexArrayStart.length)
                    substringArrayStart.push(tempIndexArrayEnd[i])
                        
                    if( i == tempSub ){
                        substringArrayEnd.push(answer.length)
                    } else{
                        substringArrayEnd.push(tempIndexArrayStart[i+1])
                    }

                }
                
                let rawHtmlByTime: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    rawHtmlByTime.push(answer.substring(substringArrayStart[i],substringArrayEnd[i]))
                }

                console.log(rawHtmlByTime.length)

                //finalTimeArray[] & rawHtmlByTime[] -> NEED Name[] Bio[] Website[]*   **** may not exist. 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //let tempIndexArrayStart: number[]=[]
                //let tempIndexArrayEnd: number[]=[]
                
                let comedianNameArrayStart: number[]=[]
                let comedianNameArrayEnd: number[]=[]
                let comedianBioArrayStart: number[]=[]
                let comedianBioArrayEnd: number[]=[]
                let tempArrayIndex: number = 0
                let a: number = htmlStringIndex
                let tempIndex: number = 0
                while (a != -1){
                    //console.log('LOOPING i = ' + a)
                    tempIndex = answer.indexOf('<p><span class=\\"name\\">',a)
                    //console.log('Time Starting Indexes = ' + tempIndex)
                        
                    if(tempIndex > 0){
                        a = tempIndex + 2
                        comedianNameArrayStart.push(tempIndex + 24)
                        //tempArrayIndex = tempArrayIndex + 1
                        tempIndex = answer.indexOf('</span>',a)
                        comedianNameArrayEnd.push(tempIndex)
                        comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO start

                        //Look for comedian BIO end
                        tempIndex = tempIndex + 1
                        tempIndex = answer.indexOf('</p>',tempIndex)
                        comedianBioArrayEnd.push(tempIndex)

                    } else{
                        i = tempIndex
                    }
                } 
                //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

                let D = 0
                while(D != comedianNameArrayStart.length){
                console.log(D + 1)
                console.log('NAME: ' + answer.substring(comedianNameArrayStart[D],comedianNameArrayEnd[D]))
                D = D + 1
                }
                //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/



                //while(htmlStringIndex != finalIndex){
                    // <h2><span class=\"bold\">

                    
                    
                    
                    //LOOP
                    // Check for showtime
                        // Check for Comic Name



                    //GO TO THE NEXT INDEX
                //}
            } // INSIDE IN SCOPE DAY
            else{console.log('No Comedians added yet for ' + dateFormatted)}

            dayIndex.setDate(dayIndex.getDate() + 1)
            var dd = String(dayIndex.getDate()).padStart(2, '0')
            var mm = String(dayIndex.getMonth() + 1).padStart(2, '0')
            var yyyy = dayIndex.getFullYear()
            dateFormatted = '\"'+yyyy + '-' + mm + '-' + dd+'\"'
            data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
            index = index + 1
        }//iterate through all days


        navigation = new Navigation(page)
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        let date = yyyy + '-' + mm + '-' + dd

        

        const [resp]= await Promise.all([ //trigger Avive emergency
            page.waitForResponse(resp => resp.url().includes('https://www.showplaceicon.com/Browsing/Cinemas/Compare?Cinemas=8875')),
            page.goto('https://www.showplaceicon.com/Browsing/Cinemas/Compare?Cinemas=8875&Date=' + date),
           ]);
       
        //console.log(await page.locator('.session-time ').count()) // can try .innertext 
        //console.log(await page.locator('.session-time ').nth(0).innerText())
        //console.log(await page.locator(':has-text("session-time ")').count())
        
        const body= await resp.text()
        let scope: number = 0
        let i: number = 0
        let instances: number[]=[]
        // find all starting indexes of a string occurance
        while (i != -1){
            scope = body.indexOf('-time \"',i)
            
            if(scope > 0){
                i = scope + 1
                instances.push(scope)
            } else{
                i = scope
            }
        }
        //sanity check
        if(instances.length != await page.locator('.session-time ').count()){
            throw new Error('Show Parser is Jacked')
        }

        scope = 0
        i = 0
        let www: number[]=[]

        // get the other end of the substring so you now isolated everything into substrings
        while (i != instances.length){
            scope = body.indexOf('www',instances[i] - 133)
            i = i + 1
            www.push(scope) 
        }

        i = 0
        //format substring 
        while (i != instances.length){
            let first = 'https://' + body.slice(www[i],instances[i]-16)
            first = first.replace(/amp;/g,'')
            //console.log(first)
            i = i + 1 
        }
        
        await page.locator('.session-time ').nth(0).click() // NEED MORE LOGIC TO ITERATE THROUGH ALL COUNT
        await page.getByRole('button', { name: 'plus' }).nth(0).click()
        await page.getByRole('button', { name: 'Next' }).isVisible()
        
        //Seating-Theatre

        const [resp1]= await Promise.all([ //trigger Avive emergency
            page.waitForResponse(resp1 => resp1.url().includes('https://www.showplaceicon.com/Ticketing/visSelectTickets')),
            await page.getByRole('button', { name: 'Next' }).click(),
           ]);
       
        //console.log(await page.locator('.session-time ').count()) // can try .innertext 
        //console.log(await page.locator('.Seating-Theatre').innerHTML()) **********************************************
        //console.log(await page.locator(':has-text("session-time ")').count())
        
        const body1= await resp.text()
        let scope1: number = 0
        let i1: number = 0
        let instances1: number[]=[]
        //console.log(body1)

        //await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
        await page.waitForTimeout(3000)
        
    })
})


test.describe('COMEDY MOB EAST', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.ComedyEastsetup()
        console.log(hooks.comedyMobEasturl)
        
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

test.describe('KERASOTES', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        
        hooks = new Hooks(page)
        await hooks.kerasotesSetup()
        //console.log(hooks.kerasotesSetup)
        
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

    test.skip('Base setup: ', async ({ page, request }) => {

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