// routes/score.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/score/:scoreId', async (req, res) => {
  try {
    const { scoreId } = req.params;
    const response = await axios.get(`https://api.trovetown.co/v1/apiCalls/scoreData?scoreId=${scoreId}`);
    res.json(response.data);
  } catch (err) {
    console.error('Backend proxy error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Backend error fetching score data',
      error: err.message,
    });
  }
});

module.exports = router;
