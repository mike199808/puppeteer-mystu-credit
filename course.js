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
     * yearValue: 学年  例：2017-2018
     * semesterIndex: 1、春季学期; 2、夏季学期; 3、秋季学期
     * 返回值: 一个promise对象
     */
    return new Promise((resolve, reject) => {
        puppeteerBrowser.then(async browser => {
            const page = await browser.newPage();
            try {
                await page.goto(url);
                await page.on('dialog', value => {
                    let message = { 'ERROR': 'the password is wrong' };
                    reject(message);
                });

                await page.type('#txtUserID', username);
                await page.type('#txtUserPwd', password);

                await Promise.all([
                    page.waitForNavigation(),
                    page.click('#btnLogon'),
                ]);

                await page.goto(coursesUrl);
                // await page.waitFor(10000);
                await page.evaluate((yearValue, semesterIndex) => {
                    let year = document.getElementById('ucsYS_XN_Text');
                    let semester = document.getElementById('ucsYS_XQ');
                    year.value = `${yearValue}学年`;
                    semester.options[semesterIndex - 1].selected = true;
                    // return `${year.value}  ${semester.options[semesterIndex].text}`;
                }, yearValue, semesterIndex);
                // console.log(timeFrame);
                await Promise.all([
                    page.click('#btnSearch'),
                    page.waitForNavigation(),
                ]);

                const coursesList = await page.evaluate(() => {
                    const weekDay = ['w0', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
                    const keyList = ['id', 'name', 'credit', 'teacher', 'room', 'duration', 'days'];

                    let coursesList = [];
                    let temp = [...document.querySelectorAll('#DataGrid1 .DGItemStyle'), ...document.querySelectorAll('#DataGrid1 .DGAlternatingItemStyle')] || [];
                    temp.forEach(course => {
                        let courseData = {};
                        let i = 0;
                        let temp2 = [...course.querySelectorAll('td')];
                        for (i = 0; i < 6; i++) {
                            courseData[keyList[i]] = temp2[i].textContent.replace(/\s+/g, '');
                        }
                        let days = {};
                        for (i = 6; i < 13; i++) {
                            let time = temp2[i].textContent.replace(/\s+/g, '');
                            days[weekDay[i - 6]] = time || 'None';
                        }
                        courseData[keyList[6]] = days;

                        coursesList.push(courseData);
                    });
                    return coursesList;
                });
                resolve(coursesList);
            } catch (err) {
                console.log(err);
                reject(err);
            } finally {
                await page.close();
                // await browser.close();
            }
        });
    });
}

// getCourses('', '', '2017-2018', 3).then(value => {
//     console.log(value);
// }).catch(value => {
//     console.log(value);
// });

module.exports = getCourses;