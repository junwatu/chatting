var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/another', function(req, res) {
  res.send('Another route ?');
});/*all uri?*/

module.exports = router;
