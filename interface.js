const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const mystu = require('./mystu');
const credit = require('./credit');
const classmate = require('./classmates');
let isLogin = 0;
(async function start() {
    const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
    // 登录mysut
    // let page = await browser.newPage();
    /* app.post('/puppeteer', function (req, res) {
        let account = req.query.account;
        let password = req.query.password;
        // console.log(mystu);
        mystu(account, password, browser).then(result => {
        // console.log(result);
            res.send(result);
            res.end();
        });
    }); */
    // 登录mcredit
    app.post('/puppeteer', function (req, res) {
        let account = req.query.account;
        let password = req.query.password;
        // console.log(mystu);
        credit(account, password, browser).then(result => {
            console.log(result.retcode);
            if (result.retcode === '010201') {
                isLogin = 1;
            }
            console.log(isLogin);
            res.send(result);
            res.end();
        });
    });
    // 中间件，用于获取同班同学信息
    app.post('/classmates', function (req, res) {
        let classNum = req.query.classNum;
        // console.log(req.query.classNum);
        if (isLogin === 1) {
            classmate(browser, classNum).then(result => {
                console.log(result);
                res.send(result);
                res.end();
            });
            // console.log(classmates);
            // res.send(classmates);
            // res.end();
        }
        else {
            console.log('你尚未登录，请先登录');
            res.send('你尚未登录，请先登录');
            res.end();
        }
    });
    let server = app.listen(8081, function () {

        let host = server.address().address;
        let port = server.address().port;

        console.log('应用实例，访问地址为 http://%s:%s', host, port);
    });
})();
