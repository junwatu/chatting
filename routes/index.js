var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Awesome Chat' });
});

router.get('/another', function(req, res) {
  res.send('Another route ?');
});/*all uri?*/

module.exports = router;