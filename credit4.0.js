const puppeteer = require('puppeteer');
let express = require('express');
let app = express();
app.post('/puppeteer', function (req, res) {
    async function login(account, password) {
        const browser = await puppeteer.launch({ headless: true });// 打开浏览器

        const page = await browser.newPage();// 打开一个空白页
        try {
            await page.goto('http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn');// 打开mystu网站
        }
        catch (err) {
            return new Promise(function(resolve) {
                resolve({ retcode: '010202', msg: '未连接网络' });
                browser.close();
            });
        }
        console.time();
        const lasturl = page.url();
        await page.type('#txtUserID', account);
        await page.type('#txtUserPwd', password);
        await page.click('#btnLogon');
        await page.waitFor(100);
        return new Promise(function(resolve)
        {
            if (page.url() === lasturl) {
                resolve({ retcode: '010203', msg: '账号或密码错误' });
            }
            else {
                resolve({ retcode: '010201', msg: '登录成功' });
            }
            console.timeEnd();
            browser.close();
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

let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log('应用实例，访问地址为 http://%s:%s', host, port);

});
