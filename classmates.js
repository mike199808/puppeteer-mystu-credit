// const puppeteer = require('puppeteer');

async function classmate(browser) {
    // const browser = await puppeteer.launch({ headless: false });// 打开浏览器
    const page = await browser.newPage();// 打开一个空白页
    await page.goto('http://credit.stu.edu.cn/Info/DisplayKkb.aspx?ClassID=103846&auth=2BF58254C65E22E0DD500282542528EF');
    let content = await page.evaluate(() => {
        let temp = [...document.querySelectorAll('.gridview_row> td')].concat([...document.querySelectorAll('.gridview_alter> td')]);
        let stuNum = [];
        let name = [];
        let sex = [];
        let major = [];
        let classmate = {};
        for (let i = 0, j = 0, len = temp.length / 6; i < len; i++, j++) {
            stuNum[i] = temp[j++].innerText;
            name[i] = temp[j++].innerText;
            sex[i] = temp[j++].innerText;
            major[i] = temp[j++].innerText;
            j++;
        }
        classmate.stuNum = stuNum;
        classmate.name = name;
        classmate.sex = sex;
        classmate.major = major;
        console.log(name);
        return classmate;
    });

    console.log(content.name);
    // console.log(typeof (content));
    await page.close();
    return new Promise(function(resolve, reject) {
        resolve(content);
    });
}

module.exports = classmate;