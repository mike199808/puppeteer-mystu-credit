const puppeteer = require('puppeteer');

// 学分制
const url = 'http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn';
const coursesUrl = 'http://credit.stu.edu.cn/Elective/MyCurriculumSchedule.aspx';

const puppeteerBrowser = puppeteer.launch({ ignoreHTTPSErrors: true });

function getCourses(username, password, yearValue, semesterIndex) {
    /**
     * 参数:
     * username: 用户名
     * password: 密码
     * yearValue: 学年  例：2017-2018学年
     * semesterIndex: 0、春季学期; 1、夏季学期; 2、秋季学期
     * 返回值: 一个promise对象
     */
    const message = [
        { retcode: '010201', msg: '✅登录成功💯' },
        { retcode: '010202', msg: '未连接网络或未连接内网' },
        { retcode: '010203', msg: '账号/密码错误' },
        { retcode: '010204', msg: '网络连接超时' }
    ];
    return new Promise((resolve, reject) => {
        puppeteerBrowser.then(async browser => {
            const page = await browser.newPage();
            try {
                await page.goto(url);
                await page.on('dialog', value => {
                    reject(message[2]);
                });

                await page.type('#txtUserID', username);
                await page.type('#txtUserPwd', password);

                await Promise.all([
                    page.waitForNavigation(),
                    page.click('#btnLogon'),
                ]);

                await page.goto(coursesUrl);
                // await page.waitFor(10000);
                let timeFrame = await page.evaluate((yearValue, semesterIndex) => {
                    let year = document.getElementById('ucsYS_XN_Text');
                    let semester = document.getElementById('ucsYS_XQ');
                    year.value = yearValue;
                    semester.options[semesterIndex].selected = true;
                    return `${year.value}  ${semester.options[semesterIndex].text}`;
                }, yearValue, semesterIndex);
                console.log(timeFrame);
                await Promise.all([
                    page.click('#btnSearch'),
                    page.waitForNavigation(),
                ]);

                const coursesList = await page.evaluate(() => {
                    const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const keyList = ['courseNum', 'courseName', 'credit', 'teacher', 'classroom', 'startToEnd', 'classTime'];

                    let coursesList = [];
                    let temp = [...document.querySelectorAll('#DataGrid1 .DGItemStyle'), ...document.querySelectorAll('#DataGrid1 .DGAlternatingItemStyle')] || [];
                    temp.forEach(course => {
                        let courseData = {};
                        let i = 0;
                        let temp2 = [...course.querySelectorAll('td')];
                        for (i = 0; i < 6; i++) {
                            courseData[keyList[i]] = temp2[i].textContent.replace(/\s+/g, '');
                        }
                        let classTime = [];
                        for (i = 6; i < 13; i++) {
                            let time = temp2[i].textContent.replace(/\s+/g, '');
                            if (time) {
                                classTime.push(weekDay[i - 6] + time);
                            }
                        }
                        courseData[keyList[6]] = classTime;

                        coursesList.push(courseData);
                    });
                    return coursesList;
                });
                resolve(coursesList);
            } catch (err) {
                console.log(err);
                reject(message[1]);
            } finally {
                await page.close();
            }
        });
    });
}

module.exports = getCourses;