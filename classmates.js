const puppeteer = require('puppeteer');
const puppeteerBrowser = puppeteer.launch({ ignoreHTTPSErrors: true });

function classmate(classNum) {
    const url1 = 'http://credit.stu.edu.cn/Info/DisplayKkb.aspx?ClassID=';
    let url = url1 + classNum;

    return new Promise((resolve, reject) => {
        puppeteerBrowser.then(async browser => {
            const page = await browser.newPage();// 打开一个空白页
            await page.goto(url);
            let content = await page.evaluate(() => {
                let class_info = {
                    beginTime: '',
                    className: '',
                    classNo: '',
                    classRoom: '',
                    semester: '',
                    stuNum: '',
                    student: [],
                    teacher: ''
                };
                class_info.beginTime = document.getElementById('ctl00_cpContent_lbl_Time').innerText;
                class_info.className = document.getElementById('ctl00_cpContent_lbl_CourseName').innerText;
                class_info.classNo = document.getElementById('ctl00_cpContent_lbl_ClassID').innerText;
                class_info.classRoom = document.getElementById('ctl00_cpContent_KkbClassroom').innerText;
                class_info.semester = document.getElementById('ctl00_cpContent_lbl_Semester').innerText;
                class_info.stuNum = document.getElementById('ctl00_cpContent_lbl_Number').innerText;
                let content = [...document.querySelectorAll('.gridview_row> td')].concat([...document.querySelectorAll('.gridview_alter> td')]);
                let classmate = [];
                for (let i = 0, j = 0, num = 0, len = content.length / 6; i < len; i++, j++) {
                    let temp = {
                        number: 0,
                        name: '',
                        gender: '',
                        major: ''
                    };
                    temp.number = content[j++].innerText;
                    temp.name = content[j++].innerText;
                    temp.gender = content[j++].innerText;
                    temp.major = content[j++].innerText;
                    classmate[num] = temp;
                    num++;
                    j++;
                }
                class_info.student = classmate;
                class_info.teacher = document.getElementById('ctl00_cpContent_KkbTeacher').innerText;
                return class_info;
            });
            resolve(content);
            await page.close();
        });
    });
}

module.exports = classmate;