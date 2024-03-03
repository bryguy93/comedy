import { test, expect } from '@playwright/test'
import { Hooks } from '../../../page-objects/components/Hooks'
import { Navigation } from '../../../page-objects/components/Navigation'
import { postRequest, countShowsByVenueAndDate, formatDate, dbIfRecordsExist, dbEstablishConnection, dbAddShow, queryShowsByVenueAndDate, deleteByUID, getRequest, asyncWriteFile, formatDate2, aiNameDetection } from '../../../utils/helpers'
import * as cheerio from 'cheerio'
import { getDefaultAutoSelectFamily } from 'net'


test.describe('COMEDY CELLAR', () => {

    let navigation: Navigation

    test('On the hour checks', async ({ page, request }) => {

        navigation = new Navigation(page)
        
        const headers = navigation.theStoreheaders
        const url = navigation.theStoreUrl        
        
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let targetDays: number = navigation.reportDays
        let finalDbArray: string[][]=[]
        let validUIDs: number[] = []

        let dayIndex: Date = new Date() //current index in day string
        let dayIndexLast: Date = new Date() // will be used for last in scope day
        let dateFormatted = formatDate(dayIndex)
        let data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'


        const [payload] = await Promise.all([
            getRequest(url, headers),
        ])

        const $ = cheerio.load(payload)
        //htmlLoad('div.footer_wrap').text()

        //console.log($('script').text())
        //asyncWriteFile('\n' + $('script').text())

        const matchX = $.text().match(/var upcoming_events = (.*)}];/)! ;
        //console.log(matchX)
        //asyncWriteFile(matchX[0])
        
        // TEMP VAR FOR FASTER DEV *********************************
        //let matchXtemp = [process.env.tempSecret] // NEED TO ADD TO CI/CD SECRETS
        //if(matchXtemp[0] === undefined){
          //  const dotenv = require('dotenv');
            //dotenv.config({path: './page-objects/components/secrets.env'})
            //matchXtemp[0] = process.env.tempSecret!
        //}
        // TEMP VAR FOR FASTER DEV ******************************************

        let tempS = matchX[0].slice(23,matchX[0].length - 1)
        //let tempS = matchXtemp[0].slice(23,matchXtemp[0].length - 1)    
        
        tempS = '{ "elements": [' + tempS.replace(/\\"/g, '"') + '}' // replace escaped quotes with quotes
        var obj = JSON.parse(tempS)

        let dayIndexFormatTimestamp = Date.parse(formatDate2(dayIndex))
        dayIndexLast.setDate(dayIndex.getDate() + targetDays)
        let dayIndexFormatTimestamp2 = Date.parse(formatDate2(dayIndexLast))
        
        let rawDate: string
        let currDate: string
        let currDateFinal: number
        let control = 0

        let showCity: string = 'Los Angeles'
        let showVenue: string = 'Comedy Store'
        let showDate: Date
        let showTime: string
        let showRoom: string
        let aiQueue: string[]=[]
        let finalShows: any[][] = []
        
        for(let i = 0; i < obj['elements'].length; i++){ // iterate through all shows for ComedyStore LA
            
            rawDate = obj['elements'][i]['event_start'].slice(0,10)
            currDate = rawDate.replace(/-/g, '/')
            currDate = currDate.slice(5) +'/'+currDate.slice(0,4)
            currDateFinal = Date.parse(currDate)
            showTime = obj['elements'][i]['time_title']
            showTime = obj['elements'][i]['time_title'].slice(0,showTime.length - 2) + ' ' + obj['elements'][i]['time_title'].slice(showTime.length-2, showTime.length)
            
            if(currDateFinal >= dayIndexFormatTimestamp && currDateFinal <= dayIndexFormatTimestamp2){ // only do anything if show in scope
                
                //"2024-03-03" | 1:30 pm
                //showDate = new Date(currDateFinal) 
                //(connection, showCity, showVenue, showDate, showTime, 'ROOM_PLACE_HOLDER', comediansName, comediansBio)
                finalShows.push([showCity, showVenue, '"'+rawDate+'"',showTime ,obj['elements'][i]['venue_name'].slice(15),obj['elements'][i]['title'],'-' ])
                aiQueue.push(obj['elements'][i]['title'])
                
            }

        }
        console.log(finalShows)
        console.log('INPUT INTO AI')
        //console.log(aiQueue)

        const finalAiQ = JSON.stringify(Object.assign({}, aiQueue))
        console.log(JSON.parse(finalAiQ))
        //asyncWriteFile('\n' + JSON.parse(finalAiQ))

        //console.log(aiQueue.length)
        const [answerQ] = await Promise.all([
               aiNameDetection(finalAiQ),
        ])

        console.log('AI OUTPUT')
        console.log(answerQ)
        //console.log(Object.keys(answerQ).length)
        //console.log(answerQ[0][0])

        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])
        
        console.log('AI SANITY CHECK: ' + Object.keys(answerQ).length + ' = ' + finalShows.length)
        let f: number
        for(f = 0; f < finalShows.length; f ++){

            //if (answerQ[f] === undefined || answerQ[f].length == 0){
              //  answerQ[f] = [finalShows[f][5]]
            //}

            //let showComedianTemp: any[] = answerQ[f]
            //let showComedian: string[] = []
            //var timeSlot = finalComedianArray[f]
            //var bioSlot = finalBioArray[f]

            //if (showComedianTemp === undefined || showComedianTemp.length == 0){
              //  showComedian.push(finalShows[f][5])
                //answerQ[f] = 'N/A'
            //} else {showComedian.push(answerQ[f])}

            let g = 0
            for(g = 0; g < Object.keys(answerQ[f]['names']).length; g ++){

                //SQL CHECKS IF RECORD EXISTS
                
                let showDate: string = finalShows[f][2]
                let showTime: string = finalShows[f][3]
                let showRoom: string = finalShows[f][4]
                let comediansName: string
                if(answerQ[f]['names'][g] == 'N/A'){
                    comediansName = finalShows[f][5]
                }else{comediansName = answerQ[f]['names'][g]}
                //let comediansName: string = answerQ[f]['names'][g]
                //"2024-03-03" | 1:30 pm
                

                const [answer] = await Promise.all([
                    dbIfRecordsExist(connection, showCity, showVenue, showDate, showTime,showRoom, comediansName, '-'),
                ])
                
                if(answer > 0){
                    validUIDs.push(answer)
                    finalDbArray.push([showCity, showVenue, showDate, showTime, comediansName, '-']) // added comedian BIO here
                    console.log('Operation: '+finalDbArray.length+' - Nothing to add - exists in DB with UID = ' + answer + '| ' + showCity + ' | ' + showVenue + ' | ' + showDate +' | ' + showTime + ' | '+ showRoom + ' | '+ comediansName + ' | - ')
                } else{
                        
                    const [answer] = await Promise.all([
                        dbAddShow(connection, showCity, showVenue, showDate, showTime, showRoom, comediansName, '-'),
                    ])
                    
                    validUIDs.push(answer)
                    finalDbArray.push([showCity, showVenue, showDate, showTime, comediansName, '-']) // added comedian BIO here
                    console.log('Operation: '+finalDbArray.length+' - Adding to DB - ' + answer + ' = '+ showCity +' | '+ showVenue +' | ' + showDate +' | ' + showTime + ' | ' + showRoom + ' | ' + comediansName + ' | - ')
                    
                }
            }
        }

        
        let today: string = formatDate(new Date()) //current index in day string
        console.log('Script range: '+ today.replace(/['"]+/g, '') + ' -> ' + formatDate(dayIndexLast).replace(/['"]+/g, ''))

        const [answer] = await Promise.all([
            queryShowsByVenueAndDate(connection,showCity,showVenue,today, formatDate(dayIndexLast)),
        ])
        
        let answer1 = Object.values(JSON.parse(JSON.stringify(answer)));
        let tempString: any
        let dbUIDS: any[] = []
        let dbUIDSinfo: any[][] = []
        let r: number
        for(let r = 0; r < answer1.length; r++){

            tempString = Number(Object.values(JSON.parse(JSON.stringify(answer[r])))[0])            
            dbUIDSinfo.push([tempString, Object.values(JSON.parse(JSON.stringify(answer[r])))[1], Object.values(JSON.parse(JSON.stringify(answer[r])))[2], Object.values(JSON.parse(JSON.stringify(answer[r])))[3], Object.values(JSON.parse(JSON.stringify(answer[r])))[4], Object.values(JSON.parse(JSON.stringify(answer[r])))[5], Object.values(JSON.parse(JSON.stringify(answer[r])))[6], Object.values(JSON.parse(JSON.stringify(answer[r])))[11]])
            dbUIDS.push(tempString)

        }

        console.log('Database size: '+dbUIDS.length)
        console.log('Script size: '+validUIDs.length)
        
        var dbKickouts = dbUIDS.filter((word) => !validUIDs.includes(word));

        if (dbKickouts.length > 0){
        console.log('Kickouts: '+dbKickouts)
        } else { console.log('No Kickouts')}
    
        //db and script counts should be in sync as long as no appearences were deleted on the website(e.g. attell removed from late show on Tues)
        if (finalDbArray.length == answer1.length){

            console.log('Everything in line for the ' + showCity + ' ' + showVenue)

        ////if DBcount > scriptCount, then there are exra DB records that need to be deleted due to website update
        } else if (finalDbArray.length < answer1.length){

            console.log('Script has # rows: ' + finalDbArray.length)
            console.log('DB has # rows: ' + answer1.length)

            let p: number
            for(let p = 0; p < dbUIDSinfo.length; p++){

                if(dbKickouts.includes(dbUIDSinfo[p][0])){
                    
                    const [omega] = await Promise.all([
                        deleteByUID(connection, dbUIDSinfo[p][0]),
                    ])
                    if(omega == 1){
                        console.log('Deleting this record from the Database: UID=' + dbUIDSinfo[p])
                    }
                }
            }
            const [answerL] = await Promise.all([
                countShowsByVenueAndDate(connection,showCity,showVenue,today, formatDate(dayIndexLast)),
            ])
            let result1 = Object.values(JSON.parse(JSON.stringify(answerL[0])))[0]
            console.log("DB now has # rows: " + result1)
            expect(finalDbArray.length == result1,'Something has gone terribly wrong ... final cleanup did not work ').toBeTruthy()
            
        } else {expect(finalDbArray.length == answer,'Something has gone terribly wrong ... not all script rows were added to the DB ').toBeTruthy()}
        
        connection.end()
        //asyncWriteFile('\n' + currentFormText)
        //await page.waitForTimeout(3000)
        
    })
})


test.describe('Mysql Connection and Query testing', () => {

    let hooks: Hooks
    let navigation: Navigation

    test.skip('Db experimental', async ({ page, request }) => {

        // Create the connection to database
        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])

        const [answer] = await Promise.all([
            deleteByUID(connection, 215),
        ])
        console.log(answer)

        //let answer = queryShowsByVenueAndDate(connection,'NYC','Comedy Cellar','"2024-02-04"', '"2024-02-06"')

        
        //console.log('GUCCI')
        //asyncWriteFile('\n' + currentFormText)
        
    })

    test.skip('Db Connection v1', async ({ page, request }) => {

        //get the client
        //let connection = dbEstablishConnection()
        let showCity: string = 'XCity'
        let showVenue: string = 'XVenue'
        let showDate: string = '2024-02-03'
        let showTime: string = '11:00 PM'
        let comediansName: string = 'XName'
        let comediansBio: string = 'XBio'


        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])

        const [answer] = await Promise.all([
            dbAddShow(connection, showCity, showVenue, showDate, showTime, 'ROOM_PLACEHOLDER', comediansName, 'BIO_PLACE_HOLDER'),
        ])
        console.log(answer)

        //console.log(connection)
        //asyncWriteFile('\n' + currentFormText)
    })
})