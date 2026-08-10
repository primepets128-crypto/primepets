import { JSDOM } from 'jsdom';

async function test() {
  const dom = await JSDOM.fromURL("http://localhost:5174/", {
    runScripts: "dangerously",
    resources: "usable"
  });

  dom.window.addEventListener('error', (event) => {
    console.error('JSDOM Error:', event.error);
  });
  
  dom.window.addEventListener('unhandledrejection', (event) => {
    console.error('JSDOM Unhandled Rejection:', event.reason);
  });

  setTimeout(() => {
    console.log('Body:', dom.window.document.body.innerHTML.substring(0, 500));
    
    // Find a product card
    const card = dom.window.document.querySelector('.product-card');
    if (card) {
      console.log('Found card, clicking...');
      card.click();
      
      setTimeout(() => {
        console.log('After click URL:', dom.window.location.href);
        console.log('Body after click:', dom.window.document.body.innerHTML.substring(0, 500));
        process.exit(0);
      }, 2000);
    } else {
      console.log('No card found');
      process.exit(1);
    }
  }, 5000);
}

test();
