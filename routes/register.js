var express = require('express');
var router = express.Router();

const register = require('../public/javascripts/register.js');

router.post("/",
    //(req, res) => register.hashbcrypt(req, res));
    (req, res) => register.hashbcryptjs(req, res));

module.exports = router;
