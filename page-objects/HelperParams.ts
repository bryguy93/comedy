import { randomNum } from '../utils/helpers'

//import this to pom files and extend to the class function ... this will add all var, constructor and functions from here to the pom semi implicitly
// can remove dupe vars(e.g. this.page = page) from Pom file
// for constructor, need to add super(page) "call a constructor from the class from which it extends from"
export class HelperParams {
    //common(ELS and Circus)
    readonly device_number: number
    readonly location_latitude: number
    readonly location_longitude: number
    readonly confidence: number
    //ELS
    readonly time: number
    readonly location_accuracy: number
    readonly location_time: number
    readonly CallSource: string
    readonly SmsSource: string
    readonly device_lang: string
    readonly adr_car_crash_time: number
    readonly location_vertical_accuracy: number
    readonly location_confidence: number
    readonly location_altitude: number
    readonly location_floor: number
    readonly ElsV1ApiEndpointHeaders
    readonly ApiEndpointString1: string
    readonly ElsV1ApiEndpointString2: string
    readonly ElsV2ApiEndpointString2: string
    // circus
    readonly circusApiEndpointHeaders
    readonly circusQaOrStagingApiEndpointString1: string
    readonly circusSandboxApiEndpointString1: string
    readonly circusQaDeltaApiEndpointString1: string
    readonly circusQaOrStagingEndpointString2: string
    readonly circusSandOrQaDeltaEndpointString2: string
    readonly circusTime: number
    readonly circusHunc: number
    readonly circusExpiry: number
    readonly circusCallMedium: string
    readonly circusSmsMedium: string
    readonly circusQaOrStagingADREndpointString2: string
    readonly circusSandOrQaDeltaADREndpointString2: string
    readonly circusdataVersion: string
    readonly circusencryptTime: number
    readonly circuswrappedKey: string
    readonly circusdata: string
    //REC Auth
    readonly scorpiusRecUserHeaders
    readonly scorpiusDefaultEmailQA: string
    readonly scorpiusDefaultEmailSand: string
    readonly scorpiusDefaultEmailStag: string
    readonly scorpiusDefaultEmailQADelt: string
    readonly scorpiusDefaultPwQA: string
    readonly scorpiusDefaultPwSand: string
    readonly scorpiusDefaultPwStag: string
    readonly scorpiusDefaultPwQADelt: string
    readonly scorpiusLoginString2: string
    readonly scorpiusUserString2: string
    readonly scorpiusOrgString2: string
    readonly scorpiusOrgString3: string
    //ALERTS
    readonly alertsTriggerEndpoint: string
    readonly callflow: string
    readonly blocking: boolean
    readonly source_id: string
    readonly incident_time: number
    readonly emergency_type_fire: string[]
    readonly emergency_type_medical: string
    readonly emergency_type_law: string[]
    readonly site_type: string[]
    readonly description: string
    readonly service_provider_name: string[]
    readonly alertUncertainty: number
    readonly zone_sensor: string
    readonly patient_name: string[]
    readonly gender: string[]
    readonly date_of_birth: string[]
    readonly medical_conditions: string[]
    readonly medications: string[]
    readonly allergies: string[]
    readonly instructions: string[]
    readonly site_phone: string
    readonly name: string[]
    readonly phone: string
    readonly relationship: string[]
    readonly language: string[]
    //Dynamic Spatial Layers
    readonly oAuthHeaders
    readonly oAuthUrlString: string
    readonly partnerList: string []
    readonly dynamicLayersEndpoint: string
              //  IAR 
    readonly oAuthClientIdQaDeltaIAR: string
    readonly oAuthClientSecQaDeltaIAR: string
    readonly oAuthClientIdQaIAR: string
    readonly oAuthClientSecQaIAR: string
    readonly oAuthClientIdSandIAR: string
    readonly oAuthClientSecSandIAR: string
    readonly oAuthClientIdStagingIAR: string
    readonly oAuthClientSecStagingIAR: string
             //   Public Sonar
    readonly oAuthClientIdQaDeltaPubSonar: string
    readonly oAuthClientSecQaDeltaPubSonar: string
    readonly oAuthClientIdQaPubSonar: string
    readonly oAuthClientSecQaPubSonar: string
    readonly oAuthClientIdSandPubSonar: string
    readonly oAuthClientSecSandPubSonar: string
    readonly oAuthClientIdStagingPubSonar: string
    readonly oAuthClientSecStagingPubSonar: string

    readonly logFilePath: string


    constructor(){
        //common(ELS and Circus)
        this.device_number = randomNum(2000000000,8000000000)
        this.location_latitude = 40.401844
        this.location_longitude = -74.315575
        //this.location_latitude = 35.466705 //qadelta
        //this.location_longitude = -86.026373 //qadelta
        //this.location_latitude = 39.715552 //sandbox
        //this.location_longitude = -104.995584 //sandbox
        this.confidence = 4
        //ELS
        this.time = Date.now()
        this.location_time = Date.now()
        this.location_accuracy = 3
        this.CallSource = 'call'
        this.SmsSource = 'sms'
        this.device_lang = 'en-US'
        this.adr_car_crash_time = Date.now()
        this.location_vertical_accuracy = 7
        this.location_confidence = 0.11
        this.location_altitude=  12
        this.location_floor=  13
        this.ElsV1ApiEndpointHeaders= {
            'content-type': 'application/x-www-form-urlencoded'
        }
        this.ApiEndpointString1 = 'https://api-'
        this.ElsV1ApiEndpointString2 = '.rapidsos.com/v1/els/location'
        this.ElsV2ApiEndpointString2 = '.rapidsos.com/v2/els/location'
        //circus
        this.circusApiEndpointHeaders = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          }
        this.circusQaOrStagingApiEndpointString1 = 'https://circus-simulator-us-east-1.'
        this.circusSandboxApiEndpointString1 = 'https://circus-simulator.'
        this.circusQaDeltaApiEndpointString1 = 'https://circus-simulator-'
        this.circusQaOrStagingEndpointString2 = '-prime.rapidsos.com/location_creation'
        this.circusSandOrQaDeltaEndpointString2 = '.rapidsos.com/location_creation'
        this.circusTime = Math.floor(Date.now()/1000)
        this.circusHunc = 10
        this.circusExpiry = 3600
        this.circusCallMedium = 'Voice'
        this.circusSmsMedium = 'Text'
        this.circusQaOrStagingADREndpointString2 = '-prime.rapidsos.com/create_adr'
        this.circusSandOrQaDeltaADREndpointString2 = '.rapidsos.com/create_adr'
        this.circusdataVersion = '1'
        this.circusencryptTime = 1613500747
        this.circuswrappedKey = 'Qb8E7pU4iYFiTPR4SKXzXZgVfbv0W32jONbWJbhlXD3h6seI4xAdZyD+ZM4+TSdlodIz1HVZUspbNaWgZ4j4D9zKHXG3h7Du+vd5bqNtUt1KUhTucxoV9HUz+acanFgfE9YADiBaptuDD9EU3Y25eZgNrg=='
        this.circusdata = 'hIlHAY6PuZBlk/0lpzLMHIyyZDHLtbXgxM3ofB/169AE6+Ce3dlwUz88TwuSVZAHX79QzzMEoVyizzjCaZQWSuD/yhkN59IU0q5ZfPIC1pk9SPqEDvNwvJSmM4yEkciShW/mO/lmzsyoUlBFiFaXjtmIUn2xMcldA7MeyoQ6hnx2bwx9054FZD2+WmWbPun9d1RDw/CwBaFWUVLSg9V3Z3f/bmIw8wqL2VsE02LlEmnAU9lUEbdqPFCQMSUTFDA54afs7zly89hBAlKCgiXcBHgLo26aC97Sn5Ab0lYFIq2e6iBqu6GPns7jwTF+20fLgb9sL8d6+IgsGggy/ZrukwOaMX14IaczfdbtnDXIn77HMCerDNdpbW5P44ewp4r8lE4Qq/oFoUHurZCFZ4smbThmEBaWydYe/FtaBLwxlZkBxDZ/94IN1iywGZj84oYyof5EYSLG8Giv4UYcY0BHyOWecN6sUHu7JAfIHGQQNbD629MI3TXdzsk8BmXvUAQSWrsFaS7/mqZMGy5b3+JrDIgvtbLqGMYoGA9+9+HGNsPkYnxo/p5K7hvOA0UrAQNOcrOXWjU2UuDy35cyHu7B7nUFXtb9HhoGba3uOyaU5uj1Qvh4lTxxLDQkzFfp1a3SI29MsL6WkbJJI0Ux7/VnHDMhPYEu0/odnszDW2KiJds0UWSAa3GIkNAQWW3vZObPoSuWJ01QjNo0BLbt3pIzl2KgyeBBq42L4eUmGMnnr74Bmaep9XithhENFR8Rhds5ML034zUaAnn6zOXu2qeHddJnC1B0FRtdEcDwPRxBh3m12SEHVYDcWZQumhukXspkv3BfX+zNGbLpSBZMN7ei6PN+HGorr2/kcx1eOtHQXMQSyeTf/XW+xvCnO45NVjYYxWB6ZyLT5QkxOXNdY58Oe841i5pU2hz5yI2qWeyL2cJGD9DH/Rfdr4kt+2E8/aNLzjQImh+ExunxwPMXwQiC1Y3WmxOuyNkPcgal0SyZDvxI2J5BPJj7NQjoZ46iNfXLSPt6Fb9S3GyIFow9A6uNwbQaedF5dNBQNKSJtE+qwxYGSA2CEh5rbMtuOyrIqdl4szKsavkuoHZME6xZvMhCkrxD6MGcY6YTawMdPsKlHMCvUfsyAnkbMo1N0G6fp4xEa4XEqQrAi5h6I+ueQbOxgPj8jHxziY1bfcx675cW2CFN3KrIByww5i9MD3/MCv9gHNoJnI0TrLwtq2ZUiEdgdbqhp3xWizyDX5Au2fOO8DyzM5+bKSTwvG9yQBJoUtOS7HCSijPUW4PGH6nKXjwa3tnwoXsKkdzbqJPyBqF4sZ0C3R0LTOQiVVaeoVzf'
        this.logFilePath = './networkLogs.txt'
        //REC auth for alerts
        this.scorpiusRecUserHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'x-prospector-service': 'prospector'
            }
          }
        this.scorpiusDefaultEmailQA = 'boyola+REC@rapidsos.com'
        this.scorpiusDefaultEmailSand = 'boyola+REC@rapidsos.com'
        this.scorpiusDefaultEmailStag = 'boyola+REC@rapidsos.com'
        this.scorpiusDefaultEmailQADelt = 'boyola+REC@rapidsos.com'
        this.scorpiusDefaultPwQA = 'Test123!'
        this.scorpiusDefaultPwSand = 'Test123!'
        this.scorpiusDefaultPwStag = 'Test123!'
        this.scorpiusDefaultPwQADelt = 'Test123!'
        this.scorpiusLoginString2 = '.rapidsos.com/v1/scorpius/user/api-token-auth'
        this.scorpiusUserString2 = '.rapidsos.com/v1/scorpius/user'
        this.scorpiusOrgString2 = '.rapidsos.com/v1/scorpius/organizations/'
        this.scorpiusOrgString3 = '/token?product=REM-Sandbox'
        this.alertsTriggerEndpoint = '.rapidsos.com/v1/rem/trigger'
        //Alerts 
        this.callflow = 'updated_alertflow_csp_bo'
        this.blocking = true
        this.source_id = randomNum(100,999) + 'a' + randomNum(10,99) + 'ee-f7b8-' + randomNum(100,999) + 'f-' + randomNum(1000,9999) + '-' + randomNum(1000,9999) + 'ea9cd' + randomNum(10,99)
        //this.incident_time = Math.floor(Date.now()/1000)
        this.incident_time = Date.now()
        this.emergency_type_fire = ['FIRE', 'CO'] // Fire types
        this.emergency_type_medical = 'MEDICAL' // Medical types
        this.emergency_type_law = ['BURGLARY', 'HOLDUP', 'SILENT_ALARM', 'CRASH', 'OTHER'] // Law types
        this.site_type = ['RESIDENTIAL', 'COMMERCIAL', 'PERSONAL', 'VEHICLE']
        this.description = 'This is a random description'
        this.service_provider_name = ['BRINKS','ALARM.COM','ADT','LOREX','ECHOBEE']
        this.alertUncertainty = 10
        this.zone_sensor = 'Zone ' + randomNum(1,99)
        this.patient_name = ['Sam Morrill','Mark Normand','Louis C.K.','Dave Attell','Sarah Hyland','Jessica Kirson','Whitney Cummings','Adrienne Iapulucci']
        this.gender = ['Male','Female','Other']
        this.date_of_birth = ['Apr 03, 1993','Dec 01, 1954','May 30, 2001','Feb 27, 2020']
        this.medical_conditions = ['Asthma', 'High Blood Pressure', 'Diabetes', 'High Cholesterol']
        this.medications = ['Prozak', 'Tums', 'Pepto Bismol','Aspirin','None']
        this.allergies = ['Penecillin','Advil','Aleve','Excedrine','Tylenol','Pollen','None']
        this.instructions = ['Try to do the thing, so that it does what it is supposed to do','If the thing is not working, just try and make it so that it works','Make the thing work by doing what is required']
        this.site_phone = randomNum(200,999) + '-' + randomNum(100,999) + '-' + randomNum(1000,9999)
        this.name = ['Eden Smith','Jace Williams','Kai Mao','Quinn West','Rain Wilson','Stevie Wonder','Xavi Alonso','Yale McDonald']
        this.phone = '+' + randomNum(2000000000,8000000000)
        this.relationship = ['Mother', 'Father', 'Spouse', 'Son', 'Daughter']
        this.language = ['English', 'Spanish', 'French', 'Korean', 'Mandarin', 'Cantonese']
        //Dynamic Spatial Layers
        this.oAuthHeaders = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        this.oAuthUrlString = '.rapidsos.com/oauth/token'
        this.partnerList = ['iar','public sonar']
        this.dynamicLayersEndpoint = '.rapidsos.com/v1/dynamic-layers'
                //IAR  
        this.oAuthClientIdQaDeltaIAR = 'NbUreG1pAzGK1t9LSrOv8tTh9uE1G8LD' // not setup in andromeda yet
        this.oAuthClientSecQaDeltaIAR = '0gfdxlkJfgt2Oeb2' // not setup in andromeda yet
        this.oAuthClientIdQaIAR = 'NbUreG1pAzGK1t9LSrOv8tTh9uE1G8LD'
        this.oAuthClientSecQaIAR = '0gfdxlkJfgt2Oeb2'
        this.oAuthClientIdSandIAR = 'NJaGVHMEvF7Hq4ZfXKfY5q0Ve3GmoxHD'
        this.oAuthClientSecSandIAR = '0nxGeEyADKsjoOeA'
        this.oAuthClientIdStagingIAR = 'NJaGVHMEvF7Hq4ZfXKfY5q0Ve3GmoxHD'
        this.oAuthClientSecStagingIAR = '0nxGeEyADKsjoOeA'
                //Public sonar
        this.oAuthClientIdQaDeltaPubSonar = 'vD6jJx55SJS1OnqnCnsoW6cWP7g7m0GD' 
        this.oAuthClientSecQaDeltaPubSonar = 'fGluSY3kNOyVFoDk' 
        this.oAuthClientIdQaPubSonar = 'vD6jJx55SJS1OnqnCnsoW6cWP7g7m0GD'
        this.oAuthClientSecQaPubSonar = 'fGluSY3kNOyVFoDk'
        this.oAuthClientIdSandPubSonar = 'JoLbPHxJiaIG0u5fMqp3G2X2Q2d6C9Ek'
        this.oAuthClientSecSandPubSonar = 'Se4x7ENL93rBRr5q'
        this.oAuthClientIdStagingPubSonar = 'JoLbPHxJiaIG0u5fMqp3G2X2Q2d6C9Ek'
        this.oAuthClientSecStagingPubSonar = 'Se4x7ENL93rBRr5q'
                
    }

    //async wait(time) { //ms
      //  await this.page.waitForTimeout(time)
    //}
}
