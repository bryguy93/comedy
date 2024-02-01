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

                console.log(finalTimeArray)
                console.log(rawHtmlByTime.length)

                //finalTimeArray[] & rawHtmlByTime[] -> NEED Name[] Bio[] Website[]*   **** may not exist. 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //let tempIndexArrayStart: number[]=[]
                //let tempIndexArrayEnd: number[]=[]

                
                let finalLineupArray: string[]=[]
                let finalBio: string[]=[]
                for(i = 0; i < finalTimeArray.length; i ++){
                    //for current index html, extract name and bio
                    let comedianNameArrayStart: number[]=[]
                    let comedianNameArrayEnd: number[]=[]
                    let comedianBioArrayStart: number[]=[]
                    let comedianBioArrayEnd: number[]=[]
                    let tempArrayIndex: number = 0
                    let a: number = 0
                    let tempIndex: number = 0
                    while (a != -1){
                        //console.log('LOOPING i = ' + a)
                        tempIndex = rawHtmlByTime[i].toString().indexOf('<p><span class=\\"name\\">',a)
                        //console.log('Time Starting Indexes = ' + tempIndex)

                        if(tempIndex > 0){
                            a = tempIndex + 2
                            comedianNameArrayStart.push(tempIndex + 24)
                            //tempArrayIndex = tempArrayIndex + 1
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</span>',a)
                            comedianNameArrayEnd.push(tempIndex)
                            comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO start

                            //Look for comedian BIO end
                            a = tempIndex + 8
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</p>',tempIndex)
                            comedianBioArrayEnd.push(tempIndex)
                            a = tempIndex
                            

                        } else{
                            a = tempIndex
                        }
                    }
                    console.log('Starting Index: ' + comedianNameArrayStart)
                    console.log('Ending index: ' + comedianNameArrayEnd)

                    let tempString: string = ''
                    let b: number
                    for(b = 0; b < comedianNameArrayStart.length; b ++){
                        tempString = tempString + rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b]) + ','
                    }

                    //let stringIndex: number = 0
                    //let finalStringIndex: number
                    //for(b = 0; b < comedianNameArrayStart.length; b ++){
                        //finalStringIndex = tempString.indexOf(',',stringIndex + 1)
                        //finalLineupArray.push(tempString.substring(stringIndex,finalStringIndex))
                        //stringIndex = finalStringIndex + 1
                        
                    //}
                    finalLineupArray.push(tempString)
                    //finalLineupArray
                    //console.log(finalTimeArray[i])
                    //console.log(finalLineupArray)
                    console.log(dateFormatted)
                    for(b = 0; b < finalTimeArray.length; b ++){
                        console.log(finalTimeArray[b] + ': '+ finalLineupArray[b])
                    }
                }

                
                //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
                 
                //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

                
                //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\/\//\//\\/



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


        
        //await expect.soft(page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' )).toBeVisible()
        //const currentFormText = await page.frameLocator('internal:attr=[title="Google Docs embed"i]').frameLocator('#player').getByText('is no longer' ).innerText()
        //asyncWriteFile('\n' + currentFormText)
        
        //await page.waitForTimeout(3000)
        
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