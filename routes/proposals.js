const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('All proposals');
});

router.get('/:id', function(req, res) {
    res.send(`Proposal #${req.params.id}`);
});

module.exports = router;
