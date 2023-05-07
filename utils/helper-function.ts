import { test, expect } from "@playwright/test";

// export async function loginRSP(user,pw) {
//     //await this.goto("https://qa.rapidsosportal.com/");
//     await this.locator("#email").fill(user);
//     await this.locator("#password").fill(pw);
//     await this.getByRole("button", { name: "Log in" }).click();

//     const banner = await this.$('[data-test="notification-close"]');
//     if (banner) {
//         await this.locator('[data-test="notification-close"]').click();
//     }    
// }


// export async function logoutRSP() {

// }