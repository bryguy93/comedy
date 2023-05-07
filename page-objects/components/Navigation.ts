import { Locator, Page } from '@playwright/test'

export class Navigation{
    readonly page: Page
    readonly hamburger: Locator 
    readonly logout: Locator 
    readonly admin: Locator 
    readonly data: Locator 
    readonly slowmo: number
    readonly enviroVarName: string
    // readonly payBills: Locator 
    // readonly myMoneyApp: Locator 
    // readonly onlineStatements: Locator 
    
    constructor(page: Page){
        this.page = page
        this.hamburger = page.locator('div:nth-child(2) > div:nth-child(2) > .sc-fFeiMQ > .sc-gKclnd')
        this.logout = page.getByText('Log Out')
        //this.logout = page.locator('//div[@data-name="navigation-control-logout-link"]')
        this.admin = page.getByRole('link', { name: 'Admin' })
        this.data = page.getByRole('list').getByRole('link', { name: 'Data' })
        this.slowmo = 0
        this.enviroVarName = 'TEST_ENVIRO_CLI'
    }

    async navHamburger(){
        await this.hamburger.click()
    }

    async navLogout(){
        await this.logout.click()
    }

    async navAdmin(){
        await this.admin.click()
    }
    
    // async clickOnLink(linkName){
    //     switch (linkName){
    //         case 'logout':
    //             await this.logout.click()
    //             break
    //         case 'hamburger':
    //             await this.hamburger.click()
    //             break
    //         // case 'Transfer Funds':
    //         //     await this.transferFunds.click()
    //         //     break
    //         // case 'Pay Bills':
    //         //     await this.payBills.click()
    //         //     break
    //         // case 'My Moey App':
    //         //     await this.myMoneyApp.click()
    //         //     break
    //         // case 'Online Statements':
    //         //     await this.onlineStatements.click()
    //         //     break
    //         // default:
    //         //     throw new Error('This tab does not exist ...')
            

    //     }
    // }

}