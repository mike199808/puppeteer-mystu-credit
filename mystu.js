const cmpurl = 'https://sso.stu.edu.cn';
function login(account, password, browser) {
    let errorNum = 0;
    let p1 = new Promise((resolve, reject) => {
        (async browser => {
            const page = await browser.newPage();// 打开一个空白页
            try {
                await page.goto('https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F');// 打开mystu网站
                console.time();
                await page.type('#username', account);
                await page.type('#password', password);
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('.login-button'),
                ]);
                if (page.url().indexOf(cmpurl) === -1) {
                    resolve({ retcode: '010101', msg: '登录成功' });
                }
                else {
                    errorNum = 3;
                    reject(new Error("{retcode: '010103', msg: '账号或密码错误'}"));
                }
                console.timeEnd();
            } catch (err) {
                // console.log('success');
                if ((await page.cookies('https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F'))[2].value === account)
                {
                    resolve({ retcode: '010101', msg: '登录成功' });
                }
                errorNum = 2;
                reject(new Error("{retcode: '010102', msg: '未连接网络'}"));
            }
            await page.close();  // 关掉浏览器
        })(browser);
    });
    let p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            errorNum = 4;
            reject(new Error("{retcode: '010204', msg: '连接超时'}"));
        }, 10000);
    });
    return Promise.race([p1, p2])
        .then(result => {
            return result;
        })
        .catch(err => {
            console.log(err);
            if (errorNum === 2) {
                return ({ retcode: '010102', msg: '未连接网络' });
            } else if (errorNum === 3) {
                return ({ retcode: '010103', msg: '账号或密码错误' });
            } else {
                return ({ retcode: '010204', msg: '连接超时' });
            }
        });
}
module.exports = login;