const axios = require('axios');

const USERNAME = 'PO4418';
const PASSWORD = encodeURIComponent('Ab@123456');

async function testDTDC() {
  console.log('--- Testing Auth for Tracking ---');
  try {
    const authUrl = `https://blktracksvc.dtdc.com/dtdc-api/api/dtdc/authenticate?username=${USERNAME}&password=${PASSWORD}`;
    const authRes = await axios.get(authUrl);
    console.log('Auth Status:', authRes.status);
    console.log('Auth Data:', authRes.data);
  } catch (e) {
    console.error('Auth Failed:', e.response?.data || e.message);
  }
}

testDTDC();
