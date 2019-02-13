/* global describe it */
const kmom01 = require("../../../public/javascripts/kmom01");
const kmom02 = require("../../../public/javascripts/kmom02");
var assert = require("assert");

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');


chai.should();

const db = require("../../../db/database.js");

chai.use(chaiHttp);


function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

describe('reports', () => {
    before((done) => {
        process.env.JWT_SECRET = 'secret';

        this.cont = '[{"question": "Varför","answer": ["Därför."]}]';

        db.run("DROP TABLE texts", (err) => {
            if (err) {
                console.log("Could not drop DB texts", err.message);
            }
            console.log("Inside db drop");
        });

        var sql = "CREATE TABLE IF NOT EXISTS texts" +
            "(kmom VARCHAR(60) NOT NULL,json VARCHAR(10000) " +
            "NOT NULL,UNIQUE(kmom))";

        db.run(
            sql,
            (err) => {
                if (err) {
                    console.log("Could not create DB texts", err.message);
                }
                console.log("Inside db create");
            });

        db.run("DELETE FROM texts", (err) => {
            if (err) {
                console.log("Could not empty test DB texts", err.message);
            }
            console.log("Inside db delete");
        });

        let user = {
            email: "test@example.com",
            password: "123test",
        };

        chai.request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                this.token = res.body.data.token;
                done();
            });
    });
    describe('GET /reports/kmom01', () => {
        it('201 HAPPY PATH json', (done) => {
            chai.request(server)
                .get("/reports/kmom01")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.questions.should.be.a("string");

                    done();
                });
        });
    });

    describe('GET /reports/kmom02', () => {
        it('201 HAPPY PATH json', (done) => {
            chai.request(server)
                .get("/reports/kmom02")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.questions.should.be.a("string");

                    done();
                });
        });
    });

    describe('kmom does not exist', () => {
        it('401', (done) => {
            chai.request(server)
                .get("/reports/kmom22")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.eql(401);

                    done();
                });
        });
    });


    describe('POST publish new kmom', (done) => {
        let user = {
            email: "test@example.com",
            password: "123test",
        };

        before((done) => {
            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    this.token = res.body.data.token;
                    done();
                });

            db.run("DELETE FROM users", (err) => {
                if (err) {
                    console.log("Could not empty test DB users", err.message);
                }
            });
        });

        it('1. 401', (done) => {
            let text = {
                kmom: "",
                json: this.cont,
            };

            chai.request(server)
                .post("/reports")
                .send(text)
                .end((err, res) => {
                    res.should.have.status(401);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.eql(401);
                    res.body.errors.title.should.be.eql("No token");

                    done();
                });
        });


        it('2. 500', (done) => {
            let text = {
                kmom: "kmom04",
                json: this.cont,
            };
            let storedtoken = "test";
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': storedtoken};

            chai.request(server)
                .post("/reports")
                .set(headers)
                .send(text)
                .end((err, res) => {
                    res.should.have.status(500);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.eql(500);
                    res.body.errors.title.should.be.eql("Failed authentication");

                    done();
                });
        });



        it('4. 401', (done) => {
            before((done) => {
                chai.request(server)
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        //console.log(res.body);
                        //console.log(res.body.data.token);
                        this.token = res.body.data.token;
                        done();
                    });
            });
            //console.log("token i before 4", this.token);

            let text = {
                kmom: "",
                json: this.cont,
            };
            //console.log("Test 4: ", this.token);
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': this.token};

            chai.request(server)
                .post("/reports")
                .set(headers)
                .send(text)
                .end((err, res) => {
                    res.should.have.status(401);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.eql(401);
                    res.body.errors.title.should.be.eql("Kmom or json missing");

                    done();
                });
        });


        it('5. 201 HAPPY PATH json', (done) => {
            before((done) => {
                chai.request(server)
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        this.token = res.body.data.token;
                        done();
                    });

                db.run("DELETE FROM users", (err) => {
                    if (err) {
                        console.log("Could not empty test DB users", err.message);
                    }
                });
            });

            let kmom = "kmom" + makeid();
            let text = {
                kmom: kmom,
                json: this.cont,
            };
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': this.token};

            chai.request(server)
                .post("/reports")
                .set(headers)
                .send(text)
                .end((err, res) => {
                    res.should.have.status(201);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    res.body.data.message.should.be.eql(kmom + " with content: " + this.cont);

                    done();
                });
        });
        done();
    });


    it('6. 201 HAPPY PATH json', (done) => {
        before((done) => {
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    this.token = res.body.data.token;
                    done();
                });
        });

        let kmom2 = "kmom05";
        let text = {
            kmom: kmom2,
            json: this.cont,
        };
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': this.token};

        chai.request(server)
            .post("/reports/update")
            .set(headers)
            .send(text)
            .end((err, res) => {
                res.should.have.status(201);
                console.log(res.body);
                res.body.should.be.an("object");
                var text = "Updated kmom " + kmom2 + " with content: " + this.cont;

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

    after(() => {
        delete process.env.JWT_SECRET;
    });
});
