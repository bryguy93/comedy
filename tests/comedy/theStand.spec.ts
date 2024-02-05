import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { postRequest, formatDate, dbIfRecordsExist, dbEstablishConnection, dbAddShow, queryShowsByVenueAndDate, deleteByUID } from '../../utils/helpers'



test.describe('THE STAND', () => {

    let navigation: Navigation

    test('On the hour checks', async ({ page, request }) => {

        navigation = new Navigation(page)
        
        const headers = navigation.theStandheaders
        let url = navigation.theStandUrl        
        
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let targetDays: number = 1
        let finalDbArray: string[][]=[]
        let validUIDs: number[] = []
        
        let dayIndex: Date = new Date() //current index in day string
        let dateFormatted = formatDate(dayIndex)
        let data = ''

        url = url + '/' + dateFormatted.replace(/"/g,'')
        console.log("URL USED: " + url)
        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])

        while ( index != targetDays){ // change this to iterate for 30 days

            let noComedians: boolean = false
            let finalLineupArray: string[]=[]  
            let finalTimeArray: string[]=[]
            let finalComedianArray: string[][]=[]
            let finalBioArray: string[][]=[]

            const [answer] = await Promise.all([
                postRequest(url, headers, data),
            ])

            console.log(answer)

            if(answer.toString().indexOf('No Comedians added yet!') == -1){ // ON EACH IN SCOPE DATES

                // Now we're iterating on each inscope date's raw HTML as String
                //Parse string for showtime and then Comedian and loop
                let tempIndexArrayStart: number[]=[]
                let tempIndexArrayEnd: number[]=[]
                let i: number = htmlStringIndex
                let tempTimeIndex: number = 0

                while (i != -1){ // GRAB ALL THE TIMES substring index DATA FOR CURRENT IN SCOPE DATE
                    
                    tempTimeIndex = answer.indexOf('<h2><span class=\\"bold\\">',i)
                    
                    if(tempTimeIndex > 0){
                        i = tempTimeIndex + 2
                        tempIndexArrayStart.push(tempTimeIndex + 25)
                        tempTimeIndex = answer.indexOf('<span class=\\"hide-mobile\\">',i)
                        tempIndexArrayEnd.push(tempTimeIndex)

                    } else{
                        i = tempTimeIndex
                    }
                } 
                
                //Leverage start and end indexes to Generate final timeslot strings array
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    finalTimeArray.push(answer.substring(tempIndexArrayStart[i],tempIndexArrayEnd[i]))
                }

                // HERE WE HAVE ALL TIME SLOTS DATA in tempIndexArrayStart and End for the current day
                //Get html substring per each time slot's starting and ending index (e.g. 1st iteration html starting index is starting index for the time to starting index of time + 1, and so on)
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
                
                //Leverage start indexes to Generate final raw HTML strings array
                let rawHtmlByTime: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    rawHtmlByTime.push(answer.substring(substringArrayStart[i],substringArrayEnd[i]))
                }
        
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

                    //parse for indexes of comedian name and bio ***Can add Website here if exists***
                    while (a != -1){
                        
                        tempIndex = rawHtmlByTime[i].toString().indexOf('<p><span class=\\"name\\">',a)//get comedian name starting index

                        if(tempIndex > 0){
                            a = tempIndex + 2
                            comedianNameArrayStart.push(tempIndex + 24)
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</span>',a) // get comedian name ending index
                            comedianNameArrayEnd.push(tempIndex)
                            
                            comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO starting index

                            
                            a = tempIndex + 8  
                            tempIndex = rawHtmlByTime[i].toString().indexOf('</p>',a) //Get comedian BIO ending index
                            comedianBioArrayEnd.push(tempIndex)
                            a = tempIndex // <- maybe
                            
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
                        tempchar = rawHtmlByTime[i].toString().substring(comedianBioArrayStart[b],comedianBioArrayEnd[b])
                        tempBioArray.push(tempchar)
                        
                        if(b != comedianNameArrayEnd.length - 1){
                            tempString = tempString + ','
                        }
                    }

                    finalLineupArray.push(tempString)
                    finalComedianArray.push(tempComedianArray)
                    finalBioArray.push(tempBioArray)

                }    
            } // INSIDE IN SCOPE DAY
            else{
                noComedians = true
            }
            
            if(noComedians == false){

                let f: number
                for(f = 0; f < finalTimeArray.length; f ++){
                    var timeSlot = finalComedianArray[f]
                    var bioSlot = finalBioArray[f]
                    let g = 0
                    
                    for(g = 0; g < timeSlot.length; g ++){

                        //SQL CHECKS IF RECORD EXISTS
                        let showCity: string = 'NYC'
                        let showVenue: string = 'Comedy Cellar'
                        let showDate: string = dateFormatted
                        let showTime: string = finalTimeArray[f]
                        let comediansName: string = timeSlot[g]
                        let comediansBio: string = bioSlot[g]

                        const [answer] = await Promise.all([
                            dbIfRecordsExist(connection, showCity, showVenue, showDate, showTime, comediansName, comediansBio),
                        ])
                        
                        if(answer > 0){
                            validUIDs.push(answer)
                            finalDbArray.push(['NYC', 'Comedy Cellar', dateFormatted, showTime, comediansName, comediansBio]) // added comedian BIO here
                            console.log('Operation: '+finalDbArray.length+' - Nothing to add - exists in DB with UID = ' + 'NYC | Comedy Cellar | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g] + ' | ' + bioSlot[g])
                        } else{
                              
                            const [answer] = await Promise.all([
                                dbAddShow(connection, showCity, showVenue, showDate, showTime, comediansName, comediansBio),
                            ])
                            
                            validUIDs.push(answer)
                            finalDbArray.push(['NYC', 'Comedy Cellar', dateFormatted, showTime, comediansName, comediansBio]) // added comedian BIO here
                            console.log('Operation: '+finalDbArray.length+' - Adding to DB - ' +answer + ' = '+ 'NYC | Comedy Cellar | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g] + ' | ' + bioSlot[g])

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
                data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
            }
        }//iterate through all days
        
        let today: string = formatDate(new Date()) //current index in day string
        console.log('Script range: '+ today.replace(/['"]+/g, '') + ' -> ' + formatDate(dayIndex).replace(/['"]+/g, ''))

        const [answer] = await Promise.all([
            queryShowsByVenueAndDate(connection,'NYC','Comedy Cellar',today, formatDate(dayIndex)),
        ])
        
        let answer1 = Object.values(JSON.parse(JSON.stringify(answer)));
        let tempString: any
        let dbUIDS: any[] = []
        let dbUIDSinfo: any[][] = []
        let r: number
        for(let r = 0; r < answer1.length; r++){

            tempString = Number(Object.values(JSON.parse(JSON.stringify(answer[r])))[0])            
            dbUIDSinfo.push([tempString, Object.values(JSON.parse(JSON.stringify(answer[r])))[1], Object.values(JSON.parse(JSON.stringify(answer[r])))[2], Object.values(JSON.parse(JSON.stringify(answer[r])))[3], Object.values(JSON.parse(JSON.stringify(answer[r])))[4], Object.values(JSON.parse(JSON.stringify(answer[r])))[7]])
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

            console.log('Everything in line for the NYC Comedy Cellar')

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
            dbAddShow(connection, showCity, showVenue, showDate, showTime, comediansName, comediansBio),
        ])
        console.log(answer)

        //console.log(connection)
        //asyncWriteFile('\n' + currentFormText)
    })
})