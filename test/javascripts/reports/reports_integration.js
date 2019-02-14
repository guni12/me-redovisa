/* global describe it */
const kmom01 = require("../../../public/javascripts/kmom01");
const kmom02 = require("../../../public/javascripts/kmom02");
var assert = require("assert");

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');


chai.should();

//const db = require("../../../db/database.js");
var path = require("path");
const db = require(path.resolve(__dirname, '../../../db/database.js'));
console.log(db);

chai.use(chaiHttp);


let token = '';
const cont = '[{"question": "Varför","answer": ["Därför."]}]';

function makeToken(name) {
    token = name;
}

function getToken() {
    return token;
}


function getContent() {
    return '[{"question": "Varför","answer": ["Därför."]}]';
}


function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

describe('Reports before', function() {
    before(function(done) {
        process.env.JWT_SECRET = 'secret';

        db.run("DELETE FROM texts", function(err) {
            if (err) {
                console.log("Could not empty test DB texts", err.message);
            }
            console.log("Inside db delete");
        });

        sql = "CREATE TABLE IF NOT EXISTS users" + 
        "(email VARCHAR(255)" +
        " NOT NULL, password VARCHAR(60) NOT NULL, " +
        "UNIQUE(email));";

        db.run(sql, function(err) {
            console.log("Could not create test DB users", err);
        });


        sql2 = 'INSERT INTO users (email, password)' +
            ' VALUES ("test@example.com", "123test");';
        db.run(sql2, function(err) {
            if (err) {
                console.log("Could not insert test DB users", err);
            }
            console.log("I before - register");
        });

        let user = {
            email: "test@example.com",
            password: "123test",
        };

        this.token = "";

        chai.request(server)
            .post('/login')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                token = res.body.data.token;
                makeToken(token);
                console.log("this.token - i end", getToken());
                done();
            });
    });



    describe('Reports starting', function() {

        describe('GET /reports/kmom01', function() {
            it('201 HAPPY PATH json', function(done) {
                chai.request(server)
                    .get("/reports/kmom01")
                    .end(function(err, res) {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.data.should.be.an("object");
                        res.body.data.questions.should.be.a("string");

                        done();
                    });
            });
        });

        describe('GET /reports/kmom02', function() {
            it('201 HAPPY PATH json', function(done) {
                chai.request(server)
                    .get("/reports/kmom02")
                    .end(function(err, res) {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.data.should.be.an("object");
                        res.body.data.questions.should.be.a("string");

                        done();
                    });
            });
        });

        describe('kmom does not exist', function() {
            it('401', function(done) {
                chai.request(server)
                    .get("/reports/kmom22")
                    .end(function(err, res) {
                        res.should.have.status(401);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.eql(401);

                        done();
                    });
            });
        });


        describe('POST publish new kmom', function() {
            it('1. 401', function(done) {
                let text = {
                    kmom: "",
                    json: getContent(),
                };

                chai.request(server)
                    .post("/reports")
                    .send(text)
                    .end(function(err, res) {
                        res.should.have.status(401);
                        //console.log(res.body);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.eql(401);
                        res.body.errors.title.should.be.eql("No token");

                        done();
                    });
            });


            it('2. 500', function(done) {
                let text = {
                    kmom: "kmom04",
                    json: this.cont,
                };
                let headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-access-token': "wrong-token"};

                chai.request(server)
                    .post("/reports")
                    .set(headers)
                    .send(text)
                    .end(function(err, res) {
                        res.should.have.status(500);
                        //console.log(res.body);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.eql(500);
                        res.body.errors.title.should.be.eql("Failed authentication");

                        done();
                    });
            });



            it('4. 401', function(done) {
                let text = {
                    kmom: "",
                    json: getContent(),
                };
                let headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-access-token': getToken()};

                chai.request(server)
                    .post("/reports")
                    .set(headers)
                    .send(text)
                    .end(function(err, res) {
                        res.should.have.status(401);
                        //console.log(res.body);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.eql(401);
                        res.body.errors.title.should.be.eql("Kmom or json missing");

                        done();
                    });
            });


            it('5. 201 HAPPY PATH json, insert', function(done) {
                let newkmom = "kmom" + makeid();
                let text = {
                    kmom: newkmom,
                    json: getContent(),
                };
                let headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-access-token': getToken()};

                chai.request(server)
                    .post("/reports")
                    .set(headers)
                    .send(text)
                    .end(function(err, res) {
                        res.should.have.status(201);
                        //console.log(res.body);
                        res.body.should.be.an("object");
                        res.body.data.message.should.be.eql(newkmom + " with content: " + getContent());

                        done();
                    });
            });
        });


        it('6. 201 HAPPY PATH json, update', function(done) {
            let kmom2 = "kmom01";
            let text = {
                kmom: kmom2,
                json: getContent(),
            };
            //console.log(text);
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': getToken()};

            chai.request(server)
                .post("/reports/update")
                .set(headers)
                .send(text)
                .end(function(err, res) {
                    res.should.have.status(201);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    var text = "Updated kmom " + kmom2 + " with content: " + getContent();

                    res.body.data.message.should.be.eql(text);

                    done();
                });
        });
    });



    describe("Test kmom01.js files", function() {
        it("questions.question should beVad är din TIL för detta kmom", function() {
            var que = kmom01.questions.find();
            let res = que[3].question;

            assert.equal(res, "Vad är din TIL för detta kmom?");
        });

        it("questions.answer should be 'Det var mycket matnyttigt i detta kursmoment.'", function() {
            let que = kmom01.questions.find();
            let res = que[3].answer[0];

            assert.equal(res, "Det var mycket matnyttigt i detta kursmoment.");
        });
    });


    describe("Test kmom02.js files", function() {
        it("questions.question should be 'Vilket JavaScript-ramverk valde du och varför?'", function() {
            var que = kmom02.questions.find();
            let res = que[0].question;

            assert.equal(res, "Vilket JavaScript-ramverk valde du och varför?");
        });

        it("questions.answer should be 'Jag löste det genom 'watch: $route(to)'.'", function() {
            let que = kmom02.questions.find();
            let res = que[1].answer[4];

            assert.equal(res, "Jag löste det genom 'watch: $route(to)'.");
        });

        after(function() {
            delete process.env.JWT_SECRET;
        });
    });
});
