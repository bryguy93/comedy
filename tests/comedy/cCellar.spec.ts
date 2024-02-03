import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { asyncWriteFile, postRequest } from '../../utils/helpers'
import axios from "axios";
import mysql from 'mysql2/promise'
import { connect } from 'http2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

test.describe('COMEDY CELLAR', () => {

    test('On the minute checks', async ({ page, request }) => {

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
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let targetDays: number = 3
        let finalLineupArray: string[]=[]  
        //let finalMasterTimes: string[]=[]
    
        while ( index != targetDays){ // change this to iterate for 30 days

            let noComedians: boolean = false
            let finalMasterTimes: string[]=[]
            const [answer] = await Promise.all([
                postRequest(url, headers, data),
                
            ])

            if(answer.toString().indexOf('No Comedians added yet!') == -1){ // ON EACH IN SCOPE DATES

                // Now we're iterating on each inscope date's raw HTML as String
                //Parse string for showtime and then Comedian and loop
                let tempIndexArrayStart: number[]=[]
                let tempIndexArrayEnd: number[]=[]
                let i: number = htmlStringIndex
                let tempTimeIndex: number = 0
                while (i != -1){
                    
                    tempTimeIndex = answer.indexOf('<h2><span class=\\"bold\\">',i)
                        
                    if(tempTimeIndex > 0){
                        i = tempTimeIndex + 2
                        tempIndexArrayStart.push(tempTimeIndex + 25)
                        tempTimeIndex = answer.indexOf('<span class=\\"hide-mobile\\">',i)
                        tempIndexArrayEnd.push(tempTimeIndex)

                    } else{
                        i = tempTimeIndex
                    }
                } // GRAB ALL THE TIMES DATA FOR THIS DAY

                let finalTimeArray: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    finalTimeArray.push(answer.substring(tempIndexArrayStart[i],tempIndexArrayEnd[i]))
                }

                // HERE WE HAVE ALL TIME DATA in tempIndexArrayStart and End for the current day
                //Get substring based on collected times data
                let substringArrayStart: number[]=[]
                let substringArrayEnd: number[]=[]
                let tempSub = tempIndexArrayStart.length - 1
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    
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
        
                //let finalLineupArray: string[]=[]
        
                for(i = 0; i < finalTimeArray.length; i ++){
                    //for current index html, extract name and bio
                    let comedianNameArrayStart: number[]=[]
                    let comedianNameArrayEnd: number[]=[]
                    let comedianBioArrayStart: number[]=[]
                    let comedianBioArrayEnd: number[]=[]
                    let a: number = 0
                    let tempIndex: number = 0
                    while (a != -1){
                        //console.log(rawHtmlByTime[0])
                        //console.log(a)
                        tempIndex = rawHtmlByTime[i].toString().indexOf('<p><span class=\\"name\\">',a)

                        if(tempIndex > 0){
                            a = tempIndex + 2
                            comedianNameArrayStart.push(tempIndex + 24)
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</span>',a)
                            comedianNameArrayEnd.push(tempIndex)
                            //comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO start

                            //Look for comedian BIO end
                            //a = tempIndex + 8
                            //tempIndex = rawHtmlByTime[i].toString().indexOf('</p>',tempIndex)
                            //comedianBioArrayEnd.push(tempIndex)
                            //a = tempIndex
                            
                        } else{
                            a = tempIndex
                        }
                    }

                    let tempString: string = ''
                    let b: number
                    for(b = 0; b < comedianNameArrayStart.length; b ++){
                        tempString = tempString + rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b])
                        if(b != comedianNameArrayEnd.length - 1){
                            tempString = tempString + ','
                        }
                    }

                    finalLineupArray.push(tempString)

                    
                }
                let c: number
                // TRANSFERRRRR to a more general variable
                for(c = 0; c < finalTimeArray.length; c ++){
                    finalMasterTimes.push(finalTimeArray[c])
                }
                
                
            } // INSIDE IN SCOPE DAY
            else{
                noComedians = true
                //console.log('No Comedians added yet for ' + dateFormatted)
            
            }

            

            if(noComedians == false){
                let b: number
                console.log(dateFormatted)
                for(b = 0; b < finalMasterTimes.length; b ++){
                    console.log(finalMasterTimes[b] + ': '+ finalLineupArray[b])
                }
            } else{console.log('No Comedians added yet for ' + dateFormatted)}

            console.log(dateFormatted)
            //console.log('break')
            //console.log(finalLineupArray)

            // FEB 3 a/o Feb 3 ASSERTIONS
            if(index == 0){
                
                expect(finalMasterTimes[0] == '6:00 pm','Expected 6:00 pm but got ' + finalMasterTimes[0]).toBeTruthy()
                expect(finalMasterTimes[finalMasterTimes.length - 1] == '12:55 am','Expected 12:55 am but got ' + finalMasterTimes[0]).toBeTruthy()
                expect(finalLineupArray[finalLineupArray.length - 1] == 'Simeon Goodson,H.Foley,Erin Jackson,Pat Burtscher,Alex Kumin,Tyler Fischer','Expected \'Simeon Goodson,H.Foley,Erin Jackson,Pat Burtscher,Alex Kumin,Tyler Fischer\' but got ' + finalLineupArray[0]).toBeTruthy()
                expect(finalLineupArray[0] == 'Rich Aronovitch,Wali Collins,Maddie Wiener,Aminah Imani,Ethan Simmons-Patterson,Chris Turner','Expected \'Rich Aronovitch,Wali Collins,Maddie Wiener,Aminah Imani,Ethan Simmons-Patterson,Chris Turner\' pm but got ' + finalLineupArray[0]).toBeTruthy()
                
            }

            // FEB 5 a/o Feb 3 ASSERTIONS
            if(index == 2){
                
                expect(finalMasterTimes[0] == '7:00 pm','Expected 7:00 pm but got ' + finalMasterTimes[0]).toBeTruthy()
                expect(finalLineupArray[0] == 'Nick Griffin,Colin Quinn','Expected \'Nick Griffin,Colin Quinn\' pm but got ' + finalLineupArray[0]).toBeTruthy()
                expect(finalMasterTimes[finalMasterTimes.length - 1] == '11:30 pm','Expected 11:30 pm but got ' + finalMasterTimes[0]).toBeTruthy()
                expect(finalLineupArray[finalLineupArray.length - 1] == 'Simeon Goodson,Mike Feeney,Jordan Jensen,Shafi Hossain,Caitlin Peluffo,Brian Scolaro,Dave Attell','Expected \'Simeon Goodson,Mike Feeney,Jordan Jensen,Shafi Hossain,Caitlin Peluffo,Brian Scolaro,Dave Attell\' but got ' + finalLineupArray[0]).toBeTruthy()
                
            }

            //targetDays
            index = index + 1
            if(index != targetDays){
                dayIndex.setDate(dayIndex.getDate() + 1)
                var dd = String(dayIndex.getDate()).padStart(2, '0')
                var mm = String(dayIndex.getMonth() + 1).padStart(2, '0')
                var yyyy = dayIndex.getFullYear()
                dateFormatted = '\"'+yyyy + '-' + mm + '-' + dd+'\"'
                data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
            }
            //FYI finalMasterTimes was transferred from finalTimeArray which is declared inside the loop so it resets every day
            //reset finalLineupArray bc it is declared outside of the master loop and is reused
            finalLineupArray = []
            
        }//iterate through all days

        //asyncWriteFile('\n' + currentFormText)
        //await page.waitForTimeout(3000)
        
    })
})


test.describe('Mysql Connection and Queries', () => {

    let hooks: Hooks
    let navigation: Navigation

    test.skip('Db experimental', async ({ page, request }) => {

        //get the client
        const mysql = require('mysql2')

        let password = process.env.dbPassword
        if(password === undefined){
            console.log('retry')
            const dotenv = require('dotenv');
            dotenv.config({path: './page-objects/components/secrets.env'})
            password = process.env.dbPassword
        }

        console.log(password)
        // Create the connection to database
        const connection = mysql.createConnection({
            host: 'database-test1.c3egi00mq4df.us-east-1.rds.amazonaws.com',
            port: 3306,
            //ssl: 'Amazon RDS',
            user: 'admin',
            password: password, 
            //database: 'database-test1',
        })

        console.log(connection)
        console.log('GUCCI')
        //asyncWriteFile('\n' + currentFormText)
        
    })

    test.skip('Db Connection v1', async ({ page, request }) => {

        //get the client
        let examnple: string = 'oof'

        let host = process.env.dbHost // NEED TO ADD TO CI/CD SECRETS
        let password = process.env.dbPassword // NEED TO ADD TO CI/CD SECRETS
        if(password === undefined){
            const dotenv = require('dotenv');
            dotenv.config({path: './page-objects/components/secrets.env'})
            password = process.env.dbPassword
        }
        if(host === undefined){
            const dotenv = require('dotenv');
            dotenv.config({path: './page-objects/components/secrets.env'})
            host = process.env.dbHost
        }
        
        try {
            const connection = await mysql.createConnection({
                host: host,
                port: 3306,
                user: 'admin',
                password: password, 
                database: 'pocDb'
              
            });

            const [rows, fields] = await connection.execute(
                'DELETE FROM `Shows` WHERE `UID`  = 2'  
              );    

            console.log(rows)
            console.log(fields)
            
          } catch (err) {
            console.log(err);
          }

        //console.log(connection)
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