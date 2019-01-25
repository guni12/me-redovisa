var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });

    var addr = '../public/javascripts/index.js';

    const file = require(addr);
    var info = file.info.find();
    res.json(info);
});

module.exports = router;
