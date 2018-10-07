const puppeteer = require('puppeteer');
const cmpurl = 'https://sso.stu.edu.cn';
let express = require('express');
let app = express();

app.post('/puppeteer', function (req, res) {
    async function login(account, password) {
        const browser = await puppeteer.launch({ headless: true });// 打开浏览器
        const page = await browser.newPage();// 打开一个空白页
        try {
            await page.goto('https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F');// 打开mystu网站
        } catch {
            return new Promise(function(resolve) {
                resolve({ retcode: '010102', msg: '未连接网络' });
                browser.close();  // 关掉浏览器
            });
        }
        console.time();
        await page.type('#username', account);
        await page.type('#password', password);
        await Promise.all([
            page.waitForNavigation(),
            page.click('.login-button'),
        ]);
        return new Promise(function(resolve, reject)
        {
            if (page.url().indexOf(cmpurl) === -1) {
                resolve({ retcode: '010101', msg: '登录成功' });
            }
            else {
                resolve({ retcode: '010103', msg: '账号或密码错误' });
            }
            console.timeEnd();
            browser.close();  // 关掉浏览器
        });
    }

    async function start(account, password) {
        let result;
        result = await login(account, password);
        console.log(result);
        res.send(JSON.stringify(result));
    }
    start(req.query.account, req.query.password);
});
// 监听8081端口

let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log('应用实例，访问地址为 http://%s:%s', host, port);

});