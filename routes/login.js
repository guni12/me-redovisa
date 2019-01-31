var express = require('express');
var router = express.Router();

const login = require('../public/javascripts/login.js');

router.post("/",
    (req, res) => login.login(res, req));

module.exports = router;
