try {
  const app = require('../server/index.js');
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({ error: "Failed to load server/index.js", message: error.message, stack: error.stack });
  };
}
