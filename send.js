const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();
const colors = require('colors');

// Function to get the current date and time
const date = () => {
    const now = new Date();
    return `[${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}]`;
};

// Function for countdown
const countdown = async (seconds) => {
    for (let remaining = seconds; remaining >= 0; remaining--) {
        process.stdout.write(`\r${'[BOT]'.green} ${date()} Istirahat Sebentar ${'['.yellow}${remaining} Detik${']'.yellow}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    process.stdout.write("\n");
};

const envValues = process.env;

const userDataDir = path.join(envValues.USERPROFILE, 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
const profilePath = path.join(userDataDir, envValues.PROFILE_FOLDER);
console.log(`${'[INFO]'.cyan} Profile Path: ${profilePath}`);

const sleepTime = parseInt(envValues.SLEEP_TIME, 10) || 0;

// Create Chrome options
const options = new chrome.Options()
.addArguments(`--user-data-dir=${profilePath}`)
.addArguments("--disable-features=SameSiteByDefaultCookies")
.addArguments("--headless")
.addArguments("--disable-dev-shm-usage")
.addArguments("--no-sandbox")
.addArguments("--disable-gpu")
.addArguments("--log-level=3")
.addArguments("--disable-extensions")
.addArguments("--disable-popup-blocking")
.addArguments("--disable-background-timer-throttling")
.addArguments("--disable-backgrounding-occluded-windows")
.addArguments("--disable-renderer-backgrounding")
.addArguments("--disable-client-side-phishing-detection")
.addArguments("--disable-default-apps")
.addArguments("--disable-hang-monitor")
.addArguments("--disable-prompt-on-repost")
.addArguments("--disable-sync")
.addArguments("--metrics-recording-only")
.addArguments("--no-first-run")
.addArguments("--safebrowsing-disable-auto-update")
.addArguments("--remote-debugging-port=9222");

(async function sendMessages() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Access the Facebook inbox page
        await driver.get(envValues.INBOX_URL);

        // Read the message from the text file
        const message = fs.readFileSync('./pesan.txt', 'utf-8').trim();

        // Read and store phone numbers from the text file into a list
        let phoneNumbers = fs.readFileSync('./nomor_telepon.txt', 'utf-8').split('\n').filter(Boolean);

        let index = 1;
        while (phoneNumbers.length) {
            const phoneNumber = phoneNumbers.shift();
            console.log(`[${index}] ${date()} Mengirim Pesan WhatsApp ke Nomor ${''.yellow}${phoneNumber.yellow}${''.yellow}`);
            try {
                await driver.wait(until.elementLocated(By.xpath("//span/div/div[2]/div/div")), 10000);
                let newMessageButton = await driver.findElement(By.xpath("//span/div/div[2]/div/div"));
                await newMessageButton.click();

                await driver.wait(until.elementLocated(By.xpath("//div[2]/div/div[2]/div[2]/div/span/div/div")), 10000);
                let contactSearchBox = await driver.findElement(By.xpath("//div[2]/div/div[2]/div[2]/div/span/div/div"));
                await contactSearchBox.click();

                await driver.wait(until.elementLocated(By.xpath("//div[2]/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div")), 10000);
                let phoneNumberInput = await driver.findElement(By.xpath("//div[2]/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div"));
                await phoneNumberInput.click();

                await driver.wait(until.elementLocated(By.xpath("//div[2]/div/div/div/div/div/div/div/div[2]/div/div/input")), 10000);
                let countryCodeInput = await driver.findElement(By.xpath("//div[2]/div/div/div/div/div/div/div/div[2]/div/div/input"));
                await countryCodeInput.sendKeys("62");

                await driver.wait(until.elementLocated(By.xpath("//div[2]/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div/div")), 10000);
                let countryCodeChoice = await driver.findElement(By.xpath("//div[2]/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div/div"));
                await countryCodeChoice.click();

                await driver.wait(until.elementLocated(By.xpath("//div[2]/div/div/input")), 10000);
                let phoneNumberInput2 = await driver.findElement(By.xpath("//div[2]/div/div/input"));
                await phoneNumberInput2.sendKeys(phoneNumber);

                await driver.wait(until.elementLocated(By.xpath("//div[2]/textarea")), 10000);
                let messageInput = await driver.findElement(By.xpath("//div[2]/textarea"));
                await messageInput.click();

                await messageInput.sendKeys(message);

                await driver.wait(until.elementLocated(By.xpath("//div[3]/div[2]/div[2]/div/span/div/div/div")), 10000);
                let sendMessageButton = await driver.findElement(By.xpath("//div[3]/div[2]/div[2]/div/span/div/div/div"));
                await sendMessageButton.click();

                console.log(`[${index}] ${date()} Pesan Berhasil Terkirim ke Nomor ${''.yellow}${phoneNumber.yellow}${''.yellow}`);
            } catch (error) {
                console.log(`[${index}] ${date()} ${'[ERROR]'.red} Gagal mengirim pesan ke Nomor ${'['.red}${phoneNumber.red}${']'.red}: ${error.message}`);
            }

            // Remove the phone number from the text file
            fs.writeFileSync('./nomor_telepon.txt', phoneNumbers.join('\n'));

            await countdown(sleepTime);
            index++;
        }

        // Print a message if no more data is left
        if (!phoneNumbers.length) {
            console.log(`${'[BOT]'.green} ${date()} Data Habis`);
            console.log(`${'[INFO]'.yellow} ${date()} Silakan isi ulang! Database yang telah diblast telah dihapus dari nomor_telepon.txt`);
        }
    } finally {
        // Close the browser
        await driver.quit();
    }
})();
