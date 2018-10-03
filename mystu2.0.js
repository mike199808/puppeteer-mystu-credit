const puppeteer = require('puppeteer');
const account = `17jwmai2`;
const password = `JBL1214454wen`;
const cmpurl = 'https://sso.stu.edu.cn';

async function login(account, password) {
    console.time();
    const browser = await puppeteer.launch({ headless: false });// 打开浏览器
    const page = await browser.newPage();// 打开一个空白页
    /* let p2 = new Promise(resolve=>{
      setTimeout(()=>{
      resolve();
       },0)
     }) */
    try {
        await page.goto('https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F');// 打开mystu网站
    } catch {
        return new Promise(function(resolve) {
            resolve({ retcode: '010102', msg: '未连接网络' });
        });
    }

    // console.time();
    await page.type('#username', account);
    await page.type('#password', password);
    await page.click('#login');
    page.waitForNavigation();
    // await page.waitFor(1000);
    // console.log(page.url());
    let p1 = new Promise(function(resolve, reject)
    {
        /* setTimeout(()=>{
      resolve('连接超时');
    },10000) */
        if (page.url().indexOf(cmpurl) === -1) {
            resolve({ retcode: '010101', msg: '登录成功' });
        }
        else {
            resolve({ retcode: '010103', msg: '账号或密码错误' });
        }

    });
    let p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve({ retcode: '010104', msg: '连接超时' });
        }, 10000);
    });

    return Promise.race([p2, p1]);
}

async function start() {
    let result;
    result = await login(account, password);
    console.log(result);
    console.timeEnd();
    process.exit();

    // browser.close();//关掉浏览器
}
start();
