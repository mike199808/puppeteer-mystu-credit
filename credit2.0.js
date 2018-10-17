const puppeteer = require('puppeteer');
const account = `17jwmai2`;
const password = `JBL1214454wen`;
async function login(account, password) {

    const browser = await puppeteer.launch({ headless: false });// 打开浏览器

    const page = await browser.newPage();// 打开一个空白页
    console.time();
    try {
        await page.goto('http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn');// 打开mystu网站
    }
    catch {
        return new Promise(function(resolve) {
            resolve({ retcode: '010202', msg: '未连接网络' });
        });
    }
    const lasturl = page.url();
    await page.type('#txtUserID', account);
    await page.type('#txtUserPwd', password);
    await page.click('#btnLogon');
    await page.waitFor(500);
    // await page.waitForNavigation();
    let p1 = new Promise(function(resolve, reject)
    {
        /* setTimeout(()=>{
      resolve({retcode:'010204',msg:"连接超时"});
    },10000) */
        if (page.url() === lasturl) {
            resolve({ retcode: '010203', msg: '账号或密码错误' });
        }
        else {
            resolve({ retcode: '010201', msg: '登录成功' });
        }

    });
    let p2 = new Promise(resolve => {
        setTimeout(() => {
            resolve({ retcode: '010204', msg: '连接超时' });
        }, 9000);
    });

    return Promise.race([p2, p1]);

    /* if(await page.url()==lasturl){
        console.log("登录失败");
  }
  else{
      console.log("登录成功");
  }

  } */
    // console.timeEnd();
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
fldjfljsdjfklsdf
