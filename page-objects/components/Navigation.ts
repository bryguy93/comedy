import { Page } from '@playwright/test'

export class Navigation{
    readonly page: Page
    readonly slowmo: number
    readonly enviroVarName: string
    
    constructor(page: Page){
        this.page = page
        this.slowmo = 1
        this.enviroVarName = 'TEST_ENVIRO_CLI'
    }
}