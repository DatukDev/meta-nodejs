const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const dotenv = require('dotenv');
const axios = require('axios');
const os = require('os');
const path = require('path');
const colors = require('colors');
const fs = require('fs');
const wmi = require('node-wmi');

// Load environment variables
dotenv.config();

// Function to get HWID
const getHwid = async () => {
    return new Promise((resolve, reject) => {
        wmi.Query({
            class: 'Win32_ComputerSystemProduct'
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const hwid = result[0].UUID;
                console.log(`Yours HWID: ${hwid.cyan}`);
                resolve(hwid);
            }
        });
    });
};

// Function to check license
const checkLicense = async (hwid) => {
    try {
        const response = await axios.get("https://rifkiidr.my.id/uuid.txt");
        const validHwids = response.data.trim().split("\n");
        if (validHwids.includes(hwid)) {
            console.log("License AKTIF".green);
            return true;
        } else {
            console.log("LICENSE TIDAK AKTIF. Aplikasi akan ditutup.".red);
            return false;
        }
    } catch (error) {
        console.log("Gagal memeriksa lisensi:".red);
        console.log(error.toString().red);
        process.exit();
    }
};

// Function to login to Facebook
const loginToFacebook = async (driver, username, password) => {
    console.log("Memulai proses login...".blue);
    try {
        console.log("Sedang Input Username".blue);
        await driver.wait(until.elementLocated(By.xpath('//*[@id="email"]')), 10000).sendKeys(username);

        console.log("Sedang Input Password".blue);
        await driver.wait(until.elementLocated(By.xpath('//*[@id="pass"]')), 10000).sendKeys(password, Key.RETURN);

        await driver.sleep(5000);

        try {
            const errorMessageElement = await driver.findElement(By.xpath('//*[@id="error_box"]'));
            const errorMessage = await errorMessageElement.getText();
            if (errorMessage.includes("Invalid username or password")) {
                console.log("Username atau password salah. Aplikasi akan ditutup.".red);
                await driver.quit();
                return false;
            } else {
                console.log("Terjadi kesalahan saat mencoba untuk login:".red);
                console.log(errorMessage.red);
                return false;
            }
        } catch {
            console.log("Login berhasil.".green);
            return true;
        }
    } catch (error) {
        console.log("Terjadi kesalahan saat mencoba untuk login:".red);
        console.log(error.toString().red);
        return false;
    }
};

// Function to get the current date and time
const date = () => {
    return `[${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}]`;
};

// Retrieve PROFILE_FOLDER from environment variables
const profileFolder = process.env.PROFILE_FOLDER;
const username = process.env.FB_USERNAME;
const password = process.env.PASSWORD;
const facebookUrl = process.env.FACEBOOK_URL;

// Print environment variables in a neat ASCII table
console.log(`
+------------------+-------------------+-----------------------+------------+
| Profile Folder   | Facebook URL      | FB Username           | Password   |
+------------------+-------------------+-----------------------+------------+
| ${profileFolder.padEnd(16)} | ${facebookUrl.padEnd(17)} | ${username.padEnd(21)} | ${password.padEnd(10)} |
+------------------+-------------------+-----------------------+------------+
`);

if (!profileFolder || !username || !password || !facebookUrl) {
    console.log("One or more environment variables are not defined.".red);
    process.exit(1);
}

// Construct profile path
const profilePath = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', profileFolder);

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

const main = async () => {
    while (true) {
        const hwid = await getHwid();

        if (!await checkLicense(hwid)) {
            console.log("TIDAK VALID".red);
            break;
        }

        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            console.log("Mengakses halaman Facebook...".blue);
            await driver.get(facebookUrl);
            await driver.sleep(3000);

            const currentUrl = await driver.getCurrentUrl();
            console.log(`Current URL: ${currentUrl}`);

            if (currentUrl === "https://www.facebook.com/home.php") {
                console.log("Sudah login. Langsung ke send.js.".green);
                await driver.quit();
                console.log("Executing send.js...");
                require('child_process').execSync('node send.js', { stdio: 'inherit' });
                process.exit();
            } else {
                if (await loginToFacebook(driver, username, password)) {
                    await driver.quit();
                    console.log("Proses login Facebook selesai.".green);
                    console.log("Executing send.js...");
                    require('child_process').execSync('node send.js', { stdio: 'inherit' });
                    process.exit();
                } else {
                    console.log("Proses login Facebook gagal.".red);
                }
            }
        } catch (error) {
            console.log("Terjadi kesalahan yang tidak dapat diprediksi:".red);
            console.log(error.toString().red);
        }
    }
};

main();
