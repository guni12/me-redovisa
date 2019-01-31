var express = require('express');
var router = express.Router();
const me = require('../public/javascripts/index.js');

router.get('/', function(req, res, next) {

    var info = me.info.find();
    res.json(info);
});

module.exports = router;
