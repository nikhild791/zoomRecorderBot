import { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver'
import {  Options } from 'selenium-webdriver/chrome'

async function openMeet(driver:WebDriver) {
  try {
    await driver.get('https://meet.google.com/ayk-xadb-ymu')
    const declineMediaButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Continue without microphone and camera")]')))
    declineMediaButton.click()
    // await driver.sleep(5000)
    const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Got it")]')))
    await popupButton.click()
    //! This line of code is not working becuase id is changing dynamically
    // const nameInput = await driver.wait(until.elementLocated(By.id('c12')), 10000);
    const nameInput = driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'Your name')]")))

    await nameInput.clear()
    await nameInput.click()
    await nameInput.sendKeys( " Meeting bot")
    const joinButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Ask to join") or contains(text(), "Join")]')))
    await joinButton.click()
    

  } finally {
    // await driver.quit()
  }
}

async function getDriver() {
  const options = new Options({})
  options.addArguments("--disable-blink-features=AutomationControlled")
  //? this will add fake audio and video 
  // options.addArguments("--use-fake-ui-for-media-stream")
  options.addArguments('--window-size=1440,900')
  options.addArguments('--auto-select-desktop-capture-source=[RECORD]') //[RECORD] is the title of my localhost page trying to screen capture
  options.addArguments('enable-usermedia-screen-capturing')
  options.addArguments('--remote-debugging-port=9222')
  return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
} 

async function startScreenShare(driver:WebDriver){

}

async function main() {
  const driver =await getDriver();
  await openMeet(driver);
  await startScreenShare(driver)
}

main()