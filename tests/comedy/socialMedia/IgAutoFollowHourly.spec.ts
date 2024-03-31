import { test, expect } from '@playwright/test'
import { Hooks } from '../../../page-objects/components/Hooks'
import { Navigation } from '../../../page-objects/components/Navigation'
import { asyncWriteFile } from '../../../utils/helpers'
import axios from "axios"
import * as fs from 'fs'
import 'csv'


test.describe('INSTAGRAM', () => {

    let hooks: Hooks
    let navigation: Navigation
    
    test.beforeEach(async ({ page }) => {
        hooks = new Hooks(page)
        await hooks.instagramSetup()
        //console.log(hooks.comedyMob24url)
        
    })

    test('Hourly Follower', async ({ page, request }) => {

        navigation = new Navigation(page)
        let masterBool: boolean = false
        let followedBool: boolean = false
        let count: number = 0
        let followCount: number = 0

        await page.waitForTimeout(5000)
        //await page.getByRole('button', { name: 'Save info' }).first().waitFor({timeout:10000})
        
        //var data = fs.readFileSync('/Users/boyola/repos/comedy/utils/masterList.csv')
        var data = fs.readFileSync('utils/masterList.csv') 
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(',').map(e => e.trim())); // split each line to array

        //console.log(data)
        //console.log(data[0][3])
        //console.log(data.length)
        //console.log(JSON.stringify(data, '', 2)); // as json

        while(masterBool == false){
            if(count+1 > data.length){break}
            await page.goto(data[count][3],{timeout:5000})

            try{
            
                await page.locator('header').getByRole('button', { name: 'Follow' }).first().isVisible({timeout:5000}) 
                await page.locator('header').getByRole('button', { name: 'Follow' }).first().click({timeout:5000})
                //await page.waitForTimeout(3000)
                data[count][6] = 'Yes'
                followCount = followCount + 1
                console.log('SUCCESS: User ' + data[count][1] + ' is followed') 
             
            }catch(e){
                console.log(e.message)
                console.log('ERROR with user ' + data[count][1]) // add user to error message
               
            }


            
            if(followCount > 1){break}
            count = count + 1
            
        }

        data.splice(0,2)
        console.log(data)

        const stringData = data.reduce((accOne, array) => {
            const str = array.reduce((accTwo, item, index) => {
              return accTwo + `${item}${index < array.length - 1 ? ',' : ''}`
            }, '');
            return accOne + `${str}\n`;
          }, '');
          
          //fs.writeFileSync('/Users/boyola/repos/comedy/utils/masterList.csv', stringData);
          fs.writeFileSync('utils/masterList.csv', stringData); 

        // do while loop
        await page.getByRole('link', { name: 'Settings More' }).click();
        await page.getByRole('button', { name: 'Log out' }).click();
        
        
        
    })
})


