import { test, expect } from '@playwright/test'
import { Hooks } from '../../page-objects/components/Hooks'
import { Navigation } from '../../page-objects/components/Navigation'
import { getRequest, formatDate, dbIfRecordsExist, dbEstablishConnection, dbAddShow, queryShowsByVenueAndDate, deleteByUID, asyncWriteFile, monthDiff } from '../../utils/helpers'



test.describe('New York Comedy Club', () => {

    let navigation: Navigation

    test('On the hour checks', async ({ page, request }) => {

        navigation = new Navigation(page)
        
        const headers = navigation.nyccheaders
        const url = navigation.nyccUrl        
        
        let index: number = 0 //current index in day string
        let htmlStringIndex: number = 0
        let targetDays: number = navigation.reportDays
        let finalDbArray: string[][]=[]
        let validUIDs: number[] = []
        let queryMonths: string[] = []
        let masterJson: string = ''
        
        let dayIndex: Date = new Date()  //current index in day string
        console.log('Raw Date:' + dayIndex)
        //dayIndex.setDate(dayIndex.getDate() + 60)
        let dateFormatted = formatDate(dayIndex)
        console.log('Formatted Date:' + dateFormatted)
        let tempDateFormatted = dateFormatted.slice(1,8)  // change to "YYYY-MM" format
        let tempURL = url + tempDateFormatted

        let dd = String(dayIndex.getDate()).padStart(2, '0')
        let ddN = Number(dd)
        let mm = Number(String(dayIndex.getMonth() + 1).padStart(2, '0'))-1
        let yyyy = Number(dayIndex.getFullYear())
        
        let finalDate: Date = new Date() 
        finalDate.setDate(dayIndex.getDate() + navigation.reportDays)
        let ddF = String(finalDate.getDate()).padStart(2, '0')
        let ddNF = Number(ddF)
        let mmF = Number(String(finalDate.getMonth() + 1).padStart(2, '0'))-1
        let yyyyF = Number(finalDate.getFullYear())

        console.log(monthDiff(new Date(yyyy, mm, ddN), new Date(yyyyF, mmF, ddNF)))

        let tempDate: Date
        let s: number 
        tempDate = dayIndex

        // GRAB JSON STRING FOR EACH IN SCOPE MONTH AND THEN ADD TO ONE MASTER JSON STRING
        for(s = 0; s <= monthDiff(new Date(yyyy, mm, ddN), new Date(yyyyF, mmF, ddNF)); s++ ) {

            let tempJson1: string = ''
            let queryResult: any
            if(s == 0){
                console.log(tempDate)
                let mm1 = String(tempDate.getMonth() + 1).padStart(2, '0')
                let yyyy1 = tempDate.getFullYear()
                console.log('QUERY: ' + url + yyyy1 + '-' + mm1)
                const [answer1] = await Promise.all([
                    getRequest(url + yyyy1 + '-' + mm1, headers),
                ])
                queryResult = answer1
                
            } else{
                if (tempDate.getMonth() == 11) {
                    var current = new Date(tempDate.getFullYear() + 1, 0, 1);
                } else {
                    var current = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 1);
                }
            tempDate = current
            console.log(tempDate)
            let mm2 = String(tempDate.getMonth() + 1).padStart(2, '0')
            let yyyy2 = tempDate.getFullYear()
            console.log('QUERY: ' + url + yyyy2 + '-' + mm2)
            const [answer1] = await Promise.all([
                getRequest(url + yyyy2 + '-' + mm2, headers),
            ])
            queryResult = answer1

            }
            let jsonEndIndex1: number
            let jsonStartIndex1: number
            jsonStartIndex1 = queryResult.indexOf('ld+json') + 16
            console.log('Start; ' + jsonStartIndex1)
            jsonEndIndex1 = queryResult.indexOf('script>                  <!-- Google tag (gtag.js)') - 8
            console.log('end: ' + jsonEndIndex1)
            tempJson1 = queryResult.substring(jsonStartIndex1, jsonEndIndex1).replace(/\\n?/g, '')
            //asyncWriteFile('\n' + 'START JSON')
            //asyncWriteFile('\n' + tempJson1)
            //asyncWriteFile('\n')
            masterJson = masterJson + tempJson1

        }

        
        let data = 'action=cc_get_shows&json={"date":'+dateFormatted+',"venue":"newyork","type":"lineup"}'
        const [connection] = await Promise.all([
            dbEstablishConnection(),
        ])
        
        

        
        while ( index != targetDays){ // change this to iterate for 30 days
            
            // CURRENT DATE
            //dayIndex
            //dateFormatted

            let noComedians: boolean = false
            let finalLineupArray: string[]=[]  
            let finalTimeArray: string[]=[]
            let finalRoomArray: string[]=[] //**************** NEW CODE */
            let finalComedianArray: string[][]=[]
            let finalBioArray: string[][]=[]

            let answer = masterJson
            //asyncWriteFile('\n' + answer)
            
            //if(answer.toString().indexOf('No Comedians added yet!') == -1){ // ON EACH IN SCOPE DATES
            //let err: number = answer.toString().indexOf('"startDate": "2024-02-13')
            console.log('IF STATEMENT CHECKS: ' + dateFormatted.slice(0,-1))
            console.log('"startDate": ' + dateFormatted.slice(0,-1))
            if(answer.toString().indexOf('"startDate": ' + dateFormatted.slice(0,-1)) > 0){ // ON EACH IN SCOPE DATES

                
                //Parse string for showtime and then Comedian and loop
                let tempIndexArrayStart: number[]=[]
                let tempIndexArrayEnd: number[]=[]
                let tempRoomStart: number[]=[]
                let tempRoomEnd: number[]=[]
                let i: number = htmlStringIndex
                let tempTimeIndex: number = 0
                let tempRoomIndex: number = 0

                while (i != -1){ // GRAB ALL THE TIMES substring index DATA FOR CURRENT IN SCOPE DATE
                    //console.log(dateFormatted)
                    //console.log('"startDate": ' + dateFormatted.slice(0,-1)+ 'T')
                    tempTimeIndex = answer.indexOf('"startDate": ' + dateFormatted.slice(0,-1)+ 'T',i)
                    //console.log(tempTimeIndex)
                    //console.log(answer.substring(tempTimeIndex + 25,tempTimeIndex + 30))

                    if(tempTimeIndex > 0){
                        i = tempTimeIndex + 2
                        tempIndexArrayStart.push(tempTimeIndex + 25)
                        //tempTimeIndex = answer.indexOf('<span class=\\"hide-mobile\\">',i)
                        tempIndexArrayEnd.push(tempTimeIndex + 30)
                        console.log(answer.substring(tempTimeIndex + 25,tempTimeIndex + 30))
                        tempTimeIndex = tempTimeIndex + 30
                        

                    } else{
                        i = tempTimeIndex
                    }
                    
                } 
                let y: number = 0
                i = 0
                while (i != -1){ // GRAB ALL ADDRESSES substring index DATA FOR CURRENT IN SCOPE DATE
                    
                    //ADDRESS/ROOM
                    // streetAddress
                    // addressLocality

                    //tempTimeIndex = answer.indexOf('</span> | <span class=\\"show_date\\">',i)
                    let tempStr = answer.substring(tempIndexArrayStart[y],tempIndexArrayEnd[y])
                    let utcOffset: number = new Date().getTimezoneOffset()/60
                    //console.log(dateFormatted.slice(1,-1))
                    //console.log(new Date().getTimezoneOffset()/60)
                    
                    //console.log(dateFormatted.slice(1,-1) + 'T' + tempStr + ':00-0'+ String(utcOffset)+ ':00')
                    let refString3: string = dateFormatted.slice(1,-1) + 'T' + tempStr + ':00-0'+ String(utcOffset)+ ':00' + '",      "location": {"@type":"Place","name":"'
                    //console.log(refString3)
                    tempRoomIndex = answer.indexOf(refString3,i)
                    console.log('Start index: ' + tempRoomIndex)
                    if(tempRoomIndex > 0){
                        //i = tempTimeIndex + 2
                        i = tempRoomIndex + 2
                        
                        //tempIndexArrayStart.push(tempTimeIndex + 38)
                        tempRoomStart.push(tempRoomIndex + 70)
                        
                        //tempTimeIndex = answer.indexOf('<span> <span class=\\"list-show',i)
                        tempRoomIndex = answer.indexOf('","address"',i)   //************** NEW CODE THAT NEEDS TO CHANGE */
                        //tempRoomIndex = tempRoomIndex + 30

                        //tempIndexArrayEnd.push(tempTimeIndex)
                        tempRoomEnd.push(tempRoomIndex) //************** NEW CODE THAT NEEDS TO CHANGE */

                    } else{
                        i = tempRoomIndex
                    }
                    y = y + 1
                }

                for(let i = 0; i < tempRoomEnd.length; i++){
                    
                    let tempRoom: string = answer.substring(tempRoomStart[i],tempRoomEnd[i])

                    if(tempRoom == 'New York Comedy Club on 4th Street'){
                        finalRoomArray.push('East Village')
                        console.log('ROOMS: ' + finalRoomArray[i])    
                    } else {
                        //finalRoomArray.push(answer.substring(tempRoomStart[i],tempRoomEnd[i]))
                        finalRoomArray.push('Midtown')
                        console.log('ROOMS: ' + finalRoomArray[i])   
                                              
                    }
                }
                
                
                
                
                
                //Leverage start and end indexes to Generate final timeslot strings array
                for(let i = 0; i < tempIndexArrayStart.length; i++){

                    let timeString: string = answer.substring(tempIndexArrayStart[i],tempIndexArrayEnd[i])

                    let timeString12hr: string = new Date('1970-01-01T' + timeString + 'Z')
                        .toLocaleTimeString('en-US',
                            {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
                        );
                    //console.log(timeString12hr)
                    finalTimeArray.push(timeString12hr)
                    //console.log(finalTimeArray)
                }
                console.log(finalTimeArray)
                console.log(finalRoomArray)

                
                // HERE WE HAVE ALL TIME SLOTS DATA in tempIndexArrayStart and End for the current day
                //Get html substring per each time slot's starting and ending index (e.g. 1st iteration html starting index is starting index for the time to starting index of time + 1, and so on)
                let substringArrayStart: number[]=[]
                let substringArrayEnd: number[]=[]
                let tempSub = tempIndexArrayStart.length - 1

                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    
                    substringArrayStart.push(tempIndexArrayEnd[i])
                        
                    if( i == tempSub ){
                        //substringArrayEnd.push(answer.length) 
                        substringArrayEnd.push(answer.indexOf('@context',tempIndexArrayEnd[i])) 
                        
                    } else{
                        substringArrayEnd.push(tempIndexArrayStart[i+1])
                    }
                    //asyncWriteFile('\n' + '********************************************************************')
                    //asyncWriteFile('\n' + answer.substring(substringArrayStart[i] - 10,substringArrayEnd[i]+10))
                }
                
                

                //Leverage start indexes to Generate final raw HTML strings array
                let rawHtmlByTime: string[]=[]
                for(let i = 0; i < tempIndexArrayStart.length; i++){
                    rawHtmlByTime.push(answer.substring(substringArrayStart[i],substringArrayEnd[i]))
                    //console.log('RAWSTRINGL(' + i + '): ' + rawHtmlByTime[i])
                    asyncWriteFile('\n' + 'RAWSTRINGL(' + i + '): ' + rawHtmlByTime[i])
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
                        
                        tempIndex = rawHtmlByTime[i].toString().indexOf('Person","name',a)//get comedian name starting index

                        if(tempIndex > 0){
                            a = tempIndex + 2
                            comedianNameArrayStart.push(tempIndex + 16)
                            tempIndex = rawHtmlByTime[i].toString().indexOf('"}',a) // get comedian name ending index
                            comedianNameArrayEnd.push(tempIndex)
                            
                            //comedianBioArrayStart.push(tempIndex+7) // easily get comedian BIO starting index

                            
                            //a = tempIndex + 8  
                            //tempIndex = rawHtmlByTime[i].toString().indexOf('</p>',a) //Get comedian BIO ending index
                            //comedianBioArrayEnd.push(tempIndex)
                            a = tempIndex // <- maybe
                            
                        } else{
                            a = tempIndex
                        }
                        //asyncWriteFile('\n' + answer.substring(comedianNameArrayStart[i],comedianNameArrayEnd[i]))
                    }

                    let tempString: string = ''
                    let b: number
                    let tempchar: string = ''
                    for(b = 0; b < comedianNameArrayStart.length; b ++){
                        
                        tempString = tempString + rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b]) // comedian comma delimited list
                        tempComedianArray.push(rawHtmlByTime[i].toString().substring(comedianNameArrayStart[b],comedianNameArrayEnd[b])) // new 2d comedian name array
                        //tempchar = rawHtmlByTime[i].toString().substring(comedianBioArrayStart[b],comedianBioArrayEnd[b])
                        //tempBioArray.push(tempchar)
                        
                        if(b != comedianNameArrayEnd.length - 1){
                            tempString = tempString + ','
                        }
                    }

                    finalLineupArray.push(tempString)
                    finalComedianArray.push(tempComedianArray)
                    asyncWriteFile('\n' + finalComedianArray[i])
                    //finalBioArray.push(tempBioArray)

                }    
            } // INSIDE IN SCOPE DAY
            else{
                noComedians = true
            }
            
            

            if(noComedians == false){

                let f: number
                for(f = 0; f < finalTimeArray.length; f ++){
                    var timeSlot = finalComedianArray[f]
                    //var bioSlot = finalBioArray[f]
                    let g = 0
                    
                    for(g = 0; g < timeSlot.length; g ++){

                        //SQL CHECKS IF RECORD EXISTS
                        let showCity: string = 'NYC'
                        let showVenue: string = 'NYCC'
                        let showDate: string = dateFormatted
                        let showTime: string = finalTimeArray[f]
                        let showRoom: string = finalRoomArray[f]
                        let comediansName: string = timeSlot[g]
                        //let comediansBio: string = bioSlot[g]

                        const [answer] = await Promise.all([
                            dbIfRecordsExist(connection, showCity, showVenue, showDate, showTime, comediansName, showRoom),
                        ])
                        
                        if(answer > 0){
                            validUIDs.push(answer)
                            finalDbArray.push(['NYC', 'NYCC', dateFormatted, showTime, comediansName, showRoom]) // added comedian BIO here
                            console.log('Operation: '+finalDbArray.length+' - Nothing to add - exists in DB with UID = ' + answer + '| NYC | Comedy Cellar | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g] + ' | ' + showRoom)
                        } else{
                              
                            const [answer] = await Promise.all([
                                dbAddShow(connection, showCity, showVenue, showDate, showTime, showRoom, comediansName, 'BIO_PLACE_HOLDER'),
                            ])
                            
                            validUIDs.push(answer)
                            finalDbArray.push(['NYC', 'NYCC', dateFormatted, showTime, comediansName, showRoom]) // added comedian BIO here
                            console.log('Operation: '+finalDbArray.length+' - Adding to DB - ' +answer + ' = '+ 'NYC | NYCC | ' + dateFormatted +' | ' + finalTimeArray[f] + ' | '+ timeSlot[g] + ' | ' + showRoom)

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
            queryShowsByVenueAndDate(connection,'NYC','NYCC',today, formatDate(dayIndex)),
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

            console.log('Everything in line for the NYC NYCC')

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

        try {

            //Comedian Ratings
            //1
            let best: string[] = [ 'Jessica Kirson','Mark Normand','Adrienne Iapalucci','Dave Attell','Jared Freid','Phil Hanley','Jeff Arcuri','Andre Kim','Wil Sylvince','Todd Barry', 'Sergio Chicon' ]
            //2
            let mid: string[] = [ 'Robert Kelly','Jim Norton','Dan Soder','Greer Barnes','Mike Cannon','Roy Wood jr','Yannis Pappas','Colin Quinn','Yamaneika Saunders','Joe List','Rosebud Baker', 'Michael Kosta' ]
            //3
            let least: string[] = [ 'Eagle Witt','Jim Florentine','Jordan Jensen','H.Foley','Jaye McBride','Eleanor Kerrigan','Gianmarco Soresi','Josh Johnson' ]

            let i: number
            for (i = 0; i <  best.length; i++){
                const [rows, fields] = await connection.execute(
                    //'SELECT Comedians.Name, COUNT(*) AS count FROM Shows, Comedians WHERE Shows.UID = Comedians.UID GROUP BY Comedians.Name ORDER BY count DESC;'
                    'UPDATE Comedians SET Rating = "1" WHERE Name = "'+least[i]+'";'
                );    
            }
            
            //asyncWriteFile(JSON.parse(JSON.stringify(rows)) + '')
            //console.log(rows)
            //let result = Object.values(JSON.parse(JSON.stringify(rows)))[0];
            //console.log('Test METHOD: ' + result)
        
            //if(result[1] != 1){ throw new Error('Failed to delete UID '+ UID + ' in the DB')}
            //return result[1]
            //return rows
        
            
          } catch (err) {
            console.log(err);
          }



        
        //const [answer] = await Promise.all([
          //  dbAddShow(connection, showCity, showVenue, showDate, showTime, 'ROOM_PLACEHOLDER', comediansName, 'BIO_PLACE_HOLDER'),
        //])
        //console.log(answer)

        //console.log(connection)
        //asyncWriteFile('\n' + currentFormText)
    })
})