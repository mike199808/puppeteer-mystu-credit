const puppeteer = require('puppeteer');
const account = `17jwmai2`;
const password = `xp626385`;
const cmpurl="https://sso.stu.edu.cn";
(async () => {
  const browser = await puppeteer.launch({headless:true});//打开浏览器
  try{
  const page = await browser.newPage();//打开一个空白页
  console.time();
  await page.goto('https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fv3%2F');//打开mystu网站
  await page.type('#username', account);    
  await page.type('#password', password);
  await page.click('#login');
  await page.waitForNavigation();
  //await page.waitFor(1000);
  //console.log(page.url());
  if(page.url().indexOf(cmpurl)==-1){
	  console.log("登录成功");
  }
  else{
	  console.log("登录失败");
  }
  }catch(e){
	  console.log(e);
	  console.log("网络出现异常");
  }
  console.timeEnd();
  await browser.close();//关掉浏览器
})();