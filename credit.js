const puppeteer = require('puppeteer');

// 爬学分制
const url = 'http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn';

// 输入账号
// let username = '';
// 输入密码
// let password = '';

const puppeteerBrowser = puppeteer.launch({ ignoreHTTPSErrors: true });

function login(username, password) {
    /**
     * 参数类型：字符串
     * 返回一个promise对象
     */
    const message = [
        { retcode: '010201', msg: '✅登录成功💯' },
        { retcode: '010202', msg: '未连接网络或未连接内网' },
        { retcode: '010203', msg: '账号/密码错误' },
        { retcode: '010204', msg: '网络连接超时' }
    ];

    let p1 = new Promise((resolve, reject) => {

        puppeteerBrowser.then(async browser => {

            const page = await browser.newPage();

            try {
                // console.time('page.goto()用时:');
                await page.goto(url);

                await page.on('dialog', value => {
                    reject(message[2]);
                });
                // console.timeEnd('page.goto()用时:');
                // const loginUrl = await page.url();

                // console.time('登录及验证用时:');
                await page.type('#txtUserID', username);
                await page.type('#txtUserPwd', password);

                // await page.click('#btnLogon');
                // await page.waitFor(100);
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('#btnLogon'),
                ]);
                resolve(message[0]);

                // const loginedUrl = await page.url();
                // if (loginUrl !== loginedUrl) {
                //     resolve(message[0]);
                // } else {
                //     reject(message[2]);
                // }
                // console.timeEnd('登录及验证用时:');
            } catch (err) {
                reject(message[1]);
            } finally {
                await page.close();
            }
        });
    });

    let p2 = new Promise((resolve, reject) => {
        setTimeout(reject, 7000, message[3]);
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