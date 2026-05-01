const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  const filePath = `file://${path.join(__dirname, 'resume_template.html')}`;
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: 'Stan_Lee_Natividad_-_Intelligent_Systems_Engineer.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
})();
