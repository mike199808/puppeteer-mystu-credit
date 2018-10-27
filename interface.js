const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const getCourses = require('./course');
const getClassmates = require('./classmates');
// const morgan = require('morgan');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
// HTTP请求体解析中间件
app.use(bodyParser.json({ limit: '1mb' }));

// 打印日志中间件
/* app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res) + 'ms'
    ].join('   ');
})); */

app.post('/syllabus', urlencodedParser, function (req, res) {
    /**
     * 参数:
     * username: 用户名
     * password: 密码
     * years: 学年  例：2017-2018
     * semester: 1-春季学期; 2-夏季学期; 3-秋季学期
     * 返回值: { 'classes': courseList }
     */
    let username = req.body.username;
    let password = req.body.password;
    let years = req.body.years;
    let semester = req.body.semester;
    getCourses(username, password, years, semester).then(value => {
        let result = { 'classes': value };
        res.send(result);
        res.end();
    }).catch(value => {
        res.send(value);
        res.end();
    });
});

app.post('/member', urlencodedParser, function (req, res) {
    /**
     * 参数: class_id
     */
    let class_id = req.body.class_id;
    getClassmates(class_id).then(result => {
        res.send(result);
        res.end();
    });
});

app.listen(3000);