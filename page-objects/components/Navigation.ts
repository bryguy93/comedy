import { Page } from '@playwright/test'
import { Json } from 'twilio/lib/interfaces'

export class Navigation{
    readonly page: Page
    readonly slowmo: number
    readonly enviroVarName: string
    readonly comedyCellarheaders
    readonly comedyCellarUrl: string
    
    constructor(page: Page){
        this.page = page
        this.slowmo = 1
        this.enviroVarName = 'TEST_ENVIRO_CLI'
        this.comedyCellarheaders = { 
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
        this.comedyCellarUrl = 'https://www.comedycellar.com/lineup/api/'
    }
}