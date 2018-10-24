const puppeteer = require('puppeteer');
const puppeteerBrowser = puppeteer.launch({ ignoreHTTPSErrors: true });

function classmate(classNum) {
    const url1 = 'http://credit.stu.edu.cn/Info/DisplayKkb.aspx?ClassID=';
    const url2 = '&auth=2BF58254C65E22E0DD500282542528EF';
    let url = url1 + classNum + url2;

    return new Promise((resolve, reject) => {
        puppeteerBrowser.then(async browser => {
            const page = await browser.newPage();// 打开一个空白页
            await page.goto(url);
            let content = await page.evaluate(() => {
                let content = [...document.querySelectorAll('.gridview_row> td')].concat([...document.querySelectorAll('.gridview_alter> td')]);
                let classmate = [];
                for (let i = 0, j = 0, num = 0, len = content.length / 6; i < len; i++, j++) {
                    let temp = {
                        stuNum: 0,
                        name: '',
                        sex: '',
                        major: ''
                    };
                    temp.stuNum = content[j++].innerText;
                    temp.name = content[j++].innerText;
                    temp.sex = content[j++].innerText;
                    temp.major = content[j++].innerText;
                    classmate[num] = temp;
                    num++;
                    j++;
                }
                console.log(classmate);
                return classmate;
            });
            resolve(content);
            await page.close();
        });
    });
}

module.exports = classmate;