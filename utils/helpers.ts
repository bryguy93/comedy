import { HelperParams } from "../page-objects/HelperParams";
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import axios from "axios";
import mysql from 'mysql2/promise'
//import { start } from "repl";
import OpenAI from "openai";
import { text } from "stream/consumers";


export async function postRequest(url: string,header: any, data: string): Promise<string> {
    
  try {
    //let tempp = 'client_credentials'  
    const response = await axios.post(url, data, header )
    
    let temp =  JSON.stringify(response.data['show'])
    //temp = temp.substring(1).slice(0,-1)
    
    
    
    //let temp = response.data
    return temp
  } catch (error) {
      console.log(error)
      throw new Error('API Post Request Failed')
  }
}

export async function getRequest(url: string,header: any): Promise<string> {
    
  try {
    //let tempp = 'client_credentials'  
    let response = await axios.get(url, header )
    let temp =  JSON.stringify(response.data)
    //temp = temp.substring(1).slice(0,-1)
    //let temp = response.data
    return temp
  } catch (error) {
      console.log(error)
      throw new Error('API Get Request Failed')
  }
}

export async function deleteByUID(connection: any, UID: number): Promise<any> {

    
  try {

    const [rows, fields] = await connection.execute(
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
        
        //'SELECT Shows.UID FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date BETWEEN ' + startDate + ' AND ' + endDate
        'DELETE FROM `Shows` WHERE `UID` = "' + UID.toString() + '"'
      );    
    
    
    
    let result = Object.values(JSON.parse(JSON.stringify(rows)));
    //console.log('Test METHOD: ' + result[0])

    if(result[1] != 1){ throw new Error('Failed to delete UID '+ UID + ' in the DB')}
    return result[1]
    //return rows

    
  } catch (err) {
    console.log(err);
  }
}

export async function countShowsByVenueAndDate(connection: any, showCity: string, showVenue: string, startDate: string, endDate: string): Promise<any> {
    
  try {

    //let insertComedians = 'INSERT INTO `Comedians` SET `UID` = LAST_INSERT_ID(), `CUID` =  UUID_TO_BIN(UUID()), `Name` = "'+comediansName+'";'
    const [rows1, fields1] = await connection.execute(
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
        'SELECT COUNT(*) FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date BETWEEN ' + startDate + ' AND ' + endDate
      );    

    
    let result1 = Object.values(JSON.parse(JSON.stringify(rows1)))
    
    //return result1[2]
    return rows1
        
  } catch (err) {
    console.log(err);
  }
}

export async function queryShowsByVenueAndDate(connection: any, showCity: string, showVenue: string, startDate: string, endDate: string): Promise<any> {
    
  try {

    const [rows, fields] = await connection.execute(
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
        
        //'SELECT Shows.UID FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date BETWEEN ' + startDate + ' AND ' + endDate
        
        'SELECT * FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date BETWEEN ' + startDate + ' AND ' + endDate
        //'SELECT * FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date BETWEEN ' + startDate + ' AND ' + endDate
      );    
    
    //console.log(rows.counts())
    
    //let result = Object.values(JSON.parse(JSON.stringify(rows)));
    //console.log('Test METHOD: ' + result[0])

    //return result
    return rows
    
  } catch (err) {
    console.log(err);
  }
}

export async function dbEstablishConnection(): Promise<any> {
    
  //get the client
  try {
    const connection = await mysql.createConnection({
        host: dbCredGetter('host'),
        port: 3306,
        user: 'admin',
        password: dbCredGetter('password'), 
        database: 'pocDb'
      
    });
    
    return connection
    
  } catch (err) {
    console.log(err);
  }

}

export async function dbIfRecordsExist(connection: any, showCity: string, showVenue: string, showDate: string, showTime: string, showRoom: string, comediansName: string, comediansBio: string): Promise<any> {
    
  try {

    const [rows, fields] = await connection.execute(
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
        
        //'SELECT Shows.UID FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName +' AND Comedians.Bio' + comediansBio + '"'  
        'SELECT Shows.UID FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Shows.Room = "'+showRoom+'" AND Comedians.Name = "'+ comediansName +'"'  
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '")'  
        
      );    
    
    
    //let temp = JSON.stringify(rows[0]
    try{
    let result = Object.values(JSON.parse(JSON.stringify(rows[0])))[0];
    //console.log(rows)
    //console.log(result)
    return result
    } catch (err) {
      return 0
    }
    
  } catch (err) {
    console.log(err);
  }
}

export async function dbAddShow(connection: any, showCity: string, showVenue: string, showDate: string, showTime: string, showRoom: string, comediansName: string, comedianBio: string): Promise<any> {
    
  try {

    let insertShow = 'INSERT INTO `Shows` SET `City` = "'+ showCity +'", `Venue` = "'+ showVenue +'", `Date` = ' + showDate + ', `Time` = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' ) ), `Room` = "'+ showRoom + '";'
    let insertComedians = 'INSERT INTO `Comedians` SET `UID` = LAST_INSERT_ID(), `CUID` =  UUID_TO_BIN(UUID()), `Name` = "'+comediansName+'", `Bio` = "'+ comedianBio +'";'
    //let insertComedians = 'INSERT INTO `Comedians` SET `UID` = LAST_INSERT_ID(), `CUID` =  UUID_TO_BIN(UUID()), `Name` = "'+comediansName+'";'
    
    
    //let insertComedians = 'INSERT INTO `Comedians` SET `UID` = LAST_INSERT_ID(), `CUID` =  UUID_TO_BIN(UUID()), `Name` = "'+comediansName+'";'
    const [rows1, fields1] = await connection.execute(
        //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
        insertShow
      );    
    
    const [rows2, fields2] = await connection.execute(
      //'SELECT EXISTS(SELECT 1 FROM `Shows`, `Comedians` WHERE Shows.UID = Comedians.UID AND Shows.City = "' + showCity +'" AND Shows.Venue = "'+ showVenue +'" AND Shows.Date = ' + showDate + ' AND Shows.Time = TIME( STR_TO_DATE( \''+ showTime + '\', \'%h:%i %p\' )) AND Comedians.Name = "'+ comediansName + '" AND Comedians.Bio = "'+ comediansBio + '")'  
      insertComedians // **** SINCE THIS ISNT A TRANSACTION - CHECK SHOWS TABLE AS PREVIOUS QUERY PROBABLY WENT THROUGH
    );

    let result1 = Object.values(JSON.parse(JSON.stringify(rows1)))

    return result1[2]
        
  } catch (err) {
    console.log(err);
  }
}

export function dbCredGetter(scope: string): any {
    
  if(scope == 'host'){
    let host = process.env.dbHost // NEED TO ADD TO CI/CD SECRETS
    
    if(host === undefined){
        const dotenv = require('dotenv');
        dotenv.config({path: './page-objects/components/secrets.env'})
        host = process.env.dbHost
    }

    return host

  } else{

    let password = process.env.dbPassword // NEED TO ADD TO CI/CD SECRETS

    if(password === undefined){
        const dotenv = require('dotenv');
        dotenv.config({path: './page-objects/components/secrets.env'})
        password = process.env.dbPassword
    }

    return password
  }
}

export function formatDate(today: Date): string {
    
  try {
    
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    let dateFormatted = '\"'+yyyy + '-' + mm + '-' + dd+'\"'
    return dateFormatted

  } catch (error) {
      console.log(error)
      throw new Error(' Date formatter Failed')
  }
}


export function formatDate2(today: Date): string {
    
  try {
    
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    let dateFormatted = '\"'+mm + '/' + dd + '/' + yyyy+'\"'
    return dateFormatted

  } catch (error) {
      console.log(error)
      throw new Error(' Date formatter2 Failed')
  }
}


export function monthDiff(d1: any, d2: any): number {
    
  let months: any
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

//print to log files
export async function asyncWriteFile(data: any) {
    let helperParams: HelperParams
    helperParams = new HelperParams()

    try {
      await fsPromises.writeFile(join(__dirname, helperParams.logFilePath), data, {
        flag: 'a+',
      });
  
      const contents = await fsPromises.readFile(
        join(__dirname, helperParams.logFilePath),
        'utf-8',
      );
  
      return contents;
    } catch (err) {
      console.log(err);
      return 'Something went wrong';
    }
  }

  export async function aiNameDetection(data: any): Promise<any> {
    let helperParams: HelperParams
    helperParams = new HelperParams()

    let apiTestKey = process.env.openAiTestKey // NEED TO ADD TO CI/CD SECRETS
    if(apiTestKey === undefined){
        const dotenv = require('dotenv');
        dotenv.config({path: './page-objects/components/secrets.env'})
        apiTestKey = process.env.openAiTestKey!
    }
    
    try {
      const openai = new OpenAI({
        apiKey: apiTestKey,
      });
      // OLD: You'll be given a javascript array of type string. Create a JSON object which enumerates a set of child objects equal to the input array where the keys are the array indexes and the values are tuples of all names extracted from the strings that correspond to the array index. If no names are extracted, the value should be: 'N/A'. The number of strings in the input array should equal the number of child objects in the JSON output. 
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        messages: [
          {
            "role": "system",                                                                                                                                                                                                                                                                      //no names can be extracted at all
            "content": "You'll be given a javascript JSON object. Create a JSON object which enumerates a set of child objects equal to the number of child objects in the input object. For each child object add an attribute that contains a list of names extracted from the input strings. If a list of names is null or empty, use the name: \"N/A\". "
          },
          {
            "role": "user",
            "content": data.toString()
          }
        ],
        temperature: 0,
        max_tokens: 2500, // works for 15 days
        top_p: 1,
      });
      // max tokens is 16K  1 token = 4 chars(roughly)
      //let obj = JSON.parse(response.choices[0]['message']['content']!)
      console.log('RAW OUTPUT: ' + response.choices[0]['message']['content']!)
      let obj = JSON.parse(response.choices[0]['message']['content']!)
      //console.log(obj)
      //console.log(obj['names'].length)
      //console.log(obj['names'][0])
      //return response.choices[0]['message']['content']
      return obj

    } catch (err) {
      console.log(err);
      return 'OpenAI Error for show(if JSON error, need to increase token size): ' + data
    }
  }

  