import { Page } from '@playwright/test'
import { Json } from 'twilio/lib/interfaces'

export class Navigation{
    readonly page: Page
    readonly slowmo: number
    readonly enviroVarName: string

    readonly reportDays: number

    readonly comedyCellarheaders
    readonly comedyCellarUrl: string
    readonly theStandheaders
    readonly theStandUrl: string
    readonly nyccheaders
    readonly nyccUrl: string
    readonly theStoreheaders
    readonly theStoreUrl: string
    
    constructor(page: Page){
        this.page = page
        this.slowmo = 1
        this.enviroVarName = 'TEST_ENVIRO_CLI'

        this.reportDays = 30

        this.comedyCellarUrl = 'https://www.comedycellar.com/lineup/api/'
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
        
        this.theStandUrl = 'https://thestandnyc.com/shows'
        this.theStandheaders = { 
            'authority': 'thestandnyc.com', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
            'accept-language': 'en-US,en;q=0.9', 
            'referer': 'https://thestandnyc.com/shows', 
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'sec-fetch-dest': 'document', 
            'sec-fetch-mode': 'navigate', 
            'sec-fetch-site': 'same-origin', 
            'sec-fetch-user': '?1', 
            'upgrade-insecure-requests': '1', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
          }
          
        this.nyccUrl = 'https://newyorkcomedyclub.com/calendar/'
        this.nyccheaders = { 
          'authority': 'newyorkcomedyclub.com', 
          'accept': '*/*', 
          'accept-language': 'en-US,en;q=0.9', 
          'referer': 'https://newyorkcomedyclub.com', 
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"macOS"', 
          'sec-fetch-dest': 'empty', 
          'sec-fetch-mode': 'cors', 
          'sec-fetch-site': 'same-origin', 
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', 
          'x-requested-with': 'XMLHttpRequest'
        }
        
        this.theStoreUrl = 'https://www.showclix.com/events/30111'
        this.theStoreheaders = { 
          'authority': 'www.showclix.com', 
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
          'accept-language': 'en-US,en;q=0.9', 
          'cache-control': 'max-age=0', 
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"macOS"', 
          'sec-fetch-dest': 'document', 
          'sec-fetch-mode': 'navigate', 
          'sec-fetch-site': 'same-origin', 
          'sec-fetch-user': '?1', 
          'upgrade-insecure-requests': '1', 
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        }
    }
}