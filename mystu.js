const puppeteer = require('puppeteer');

// 爬 mystu
const loginUrl = 'https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F';

const checkUrl = 'https://sso.stu.edu.cn/login';

// // 输入账号
// let username = '';
// // 输入密码
// let password = '';

const puppeteerBrowser = puppeteer.launch({ ignoreHTTPSErrors: true });

function login(username, password) {
    /**
     * 参数类型：字符串
     * 返回一个promise对象
     */
    const message = [
        { retcode: '010101', msg: '✅登录成功💯' },
        { retcode: '010102', msg: '未连接网络' },
        { retcode: '010103', msg: '账号/密码错误' },
        { retcode: '010104', msg: '网络连接超时' }
    ];

    let p1 = new Promise((resolve, reject) => {
        puppeteerBrowser.then(async browser => {
            const page = await browser.newPage();
            try {
                // console.time('page.goto()用时:');
                await page.goto(loginUrl);
                // console.timeEnd('page.goto()用时:');
                // console.time('登录及验证用时:');
                await page.type('#username', username);
                await page.type('#password', password);

                await Promise.all([
                    page.waitForNavigation(),
                    page.click('.login-button'),
                ]);

                if (page.url().indexOf(checkUrl) === -1) {
                    // console.log('登录成功');
                    resolve(message[0]);
                } else {
                    // console.log('账号不存在或密码错误');
                    reject(message[2]);
                }
                // console.timeEnd('登录及验证用时:');
            } catch (err) {
                reject(message[1]);
            } finally {
                // let keys = await page.cookies(checkUrl);
                // await page.deleteCookie(keys[0], keys[1], keys[2], keys[3]);
                await page._client.send('Network.clearBrowserCookies');
                await page.close();
                // await browser.close();
            }
        });
    });

    let p2 = new Promise((resolve, reject) => {
        setTimeout(reject, 8000, message[3]);
    });

    return Promise.race([p1, p2])
        .then(value => {
            return value;
        })
        .catch(value => {
            return value;
        });
}

// 调用函数
// login(username, password).then(value => {
//     console.log(value);
// });

module.exports = login;