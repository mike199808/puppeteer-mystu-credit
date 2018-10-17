
function login(account, password, browser) {
    let errorNum = 0;
    let p1 = new Promise((resolve, reject) => {
        (async browser => {
            const page = await browser.newPage();// 打开一个空白页
            try {
                await page.goto('http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn');// 打开mystu网站
                console.time();
                const lasturl = page.url();
                await page.type('#txtUserID', account);
                await page.type('#txtUserPwd', password);
                await page.click('#btnLogon');
                await page.waitFor(500);
                if (page.url() === lasturl) {
                    errorNum = 3;
                    reject(new Error("{retcode: '010103', msg: '账号或密码错误'}"));
                }
                else {
                    resolve({ retcode: '010201', msg: '登录成功' });
                }
                console.timeEnd();
            } catch (err) {
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