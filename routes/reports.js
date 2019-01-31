var express = require('express');
var router = express.Router();

const reports = require('../public/javascripts/reports.js');
const auth = require('../public/javascripts/login.js');

router.post("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => reports.addReport(res, req.body));

router.post("/update",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => reports.updateReport(res, req.body));

router.get('/:kmom',
    (req, res) => reports.getReport(req, res));


module.exports = router;
