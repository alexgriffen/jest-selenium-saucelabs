import webdriver from 'selenium-webdriver';

const until = webdriver.until;
const By = webdriver.By;
const config = require('../config_mobile.json');

const start = async () =>
    new Promise((resolve, reject, error) => {
        if (error) {
            reject(error);
        }
        resolve();
    });

const stop = async () =>
    new Promise((resolve, reject, error) => {
        if (error) {
            reject(error);
        }
        resolve();
    });

const getElementById = async (driver, id, timeout = 5000) => {
    const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

for (const browser of config.browsers) {
    let driver;
    const capabilities = {
        // build: require('../package.json').version,
        // build: 'saucelabs-mobileTests.0.0.1',
        // browserName: 'chrome',
        // ...browser,
        testobject_api_key: process.env.TESTOBJECT_WEB_KEY,
        // deviceName: "iPhone XR",
        // platformVersion: "12",
        // platformName: "iOS",
        // privateDeviceOnly: true,
        browserName: browser.deviceName,
        deviceName: browser.deviceName,
        platformName: browser.platformName,
        name: 'Test with ' + browser.deviceName + ' and ' + browser.platformName
    };

    describe('webdriver', () => {

        beforeEach(async () => {
            try {
                await start();
                driver = new webdriver.Builder()
                    .usingServer('https://us1-manual.app.testobject.com/wd/hub')
                    .withCapabilities(capabilities)
                    .build();

                await driver.get('https://saucelabs.com/test/guinea-pig');
            } catch (error) {
                console.error('connection error', error);
            }
            // IMPORTANT! Selenium and Sauce Labs needs more time than regular Jest
        }, 180000);

        describe(`desc ${capabilities.deviceName} on version ${capabilities.platformVersion} on ${capabilities.platformName}`, () => {
            test(
                `desc ${capabilities.deviceName} on version ${capabilities.platformVersion} on ${capabilities.platformName}`,
                async () => {
                    // may help with debugging
                    // const src = await driver.getPageSource();
                    // console.log(src);

                    // driver.executeScript(`sauce:job-name=${capabilities.deviceName} on version ${capabilities.platformVersion} on ${capabilities.platformName}`);
                    // await driver.get('https://saucelabs.com/test/guinea-pig');
                    const resultString = 'Thanks in advance, this is really helpful.'; // set this way since we're doing two evaluations below on this same result
                    const btn = await getElementById(driver, 'checked_checkbox');
                    await btn.click();

                    const output = await getElementById(driver, 'comments');
                    const outputVal = await output.getAttribute('placeholder');

                    if (outputVal == resultString) {
                        var result = 'passed';
                    } else {
                        var result = 'failed';
                    }
                    console.log(result);

                    expect(outputVal).toEqual(resultString);

                    await driver.executeScript("sauce:job-result=" + (result));

                },
                // IMPORTANT! 90s timeout should be sufficient complete this test
                90000,
            );
            test(
                `desc Next test with ${capabilities.deviceName} on version ${capabilities.platformVersion} on ${capabilities.platformName}`,
                async () => {
                    // may help with debugging
                    // const src = await driver.getPageSource();
                    // console.log(src);

                    // await driver.get('https://saucelabs.com/test/guinea-pig');
                    const resultString = 'Thanks in advance, this is really helpful.'; // set this way since we're doing two evaluations below on this same result
                    const btn = await getElementById(driver, 'checked_checkbox');
                    await btn.click();

                    const output = await getElementById(driver, 'comments');
                    const outputVal = await output.getAttribute('placeholder');

                    if (outputVal == resultString) {
                        var result = 'passed';
                    } else {
                        var result = 'failed';
                    }
                    console.log(result);

                    expect(outputVal).toEqual(resultString);

                    await driver.executeScript("sauce:job-result=" + (result));
                },
                // IMPORTANT! 90s timeout should be sufficient complete test
                90000,
            );
        });

        afterEach(async () => {
            try {
                // await driver.executeScript("sauce:job-result=" + (result));
                await driver.quit(); // ~ 11 s !
                await stop(); // ~ 3 s
            } catch (error) {
                console.error('disconnection error', error);
            }
            // IMPORTANT! Selenium and Sauce Labs needs a lot of time!
        }, 600000);

    });
}
