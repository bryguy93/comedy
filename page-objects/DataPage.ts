import { Locator, Page, expect} from '@playwright/test'
import { AbstractPage } from './AbstractPage'

export class DataPage extends AbstractPage{
    //define selectors
    //readonly page: Page
    readonly googleMap: Locator
    readonly keyboardShortcutText: Locator
    readonly notifBanner: Locator
    readonly notifBannerButton: Locator
    readonly mostRecentLoc: Locator
    readonly dispatchAedButon: Locator
    readonly aviveAedText: Locator
    readonly currentLatLongButton: Locator
    readonly launchAedsButton: Locator
    readonly aviveAedReqMadeText: Locator
    readonly newAedNoteButton: Locator
    readonly sendNewNoteText: Locator
    readonly addNoteField: Locator
    readonly sendNoteButton: Locator
    readonly noteSentText: Locator
    readonly cancelRequestButton: Locator
    readonly yesCancelReq: Locator
    readonly all911Events: Locator
    readonly removeAllText: Locator
    readonly yesRemoveallText: Locator
    readonly AedDisCancText: Locator
    readonly AedCancelFailText: Locator
    readonly midasTriggerEndpoint1: string
    readonly midasTriggerEndpoint2: string
    //911inform
    readonly QaStaging911informOldBridgeLat: number
    readonly QaStaging911informOldBridgeLong: number
    readonly AdrTitle911inform: Locator
    readonly AdrButton911inform: Locator
    readonly AdrPopupCancelButton911inform: Locator
    readonly AdrPopupProceedButton911inform: Locator
    readonly shanghaiUrl: string
    
    //initializes a loginPage object instance - called automatically when a new object instance is created
    // sets the values of the members of an object(default or user-defined) - does not return anything
    //class needs to be imported and then a var of type loginPage needs to be created
    constructor(page: Page){
        //this.page = page
        super(page) // call a constructor from the class from which it extends from
        this.googleMap = page.getByRole('region', { name: 'Map' })
        this.keyboardShortcutText = page.getByText('Keyboard shortcuts')
        this.notifBanner = page.locator('[data-test="notification-banner"]')
        this.notifBannerButton = page.locator('[data-test="notification-close"]')
        this.mostRecentLoc = page.getByText('Most Recent Locations, Estimated Addresses')
        this.dispatchAedButon =  page.getByRole('button', { name: 'Dispatch AED' })
        this.aviveAedText = page.getByText('Avive AED')
        this.currentLatLongButton = page.getByRole('button', { name: 'Use Current Lat/Long' })
        this.launchAedsButton = page.getByRole('button', { name: 'Launch AEDs' })
        this.aviveAedReqMadeText = page.getByText('Avive AED request made.')
        this.newAedNoteButton = page.getByRole('button', { name: 'New AED Note' })
        this.sendNewNoteText = page.getByText('Send New Note')
        this.addNoteField = page.getByPlaceholder('Add note')
        this.sendNoteButton = page.getByRole('button', { name: 'Send Note' })
        this.noteSentText = page.getByText('Note Sent.')
        this.cancelRequestButton = page.getByRole('button', { name: 'Cancel Request' })
        this.yesCancelReq = page.getByRole('button', { name: 'Yes, Cancel Request' })
        this.AedDisCancText = page.getByText('AED Dispatch Canceled')
        this.all911Events = page.getByText('All 911 Events')
        this.removeAllText = page.getByText('Remove All')
        this.yesRemoveallText = page.getByRole('button', { name: 'Yes, Remove All' })
        this.AedCancelFailText = page.getByText('Cancellation of the AED Dispatch has failed.')
        this.midasTriggerEndpoint1 = 'https://api-'
        this.midasTriggerEndpoint2 = '.rapidsos.com/v1/rem/internal_auth/trigger'
        
        //911inform
        this.QaStaging911informOldBridgeLat = 40.411792
        this.QaStaging911informOldBridgeLong = -74.302602
        this.AdrTitle911inform = page.getByText('CONNECTED BUILDING').nth(1)
        this.AdrButton911inform = page.getByRole('button', { name: 'Access Connected Building' })
        this.AdrPopupCancelButton911inform = page.getByRole('button', { name: 'Cancel' })
        this.AdrPopupProceedButton911inform = page.getByRole('button', { name: 'Yes, Proceed' })
        this.shanghaiUrl = 'https://sandbox.911inform.com/login.html'

    
    }

    //define methods

    async snapShotGmaps() {
        expect( await this.googleMap.screenshot()).toMatchSnapshot('gmaps.png')
    }

}