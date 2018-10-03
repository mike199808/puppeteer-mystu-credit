const puppeteer = require('puppeteer');
const account = `17jwmai2`;
const password = `xp626384`;
(async () => {
  
  const browser = await puppeteer.launch({headless:false});//打开浏览器
  try{
  const page = await browser.newPage();//打开一个空白页
  console.time();
  await page.goto('http://credit.stu.edu.cn/english/setlocale.aspx?locale=zh-cn');//打开mystu网站
  const lasturl=page.url();
  await page.type('#txtUserID', account);    
  await page.type('#txtUserPwd', password);
  await page.click('#btnLogon');
  await page.waitFor(500);
  //await page.waitForNavigation();
  if(await page.url()==lasturl){
	  console.log("登录失败");
  }
  else{
	  console.log("登录成功");
  }
  }catch(e){
	  console.log(e);
	  console.log("你没有连接校园网");
  }
  console.timeEnd();
  await browser.close();//关掉浏览器
})();