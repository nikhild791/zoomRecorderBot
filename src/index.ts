import {
  Builder,
  Browser,
  By,
  Key,
  until,
  WebDriver,
} from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function openMeet(driver: WebDriver) {
  try {
    await driver.get("https://meet.google.com/ggc-vuoe-wua");
    const x = await driver.getWindowHandle();
    console.log(x + "Hi there");

    // const declineMediaButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Continue without microphone and camera")]')))
    // declineMediaButton.click()
    // await driver.sleep(5000)
    const popupButton = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(),"Got it")]'))
    );
    await popupButton.click();
    //! This line of code is not working becuase id is changing dynamically
    // const nameInput = await driver.wait(until.elementLocated(By.id('c12')), 10000);
    const nameInput = driver.wait(
      until.elementLocated(
        By.xpath("//input[contains(@placeholder,'Your name')]")
      )
    );

    await nameInput.clear();
    await nameInput.click();
    await nameInput.sendKeys(" Meeting bot");
    const joinButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//span[contains(text(),"Ask to join") or contains(text(), "Join")]'
        )
      )
    );
    await joinButton.click();
  } finally {
    // await driver.quit()
  }
}

async function getDriver() {
  const options = new Options({});
  options.addArguments("--disable-blink-features=AutomationControlled");
  //? this will add fake audio and video
  options.addArguments("--use-fake-ui-for-media-stream");
  // options.addArguments('--window-size=1440,900')
  // options.addArguments('--auto-select-desktop-capture-source=[RECORD]') //[RECORD] is the title of my localhost page trying to screen capture
  // options.addArguments('enable-usermedia-screen-capturing')
  // options.addArguments('--remote-debugging-port=9222')
  return await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
}

async function startScreenShare(driver: WebDriver, tabId: string) {
  console.log("screenShareStarted ");
  console.log(tabId);
  
  await driver.executeScript(`
    function wait(delayInMS) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
    }

    function startRecording(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data = [];
        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();
        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = (event) => reject(event);
        });
        let recorded = wait(lengthInMS).then(() => {
            if (recorder.state === "recording") {
                recorder.stop();
            }
        });
        return Promise.all([stopped, recorded]).then(() => data);
    }

    window.navigator.mediaDevices.getDisplayMedia({ video: {
    displaySurface:"browser"
    }, audio:true, preferCurrentTab:true,selfBrowserSurface:"include",monitorTypesSurfaces:"exclude" }).then(async (stream) => {
        console.log("beforeRecordingStarted");
        let recording = document.createElement("video");
        let downloadButton = document.createElement("a");
        const controller = new CaptureController();

// Prompt the user to share a tab, window, or screen.

// Query the displaySurface value of the captured video track
const [track] = stream.getVideoTracks();
const displaySurface = track.getSettings().displaySurface;

if (displaySurface == "browser") {
  // Focus the captured tab.
  controller.setFocusBehavior("focus-captured-surface");
} else if (displaySurface == "window") {
  // Do not move focus to the captured window.
  // Keep the capturing page focused.
  controller.setFocusBehavior("no-focus-change");
}
        console.log("Recording has been started");
        const recordedChunks = await startRecording(stream, 30000);
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";
        downloadButton.click();
        console.log("Recording has been completed");
    }).catch(error => {
        console.error("Error during screen recording: ", error);
    });
    console.log("There is recording going on ");
`);
}

async function main() {
  const driver = await getDriver();
  await openMeet(driver);
  const tabId = await driver.getWindowHandle();
  await startScreenShare(driver, tabId);
}

main();

//* getting videostream from the current tab and appending in the same tab DOM element
// window.navigator.mediaDevices.getDisplayMedia().then((stream)=>{
//   console.log(stream)
//       const videoEl = document.createElement(video);
//       videoEl.srcObject = stream;
//       videoEl.play();
//       document.getElementsByClassName('XDoBEd-JGcpL-MkD1Ye bXvFAe plQnQb')[0].appendChild(videoEl)
//   })
