var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Redovisning');
});

router.get('/:kmom', function (req, res, next) {
    var addr = '../public/javascripts/' + req.params.kmom + '.js';

    const data = require(addr);
    var questions = data.questions.find();
    res.json(questions);
})

module.exports = router;
