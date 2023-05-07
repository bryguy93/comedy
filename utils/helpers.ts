import axios from "axios";
import { HelperParams } from "../page-objects/HelperParams";
import { promises as fsPromises } from 'fs';
import { join } from 'path';

// Grab environment variable
//export const envi = (key: string): string => {
  //  const value = process.env[key];
    //if (!value) {
      //  throw Error(`No Enviro var found for ${ key } - run cli with arg --enviro=`)
//    }
  //  return value;
//}

//add dashes to a raw phone number -> format of 911 call queue
export const convertPhoneToQueue = (key: string): string => {
    const final = '1-' + key.slice(0,3) +'-' + key.slice(3,6) + '-' + key.slice(6)
    console.log('Phone: ' + final)
    return final;
}

export const randomNum = (min: number, max: number): number => {
    if(max < min){
        throw new Error('Max arg must be less than min arg');
    }
    let random_number = Math.floor(Math.random() * (max - min + 1) + min)
    return random_number
}

export const epochUnixTimestamp = (): number => {
   
    let timeStamp: number
    timeStamp = Math.floor(Date.now() / 1000)
    return  timeStamp
}

export const setEnvironment = (enviro: string): string => {
    
    //const environment = envi(enviro).toUpperCase()
    const environment = enviro
        
    let enviroURL: string

        if(environment.includes('QA') && !environment.includes('DEL') ){
            enviroURL = "qa"
        }
        else if(environment.includes('SAND') || environment.includes('SB') || environment.includes('BOX')){
            enviroURL = "sandbox"
        }
        else if(environment.includes('DELTA')){
            enviroURL = "qa-delta"
            }
        else if(environment.includes('STAG') || environment.includes('STG')){
            enviroURL = "staging"
         }
        else{
            throw new Error(`${environment} is not a valid value for TEST_ENVIRO_CLI` )
        }
    
    return enviroURL;
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

export const elsV1Call = (enviro: string, Lat?: number, Long?: number): string => {
    
    //setup var of type POM aka HelperParams
    let helperParams: HelperParams
    let latitude: number
    let longitude: number

    //instantiate the variable
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v1 Call request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }
    
    // Url, body, headers
    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV1ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        source: helperParams.CallSource, // e.g. sms
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor

    }, { headers })
    .then(function(response){
        
        console.log('ELS v1 Call Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v1 Call request failed')

    })

    return helperParams.device_number.toString()

}

export const elsV1Sms = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v1 Sms request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV1ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        source: helperParams.SmsSource, // e.g. sms
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor

    }, { headers })
    .then(function(response){
        
        console.log('ELS v1 Sms Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v1 Sms request failed')

    })

    return helperParams.device_number.toString()

}

export const elsV1Adr = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v1 w/ ADR request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV1ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor,
        device_languages: helperParams.device_lang,
        adr_carcrash_time: helperParams.adr_car_crash_time

    }, { headers })
    .then(function(response){
        
        console.log('ELS v1 w/ ADR Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v1 w/ ADR request failed')

    })

    return helperParams.device_number.toString()

}

export const elsV2Call = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v2 Call request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV2ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        source: helperParams.CallSource, // e.g. sms
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor

    }, { headers })
    .then(function(response){
        
        console.log('ELS v2 Call Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v2 Call request failed')

    })

    return helperParams.device_number.toString()

}

export const elsV2Sms = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v2 Sms request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV2ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        source: helperParams.SmsSource, // e.g. sms
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor

    }, { headers })
    .then(function(response){
        
        console.log('ELS v2 Sms Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v2 Sms request failed')

    })

    return helperParams.device_number.toString()

}

export const elsV2Adr = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    helperParams = new HelperParams

    const headers = helperParams.ElsV1ApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('ELS v2 w/ ADR request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    const response = axios.post(helperParams.ApiEndpointString1 + enviro + helperParams.ElsV2ApiEndpointString2, {
        device_number: helperParams.device_number,
        time: helperParams.time,
        location_time: helperParams.location_time,
        location_latitude: latitude,
        location_longitude: longitude,
        location_accuracy: helperParams.location_accuracy,
        location_vertical_accuracy: helperParams.location_vertical_accuracy,
        confidence: helperParams.confidence,
        location_confidence: helperParams.location_confidence,
        location_altitude: helperParams.location_altitude,
        location_floor: helperParams.location_floor,
        device_languages: helperParams.device_lang,
        adr_carcrash_time: helperParams.adr_car_crash_time

    }, { headers })
    .then(function(response){
        
        console.log('ELS v2 w/ ADR Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ELS v2 w/ ADR request failed')

    })

    return helperParams.device_number.toString()

}

export const circusCall = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    let apiUrl: string
    helperParams = new HelperParams

    const headers = helperParams.circusApiEndpointHeaders
    

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('Circus Call request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    if (enviro === 'qa-delta'){
        apiUrl = helperParams.circusQaDeltaApiEndpointString1 + 'delta.qa' + helperParams.circusSandOrQaDeltaEndpointString2
    } else if (enviro === 'staging' || enviro === 'qa'){
        apiUrl = helperParams.circusQaOrStagingApiEndpointString1 + enviro + helperParams.circusQaOrStagingEndpointString2
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.circusSandboxApiEndpointString1 + enviro + helperParams.circusSandOrQaDeltaEndpointString2
    } else {
        throw new Error('Invalid environment var')
    }

    const response = axios.post(apiUrl, {
        'call_ID': `+1${helperParams.device_number}`,
        'medium': helperParams.circusCallMedium,
        'location': {
            'latitude': latitude,
            'longitude': longitude,
            'confidence': helperParams.confidence,
            'timestamp': helperParams.circusTime,
            'hunc': helperParams.circusHunc
        },
        'session_start_time': helperParams.circusTime,
        'expiration': helperParams.circusExpiry
    }, { headers })
    .then(function(response){
        
        console.log('Circus Call Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('Circus Call request failed')

    })

    return helperParams.device_number.toString()

}

export const circusSms = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    let apiUrl: string
    helperParams = new HelperParams

    const headers = helperParams.circusApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('Circus Sms request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    if (enviro === 'qa-delta'){
        apiUrl = helperParams.circusQaDeltaApiEndpointString1 + 'delta.qa' + helperParams.circusSandOrQaDeltaEndpointString2
    } else if (enviro === 'staging' || enviro === 'qa'){
        apiUrl = helperParams.circusQaOrStagingApiEndpointString1 + enviro + helperParams.circusQaOrStagingEndpointString2
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.circusSandboxApiEndpointString1 + enviro + helperParams.circusSandOrQaDeltaEndpointString2
    } else {
        throw new Error('Invalid environment var')
    }

    const response = axios.post(apiUrl, {
        'call_ID': `+1${helperParams.device_number}`,
        'medium': helperParams.circusSmsMedium,
        'location': {
            'latitude': latitude,
            'longitude': longitude,
            'confidence': helperParams.confidence,
            'timestamp': helperParams.circusTime,
            'hunc': helperParams.circusHunc
        },
        'session_start_time': helperParams.circusTime,
        'expiration': helperParams.circusExpiry
    }, { headers })
    .then(function(response){
        
        console.log('Circus Sms Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('Circus Sms request failed')

    })

    return helperParams.device_number.toString()

}

export const circusCallADR = (enviro: string, Lat?: number, Long?: number): string => {
    
    let helperParams: HelperParams
    let latitude: number
    let longitude: number
    let apiUrl: string
    let adrUrl: string
    helperParams = new HelperParams

    const headers = helperParams.circusApiEndpointHeaders

    if (typeof Lat !== 'undefined' && typeof Long !== 'undefined') {
        latitude = Lat
        longitude = Long
    } else if(typeof Lat !== 'undefined' && typeof Long === 'undefined'){
        throw new Error('Circus Call request failed - Cannot provide lat without long in function call')

    } else {
        latitude = helperParams.location_latitude
        longitude = helperParams.location_longitude
    }

    if (enviro === 'qa-delta'){
        apiUrl = helperParams.circusQaDeltaApiEndpointString1 + 'delta.qa' + helperParams.circusSandOrQaDeltaEndpointString2
        adrUrl = helperParams.circusQaDeltaApiEndpointString1 + 'delta.qa' + helperParams.circusSandOrQaDeltaADREndpointString2
    } else if (enviro === 'staging' || enviro === 'qa'){
        apiUrl = helperParams.circusQaOrStagingApiEndpointString1 + enviro + helperParams.circusQaOrStagingEndpointString2
        adrUrl = helperParams.circusQaOrStagingApiEndpointString1 + enviro + helperParams.circusQaOrStagingADREndpointString2
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.circusSandboxApiEndpointString1 + enviro + helperParams.circusSandOrQaDeltaEndpointString2
        adrUrl = helperParams.circusSandboxApiEndpointString1 + enviro + helperParams.circusSandOrQaDeltaADREndpointString2
    } else {
        throw new Error('Invalid environment var')
    }

    const response = axios.post(apiUrl, {
        'call_ID': `+1${helperParams.device_number}`,
        'medium': helperParams.circusCallMedium,
        'location': {
            'latitude': latitude,
            'longitude': longitude,
            'confidence': helperParams.confidence,
            'timestamp': helperParams.circusTime,
            'hunc': helperParams.circusHunc
        },
        'session_start_time': helperParams.circusTime,
        'expiration': helperParams.circusExpiry
    }, { headers })
    .then(function(response){
        
        console.log('Circus Call Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('Circus Call request failed')

    })

    const response2 = axios.post(adrUrl, {
        'call_ID': `+1${helperParams.device_number}`,
        'session_start_time': helperParams.circusTime,
        'medium': helperParams.circusCallMedium,
        'data_version': helperParams.circusdataVersion,
        'encrypt_time': helperParams.circusencryptTime,
        'wrapped_key': helperParams.circuswrappedKey,
        'data': helperParams.circusdata
    }, { headers })
    .then(function(response){
        
        console.log('ADR Status: ' + response.status)
        
    })
    .catch(function(error){

        console.log(error)
        throw new Error('ADR request failed')

    })
    return helperParams.device_number.toString()
}

///////////////////////////////////Spatial Layers OAuth + dynamic layers endpoint push\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

async function oAuthHelper(url: string,header: any, clientId: string, clientSecret: string): Promise<string> {
    
    try {
      let tempp = 'client_credentials'  
      const response = await axios.post(url, {'client_id': clientId,'grant_type': tempp, 'client_secret': clientSecret }, header )
      let temp =  JSON.stringify(response.data['access_token'])
      temp = temp.substring(1).slice(0,-1)
      return temp
    } catch (error) {
        console.log(error)
        throw new Error('oAuth token generation failed')
    }
  }

export const oAuth = (enviro: string, partner: string, clientID?: string, clientSec?: string): any => {
   
    let helperParams: HelperParams
    let user: any
    let pw: any
    let apiUrl: string
    let determineCreds: boolean
    let partnercheck: boolean
    partnercheck = false
    partner = partner.toLowerCase()
    helperParams = new HelperParams

    const headers = helperParams.oAuthHeaders

    for (var i of helperParams.partnerList){
        if(partner === i){
            partnercheck = true
        }
    }

    if (partnercheck === false){
        throw new Error(partner + ' is not a known Spatial Layer partner - may require setup')
    } else{
        partnercheck = false
    }

    if (typeof clientID !== 'undefined' && typeof clientSec !== 'undefined') {
        determineCreds = true
    } else if(typeof clientID !== 'undefined' && typeof clientSec === 'undefined'){
        throw new Error('Scorpius Login Auth Failed - Cannot provide recEmail without recPw in function params')
    } else {
        determineCreds = false
    }
    
    if (enviro === 'qa-delta'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.oAuthUrlString
        
        if(determineCreds === true ){
            user = clientID
            pw = clientSec
        } else{
            if(partner === 'iar'){                        //IaR is not currently setup in QA-delta
                user = helperParams.oAuthClientIdQaDeltaIAR
                pw = helperParams.oAuthClientSecQaDeltaIAR
                partnercheck = true
            }
            else if(partner === 'public sonar'){
                user = helperParams.oAuthClientIdQaDeltaPubSonar
                pw = helperParams.oAuthClientSecQaDeltaPubSonar
                partnercheck = true
            }
        }
    } else if (enviro === 'staging'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.oAuthUrlString

        if(determineCreds === true ){
            user = clientID
            pw = clientSec
        } else{
            if(partner === 'iar'){
                user = helperParams.oAuthClientIdStagingIAR
                pw = helperParams.oAuthClientSecStagingIAR
                partnercheck = true
            }
            else if(partner === 'public sonar'){
                user = helperParams.oAuthClientIdStagingPubSonar
                pw = helperParams.oAuthClientSecStagingPubSonar
                partnercheck = true
            }
        }
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.oAuthUrlString
        
        if(determineCreds === true ){
            user = clientID
            pw = clientSec
        } else{
            if(partner === 'iar'){
                user = helperParams.oAuthClientIdSandIAR
                pw = helperParams.oAuthClientSecSandIAR
                partnercheck = true
            }
            else if(partner === 'public sonar'){
                user = helperParams.oAuthClientIdSandPubSonar
                pw = helperParams.oAuthClientSecSandPubSonar
                partnercheck = true
            }
        }
    } else if (enviro === 'qa'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.oAuthUrlString
        
        if(determineCreds === true ){
            user = clientID
            pw = clientSec
        } else{
            if(partner === 'iar'){
                user = helperParams.oAuthClientIdQaIAR
                pw = helperParams.oAuthClientSecQaIAR
                partnercheck = true
            }
            else if(partner === 'public sonar'){
                user = helperParams.oAuthClientIdQaPubSonar
                pw = helperParams.oAuthClientSecQaPubSonar
                partnercheck = true
            }
        }
    }else {
        throw new Error('Invalid environment var')
    }
    
    if (partnercheck === false){
        throw new Error(partner + ' has no credentials set up for ' + enviro)
    } 
    return  oAuthHelper(apiUrl,headers,user,pw)
}
// general dynamic layer req helper method
async function pushLayer(enviro: string, header: any, body: any): Promise<number> {
    
    let helperParams: HelperParams
    helperParams = new HelperParams

    enviro = enviro.toLowerCase()
    let url = helperParams.ApiEndpointString1 + enviro + helperParams.dynamicLayersEndpoint
    
    try {
      const response = await axios.post(url, body, header )
      //let temp =  JSON.stringify(response.data['token'])
      //temp = temp.substring(1).slice(0,-1)
      return response.status
    } catch (error) {
        console.log(error)
        throw new Error('Layer failed to Push')
    }
  }

export const iarResponder = (enviro: string, accessToken: string, lat: number, long: number, markerID: string, display: boolean): any => {
   
    let helperParams: HelperParams
    let tokenString: string
    helperParams = new HelperParams

    enviro = enviro.toLowerCase()
    tokenString = "Bearer " + accessToken

    let header = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': tokenString 
        }
      }

    const body = {
        "external_id": markerID,
        "latitude": lat,
        "longitude": long,
        "layer_key": "iar_responders",
        "attributes": {
            "display": display,
            "responder_details": {
                "MemberName": "Bry Guy",
                "MemberName_last": "Guy",
                "MemberPosition": "Tester",
                "AgencyName": "RapidSOS PD QA",
                "RespondingTo": "Station"
            }
        }
    }
    
    return  pushLayer(enviro, header, body)
}
//                                                                three types of markerType- ['EMS','Police','Fire','Other']
export const iarVehicle = (enviro: string, accessToken: string, lat: number, long: number, markerID: string, markerType: string, display: boolean): any => {
   
    let helperParams: HelperParams
    let tokenString: string
    helperParams = new HelperParams

    enviro = enviro.toLowerCase()
    tokenString = "Bearer " + accessToken

    let header = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': tokenString 
        }
      }
      // three types of layer keys- ['EMS','Police','Fire','Other']
    const body = {
        "external_id": markerID,
        "latitude": lat,
        "longitude": long,
        "layer_key": "iar_vehicles",
        "attributes": {
            "display": display,
            "vehicle_details": {
                "ApparatusName": "Ambulance 2",
                "RespondingTo": "on-scene",
                "ApparatusTypeName": markerType,
                "ApparatusCategoryName": "Yep 1st Response EMS",
                "MakeAndModel": "Mustang GT '20",
                "AgencyName": "Rapid SOS PD QA",
                "ApparatusAbbreviation": "Amb-2"
            }
        }
    }
    
    return  pushLayer(enviro, header, body)
}

export const publicSonar = (enviro: string, accessToken: string, lat: number, long: number, markerID: string, markerType: string, display: boolean): any => {
   
    let helperParams: HelperParams
    let tokenString: string
    helperParams = new HelperParams

    enviro = enviro.toLowerCase()
    tokenString = "Bearer " + accessToken

    let header = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': tokenString 
        }
      }
      // layer keys are ['public_sonar_natural_disaster', 'public_sonar_mobility', 'public_sonar_vital_infrastructure', 'public_sonar_public_safety', 'public_sonar_crowd_control']
    const body = {
        "external_id": markerID,
        "latitude": lat,
        "longitude": long,
        "layer_key": markerType,
        "attributes": {
            "display": display,
            "message": "Test8",
            "thumbnail_url": "www.google.com",
            "username": "xyz123",
            "timestamp": epochUnixTimestamp(),
            "external_url": "https://twitter.com/user123",
            "username_url": "www.google.com",
            "message_url": "www.google.com",
            "source": "Twitter"
            }
        }
    
    return  pushLayer(enviro, header, body)
}
///////////////////////////////////REC AUTH ... applicable to Alerts\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//next two functions correspond to scorpius | login request in Postman ... generates bearer token
async function generateLoginToken(url: string,header: any, user: string, pw: string): Promise<string> {
    try {
      const response = await axios.post(url, {'email': user, 'password': pw }, header )
      let temp =  JSON.stringify(response.data['token'])
      temp = temp.substring(1).slice(0,-1)
      return temp
    } catch (error) {
        console.log(error)
        throw new Error('Scorpius Login Auth failed')
    }
  }

export const scorpiusLogin = (enviro: string, recEmail?: string, recPw?: string): any => {
   
    let helperParams: HelperParams
    let user: any
    let pw: any
    let apiUrl: string
    let determineCreds: boolean
    helperParams = new HelperParams

    const headers = helperParams.scorpiusRecUserHeaders

    if (typeof recEmail !== 'undefined' && typeof recPw !== 'undefined') {
        determineCreds = true
    } else if(typeof recEmail !== 'undefined' && typeof recPw === 'undefined'){
        throw new Error('Scorpius Login Auth Failed - Cannot provide recEmail without recPw in function params')
    } else {
        determineCreds = false
    }
    
    if (enviro === 'qa-delta'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusLoginString2
        
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailQADelt
            pw = helperParams.scorpiusDefaultPwQADelt
        }
    } else if (enviro === 'staging'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusLoginString2

        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailStag
            pw = helperParams.scorpiusDefaultPwStag
        }
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusLoginString2
        
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailSand
            pw = helperParams.scorpiusDefaultPwSand
        }
    } else if (enviro === 'qa'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusLoginString2
        
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailQA
            pw = helperParams.scorpiusDefaultPwQA
        }
    }else {
        throw new Error('Invalid environment var')
    }
    
    return  generateLoginToken(apiUrl,headers,user,pw)
}


//next two functions correspond to scorpius | user request in Postman ... generates OrgId
async function generateUserRecOrg(url: string,header: any): Promise<string> {
    try {
      const response = await axios.get(url, header )
      return  JSON.stringify(response.data['organizations'][1]['id']) //used my account as example, not sure if the same format for all accounts
    } catch (error) {
        console.log(error)
        throw new Error('Scorpius User Rec Org retrieval failed')
    }
  }

export const scorpiusUser = (enviro: string, token: string): any => {
   
    let helperParams: HelperParams
    let apiUrl: string
    helperParams = new HelperParams
    
    if (enviro === 'qa-delta'){ apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusUserString2
    } else if (enviro === 'staging'){ apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusUserString2
    } else if (enviro === 'sandbox'){ apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusUserString2
    } else if (enviro === 'qa'){ apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusUserString2
    } else { throw new Error('Invalid environment var')
    }

    let auth: string
    auth = 'Bearer ' + token
    let header = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': auth 
        }
      }
    
    return  generateUserRecOrg(apiUrl,header)
}


//next two functions correspond to scorpius | org token request in Postman
async function generateOrgToken(url: string,header: any, user: string, pw: string): Promise<string> {
    try {
      const response = await axios.get(url,header )
      let temp =  JSON.stringify(response.data['token'])
      temp = temp.substring(1).slice(0,-1)
      return temp

    } catch (error) {
        console.log(error)
        throw new Error('Scorpius Org Token Auth failed')
    }
  }

export const scorpiusOrgToken = (enviro: string, token: string, org: string, recEmail?: string, recPw?: string): any => {
   
    let helperParams: HelperParams
    let user: any
    let pw: any
    let apiUrl: string
    let determineCreds: boolean
    helperParams = new HelperParams
    let auth: string
    auth = 'Bearer ' + token
    
    let headers = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': auth
        }
      }

    if (typeof recEmail !== 'undefined' && typeof recPw !== 'undefined') {
        determineCreds = true
    } else if(typeof recEmail !== 'undefined' && typeof recPw === 'undefined'){
        throw new Error('Scorpius Org Auth Failed - Cannot provide recEmail without recPw in function params')
    } else {
        determineCreds = false
    }
    
    if (enviro === 'qa-delta'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusOrgString2 + org + helperParams.scorpiusOrgString3
        
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailQADelt
            pw = helperParams.scorpiusDefaultPwQADelt
        }
    } else if (enviro === 'staging'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusOrgString2 + org + helperParams.scorpiusOrgString3

        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailStag
            pw = helperParams.scorpiusDefaultPwStag
        }
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusOrgString2 + org + helperParams.scorpiusOrgString3
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailSand
            pw = helperParams.scorpiusDefaultPwSand
        }
    } else if (enviro === 'qa'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.scorpiusOrgString2 + org + helperParams.scorpiusOrgString3
        if(determineCreds === true ){
            user = recEmail
            pw = recPw
        } else{
            user = helperParams.scorpiusDefaultEmailQA
            pw = helperParams.scorpiusDefaultPwQA
        }
    }else {
        throw new Error('Invalid environment var')
    }
    
    return  generateOrgToken(apiUrl,headers,user,pw)
}


//Master function to fully authenticate a REC User(scorpius login & user & org token)
export async function recUserAuthentication(enviroURL: string, recEmail?: string, recPw?: string): Promise<string> {

    if (typeof recEmail !== 'undefined' && typeof recPw !== 'undefined') {
        let token = await scorpiusLogin(enviroURL,recEmail,recPw) 
        let value = await scorpiusUser(enviroURL,token)
        let lastToken = await scorpiusOrgToken(enviroURL,token,value,recEmail,recPw)
        return lastToken

    } else if(typeof recEmail !== 'undefined' && typeof recPw === 'undefined'){

        throw new Error('Scorpius Org Auth Failed - Cannot provide recEmail without recPw in function params')
    
    } else {
        let token = await scorpiusLogin(enviroURL) 
        let value = await scorpiusUser(enviroURL,token)
        let lastToken = await scorpiusOrgToken(enviroURL,token,value)
        return lastToken

    }
    
}

//radius in miles
export const generateRandomLatLong = (lat: number, long: number, radius: number): any => {

    let x0 = long;
    let y0 = lat;
    // convert miles to meters
    radius = radius * 1609.34
    // Convert Radius from meters to degrees.
    let rad = radius/111300;
  
    let u = Math.random();
    let v = Math.random();
  
    let w = rad * Math.sqrt(u);
    let t = 2 * Math.PI * v;
    let x = w * Math.cos(t);
    let y = w * Math.sin(t);
  
    let xp = x/Math.cos(y0);
  
    // Resulting coords.
    let intermLat = y + y0
    let intermLong = xp + x0

    let finalLat = intermLat.toString().substring(0,8)
    let finalLong = intermLong.toString().substring(0,9)
    
    let coords = [parseFloat(finalLat),parseFloat(finalLong)]
    return coords
  }


  async function alertGeodeticReq(url: string,body: any,header: any): Promise<string> {
    try {
      const response = await axios.post(url, body, header )
      let temp =  JSON.stringify(response.data['alert_id'])
      //temp = temp.substring(1).slice(0,-1)
      return temp
    } catch (error) {
        console.log(error)
        throw new Error('Alerts Post request failed')
    }
  }

export const alertFireGeo = (enviro: string, token: string, lat: number, long: number, alertType: string): any => {
   
    let helperParams: HelperParams
    let apiUrl: string
    let auth: string
    let emergencyType: string

    helperParams = new HelperParams
    auth = 'Bearer ' + token
    alertType = alertType.toUpperCase()

    if (alertType === 'FIRE'){
        emergencyType = helperParams.emergency_type_fire[Math.floor(Math.random() * helperParams.emergency_type_fire.length)]
    } else if (alertType === 'MEDICAL'){
        emergencyType = helperParams.emergency_type_medical
    } else if (alertType === 'LAW'){
        emergencyType = helperParams.emergency_type_law[Math.floor(Math.random() * helperParams.emergency_type_law.length)]
    } else {
        throw new Error('Invalid environment var')
    }
    
    let headers = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-prospector-service': 'prospector', 'Authorization': auth
        }
      }

    let body = {
        "callflow": helperParams.callflow,
        "blocking": helperParams.blocking,
        "variables": {
            "event": {
                "source_id": helperParams.source_id,
                "incident_time": helperParams.incident_time,
                "emergency_type": emergencyType,
                "site_type": helperParams.site_type[Math.floor(Math.random() * helperParams.site_type.length)],
                "description": helperParams.description,
                "service_provider_name": helperParams.service_provider_name[Math.floor(Math.random() * helperParams.service_provider_name.length)],
                "location": {
                    "geodetic": {
                        "latitude": lat,
                        "longitude": long,
                        "uncertainty": helperParams.alertUncertainty
                    }
                }
            },
            "zone_sensor": helperParams.zone_sensor,
            "patient_name": helperParams.patient_name[Math.floor(Math.random() * helperParams.patient_name.length)],
            "gender": helperParams.gender[Math.floor(Math.random() * helperParams.gender.length)],
            "date_of_birth": helperParams.date_of_birth[Math.floor(Math.random() * helperParams.date_of_birth.length)],
            "medical_conditions": helperParams.medical_conditions[Math.floor(Math.random() * helperParams.medical_conditions.length)],
            "medications": helperParams.medications[Math.floor(Math.random() * helperParams.medications.length)],
            "allergies": helperParams.allergies[Math.floor(Math.random() * helperParams.allergies.length)],
            "instructions": helperParams.instructions[Math.floor(Math.random() * helperParams.instructions.length)],
            "site_phone": helperParams.site_phone,
            "emergency_contacts": [
                {
                    "name": helperParams.name[Math.floor(Math.random() * helperParams.name.length)],
                    "phone": helperParams.phone,
                    "relationship": helperParams.relationship[Math.floor(Math.random() * helperParams.relationship.length)],
                    "language": helperParams.language[Math.floor(Math.random() * helperParams.language.length)]
                }
            ]
        }
    }

    if (enviro === 'qa-delta'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.alertsTriggerEndpoint
    } else if (enviro === 'staging'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.alertsTriggerEndpoint
    } else if (enviro === 'sandbox'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.alertsTriggerEndpoint
    } else if (enviro === 'qa'){
        apiUrl = helperParams.ApiEndpointString1 + enviro + helperParams.alertsTriggerEndpoint
    }else {
        throw new Error('Invalid environment var')
    }
    
    return  alertGeodeticReq(apiUrl,body, headers)
}