const axios = require('axios');

const USERNAME = 'PO4418';
const PASSWORD = 'Ab@123456';
const API_KEY = '3f7bac4827bc43f6bf6ea6de401846';

async function testDTDC() {
  console.log('--- Testing Auth for Tracking ---');
  let token = '';
  try {
    const authUrl = `https://blktracksvc.dtdc.com/dtdc-api/api/dtdc/authenticate?username=${USERNAME}&password=${PASSWORD}`;
    const authRes = await axios.get(authUrl);
    console.log('Auth Status:', authRes.status);
    console.log('Auth Data:', authRes.data);
    token = authRes.data; // The PDF says "Status: 200 - Will send Token Access key if authentication is successful"
  } catch (e) {
    console.error('Auth Failed:', e.response?.data || e.message);
  }

  if (token) {
    console.log('\n--- Testing Tracking API ---');
    try {
      const trackUrl = 'https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails';
      const trackRes = await axios.post(trackUrl, {
        trkType: 'cnno',
        strcnno: 'V01197967', // sample from PDF
        addtnlDtl: 'Y'
      }, {
        headers: { 'x-access-token': token }
      });
      console.log('Track Status:', trackRes.status);
      console.log('Track Data:', trackRes.data);
    } catch (e) {
      console.error('Track Failed:', e.response?.data || e.message);
    }
  }

  console.log('\n--- Testing Pincode API ---');
  try {
    const pinUrl = 'https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall';
    // Let's try with Bearer token, api-key, and x-access-token just to see what works
    const pinRes = await axios.post(pinUrl, {
      orgPincode: '110046',
      desPincode: '560040'
    }, {
      headers: { 
        'Authorization': `Bearer ${token}`, // trying the tracking token first
        'api-key': API_KEY // just in case
      }
    });
    console.log('Pincode Status:', pinRes.status);
    console.log('Pincode Data:', pinRes.data);
  } catch (e) {
    console.error('Pincode Failed:', e.response?.data || e.message);
  }
}

testDTDC();
