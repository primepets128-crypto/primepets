const adminAuth = {
  verifyIdToken: jest.fn().mockImplementation((token) => {
    if (token === 'valid_token') {
      return Promise.resolve({
        uid: 'test_firebase_uid',
        email: 'admin@primepets.com',
        name: 'Admin User'
      });
    }
    return Promise.reject(new Error('Invalid token'));
  })
};

module.exports = adminAuth;
