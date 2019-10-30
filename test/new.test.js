import webdriver from 'selenium-webdriver';

const until = webdriver.until;
const By = webdriver.By;
const config = require('../config.json');

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
        build: 'saucelabs-poc_tests_x2.85',
        project: 'jest-selenium-saucelabs',
        // browserName: 'chrome',
        ...browser,
    };

    describe('webdriver', () => {

        beforeEach(async () => {
            try {
                await start();
                driver = new webdriver.Builder()
                    .usingServer('https://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com/wd/hub')
                    .withCapabilities(capabilities)
                    .build();

                await driver.get(
                    'https://saucelabs.com/test/guinea-pig',
                );
            } catch (error) {
                console.error('connection error', error);
            }
            // IMPORTANT! Selenium and Sauce Labs needs more time than regular Jest
        }, 100000);

        afterEach(async () => {
            try {
                // await driver.executeScript("sauce:job-result=" + (result));
                await driver.quit(); // ~ 11 s !
                await stop(); // ~ 3 s
            } catch (error) {
                console.error('disconnection error', error);
            }
            // IMPORTANT! Selenium and Sauce Labs needs a lot of time!
        }, 20000);


        describe(`desc ${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`, () => {
            test(
                `desc ${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`,
                async () => {
                    // may help with debugging
                    // const src = await driver.getPageSource();
                    // console.log(src);

                    driver.executeScript(`sauce:job-name=${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`);

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
                // IMPORTANT! 5s timeout should be sufficient complete test
                50000,
            );
        });
        describe(`desc Second Test with ${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`, () => {
            test(
                `desc Second Test with ${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`,
                async () => {
                    // may help with debugging
                    // const src = await driver.getPageSource();
                    // console.log(src);

                    driver.executeScript(`sauce:job-name=Second Test with ${capabilities.browserName} on version ${capabilities.version} on ${capabilities.platform}`);

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
                // IMPORTANT! 5s timeout should be sufficient complete test
                50000,
            );
        });
    });
}
