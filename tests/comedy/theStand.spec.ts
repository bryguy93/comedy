import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { getRequest, formatDate, dbIfRecordsExist, dbEstablishConnection, dbAddShow, queryShowsByVenueAndDate, deleteByUID, countShowsByVenueAndDate } from '../../utils/helpers'




test.describe('THE STAND', () => {

    let navigation: Navigation

    test('On the hour checks', async ({ page, request }) => {

        navigation = new Navigation(page)
        
        const headers = navigation.theStandheaders
        let tempUrl = navigation.theStandUrl        
        
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let targetDays: number = 2
        let finalDbArray: string[][]=[]
        let validUIDs: number[] = []
        
        let dayIndex: Date = new Date() //current index in day string
        let dateFormatted = formatDate(dayIndex)
        let data = ''

        let url = tempUrl + '/' + dateFormatted.replace(/"/g,'')
        //console.log("URL USED: " + url)
        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])

        while ( index != targetDays){ // change this to iterate for 30 days

            let noComedians: boolean = false
            let finalLineupArray: string[]=[]  
            let finalTimeArray: string[]=[]
            let finalRoomArray: string[]=[] //**************** NEW CODE */
            let finalComedianArray: string[][]=[]
            let finalBioArray: string[][]=[]

            url = tempUrl + '/' + dateFormatted.replace(/"/g,'')
            //console.log("URL USED: " + url)
            const [answer] = await Promise.all([
                getRequest(url, headers),
            ])
            
            if(answer.toString().indexOf('Sorry no shows are currently scheduled for this date!') == -1){ // ON EACH IN SCOPE DATES

                // Now we're iterating on each inscope date's raw HTML as String
                //Parse string for showtime and then Comedian and loop
                let tempIndexArrayStart: number[]=[]
                let tempIndexArrayEnd: number[]=[]
                let tempRoomStart: number[]=[]
                let tempRoomEnd: number[]=[]
                let i: number = htmlStringIndex
                let tempTimeIndex: number = 0
                let tempRoomIndex: number = 0

                while (i != -1){ // GRAB ALL THE TIMES substring index DATA FOR CURRENT IN SCOPE DATE
                    
                    tempTimeIndex = answer.indexOf('</span> | <span class=\\"show_date\\">',i)
                    tempRoomIndex = answer.indexOf('<span class=\\"list-show-room\\">',i)
                    
                    if(tempTimeIndex > 0){
                        i = tempTimeIndex + 2
                        tempIndexArrayStart.push(tempTimeIndex + 38)
                        tempRoomStart.push(tempRoomIndex + 31)
                        tempTimeIndex = answer.indexOf('<span> <span class=\\"list-show',i)
                        tempRoomIndex = tempRoomIndex + 30
                        tempRoomIndex = answer.indexOf('<',tempRoomIndex)   //************** NEW CODE THAT NEEDS TO CHANGE */
                        tempIndexArrayEnd.push(tempTimeIndex)
                        tempRoomEnd.push(tempRoomIndex) //************** NEW CODE THAT NEEDS TO CHANGE */

                    } else{
                        i = tempTimeIndex
                    }
                } 
                
                //Leverage start and end indexes to Generate final timeslot strings array
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    finalTimeArray.push(answer.substring(tempIndexArrayStart[i],tempIndexArrayEnd[i]))
                    console.log('TIMESLOTS: ' + finalTimeArray[i])
                }

                //*************************************** */ NEW CODE
                for(let i = 0; i < tempRoomEnd.length; i++){
                    
                    let tempRoom: string = answer.substring(tempRoomStart[i],tempRoomEnd[i])

                    if(tempRoom == 'Main&nbsp;room'){
                        finalRoomArray.push('Main Room')
                        console.log('ROOMS: ' + finalRoomArray[i])    
                    } else {
                        finalRoomArray.push(answer.substring(tempRoomStart[i],tempRoomEnd[i]))
                        console.log('ROOMS: ' + finalRoomArray[i])                            
                    }
                }
                //*************************************** */ NEW CODE

                //console.log(tempIndexArrayStart)
                //console.log(tempIndexArrayEnd)
                //console.log(finalTimeArray)
                // HERE WE HAVE ALL TIME SLOTS DATA in tempIndexArrayStart and End for the current day
                //Get html substring per each time slot's starting and ending index (e.g. 1st iteration html starting index is starting index for the time to starting index of time + 1, and so on)
                let substringArrayStart: number[]=[]
                let substringArrayEnd: number[]=[]
                let tempSub = tempIndexArrayStart.length - 1
                
                
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    
                    substringArrayStart.push(tempIndexArrayEnd[i])
                    //console.log(substringArrayStart[i]-8)
                    //console.log(substringArrayStart[i])
                    //console.log(answer.substring(substringArrayStart[i] - 8,substringArrayStart[i]))
                        
                    if( i == tempSub ){
                        substringArrayEnd.push(answer.length)
                    } else{
                        substringArrayEnd.push(tempIndexArrayStart[i+1])
                    }
                }

                //console.log('HTML substring')
                //console.log('ARRAY START: ')
                //console.log(substringArrayStart)
                //console.log('ARRAY END: ')
                //console.log(substringArrayEnd)
                
                //Leverage start indexes to Generate final raw HTML strings array
                let rawHtmlByTime: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    //console.log('ARRAY START INDEX: ' + substringArrayStart[i])
                    rawHtmlByTime.push(answer.substring(substringArrayStart[i],substringArrayEnd[i]))
                    
                    //console.log('RAW HTML: '+ rawHtmlByTime[2])
                }
                
                //iterate through timeslots/broken up html index
                for(i = 0; i < finalTimeArray.length; i ++){
                    //iterate through all html strings, extract name and bio
                    let comedianNameArrayStart: number[]=[]
                    let comedianNameArrayEnd: number[]=[]
                    let comedianBioArrayStart: number[]=[]
                    let comedianBioArrayEnd: number[]=[]
                    let tempComedianArray: string[]=[]
                    let tempBioArray: string[]=[]
                    let a: number = 0
                    let tempIndex: number = 0

                    //on current timeslot html, parse through whole string and save each comedian name
                    while (a != -1){
                        
                        //****************** NEW CODE */
        //              let newTemp = rawHtmlByTime[i].toString().indexOf('\\"img-fluid\\">',a)
                        // ----->\
                        tempIndex = rawHtmlByTime[i].toString().indexOf('\\"img-fluid\\">',a)

                        //let charRef = String.raw`\d`[0]
                        while(rawHtmlByTime[i].charAt(tempIndex + 14) == '\\'){
                            tempIndex = tempIndex + 15
                            tempIndex = rawHtmlByTime[i].toString().indexOf('\\"img-fluid\\">',tempIndex)
                        }
                        //console.log(rawHtmlByTime[i].substring(newTemp,newTemp + 30))
                        //console.log('The char after nameStartIndex is: ' + rawHtmlByTime[i].charAt(tempIndex + 14) + rawHtmlByTime[i].charAt(tempIndex + 15) + rawHtmlByTime[i].charAt(tempIndex + 16))
                        //console.log('The char after nameStartIndex is: ' + rawHtmlByTime[i].charAt(newTemp + 14))
                        //console.log('If the ^ char is < then the below v message should say skip')

                        if(tempIndex > 0){
                            a = tempIndex + 2
                            comedianNameArrayStart.push(tempIndex + 14)
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</div>',a) // get comedian name ending index
                            comedianNameArrayEnd.push(tempIndex)
                            comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO starting index
                            a = tempIndex + 10
                            
                        } else{
                            a = tempIndex
                        }
                    }

                    let tempString: string = ''
                    let b: number
                    let tempchar: string = ''
                    for(b = 0; b < comedianNameArrayStart.length; b ++){
                        
                        tempString = tempString + rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b]) // comedian comma delimited list
                        tempComedianArray.push(rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b])) // new 2d comedian name array
                        //console.log(rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b]))
                        //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                        tempchar = rawHtmlByTime[i].toString().substring(comedianBioArrayStart[b],comedianBioArrayEnd[b])
                        tempBioArray.push(tempchar)
                        //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */

                        if(b != comedianNameArrayEnd.length - 1){
                            tempString = tempString + ','
                        }
                    }

                    finalLineupArray.push(tempString) // single comma delimited string per time in an array(1d)
                    //console.log(finalLineupArray) 
                    finalComedianArray.push(tempComedianArray) // array of comedians per time in an array(2d)
                    //console.log(finalComedianArray)
                    //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                    finalBioArray.push(tempBioArray)
                    //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */

                }    
            } // INSIDE IN SCOPE DAY
            else{
                noComedians = true
            }
            
            if(noComedians == false){

                let f: number
                for(f = 0; f < finalTimeArray.length; f ++){
                    var timeSlot = finalComedianArray[f]
                    //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                    var bioSlot = finalBioArray[f]
                    //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                    let g = 0
                    
                    for(g = 0; g < timeSlot.length; g ++){

                        //SQL CHECKS IF RECORD EXISTS
                        let showCity: string = 'NYC'
                        let showVenue: string = 'The Stand'
                        let showDate: string = dateFormatted
                        let showTime: string = finalTimeArray[f]
                        let showRoom: string = finalRoomArray[f]
                        let comediansName: string = timeSlot[g]
                        //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                        let comediansBio: string = bioSlot[g]
                        //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */

                        //console.log(showCity, showVenue, showDate, showTime, comediansName)
                        const [answer] = await Promise.all([
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                            dbIfRecordsExist(connection, showCity, showVenue, showDate, showTime, comediansName, showRoom),
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                        ])
                        
                        if(answer > 0){
                            validUIDs.push(answer)
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                            finalDbArray.push(['NYC', 'The Stand', dateFormatted, showTime, comediansName]) // add comedianBio here
                            console.log('Operation: '+finalDbArray.length+' - Nothing to add - exists in DB with UID = ' + answer + '| NYC | The Stand | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g]) // add bioSlot[g]
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                        } else{
                              
                            const [answer] = await Promise.all([
                                //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                                dbAddShow(connection, showCity, showVenue, showDate, showTime, comediansName, 'PLACEHOLDER'), // add comedianBio here
                                //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                            ])
                            
                            validUIDs.push(answer)
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
                            finalDbArray.push(['NYC', 'The Stand', dateFormatted, showTime, comediansName]) // add comedianBio here
                            console.log('Operation: '+finalDbArray.length+' - Adding to DB - ' +answer + ' = '+ 'NYC | The Stand | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g]) // add bioSlot[g]
                            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */

                        //PHASE II maybe?
                        // to Wrap, try and refactor to load up all inserts and send in one bulk query for efficiency
                            // the check for DB values vs script will be faster too because you can do everything script side.
                            
                        }
                    }
                }

            } else{console.log('No Comedians added yet for ' + dateFormatted)}

            index = index + 1 // setup to iterate on the next day
            if(index != targetDays){
                dayIndex.setDate(dayIndex.getDate() + 1)
                dateFormatted = formatDate(dayIndex)
                //data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
            }
        }//iterate through all days
        
        let today: string = formatDate(new Date()) //current index in day string
        console.log('Script range: '+ today.replace(/['"]+/g, '') + ' -> ' + formatDate(dayIndex).replace(/['"]+/g, ''))

        const [answer] = await Promise.all([
            queryShowsByVenueAndDate(connection,'NYC','The Stand',today, formatDate(dayIndex)),
        ])
        
        let answer1 = Object.values(JSON.parse(JSON.stringify(answer)));
        let tempString: any
        let dbUIDS: any[] = []
        let dbUIDSinfo: any[][] = []
        let r: number
        for(let r = 0; r < answer1.length; r++){

            tempString = Number(Object.values(JSON.parse(JSON.stringify(answer[r])))[0])       
            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */     
            dbUIDSinfo.push([tempString, Object.values(JSON.parse(JSON.stringify(answer[r])))[1], Object.values(JSON.parse(JSON.stringify(answer[r])))[2], Object.values(JSON.parse(JSON.stringify(answer[r])))[3], Object.values(JSON.parse(JSON.stringify(answer[r])))[4], Object.values(JSON.parse(JSON.stringify(answer[r])))[7]])
            //********** HAVENT TOUCH THIS BUT NEED TO GET RID OF BIO */
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

            console.log('Everything in line for the NYC The Stand')            

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
                countShowsByVenueAndDate(connection,'NYC','The Stand',today, formatDate(dayIndex)),
            ])
            let result1 = Object.values(JSON.parse(JSON.stringify(answerL[0])))[0]
            console.log("DB now has # rows: " + result1)
            expect(finalDbArray.length == result1,'Something has gone terribly wrong ... final cleanup did not work ').toBeTruthy()
            
        } else {expect(finalDbArray.length == answer1.length,'Something has gone terribly wrong ... not all script rows were added to the DB ').toBeTruthy()}
        
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
            dbAddShow(connection, showCity, showVenue, showDate, showTime, comediansName, comediansBio),
        ])
        console.log(answer)

        //console.log(connection)
        //asyncWriteFile('\n' + currentFormText)
    })
})