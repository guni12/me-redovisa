/* global describe it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');

chai.should();

const results = [];
//const db = require("../../../db/database.js");
var path = require("path");
const db = require(path.resolve(__dirname, '../../../db/database.js'));

console.log(db);

chai.use(chaiHttp);

function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


describe('Register and login user in before', function() {
    before(done => {
        setTimeout(() => {
            console.log(`First 'before'`);
            db.run("DROP TABLE IF EXISTS users", (err) => {
                if (err) {
                    console.log("Could not DROP test DB users", err.message);
                }
                console.log("In before (drop)- register");
            });
            done(); //Will be called last
        }, 1000)
    });

    before(done => {
        setTimeout(() => {
            console.log(`Second 'before'`);
            const sql = "CREATE TABLE IF NOT EXISTS users" +
                "(email VARCHAR(255)" +
                " NOT NULL, password VARCHAR(60) NOT NULL, " +
                "UNIQUE(email));";

            db.run(sql, (err) => {
                if (err) {
                    console.log("Could not create test DB users", err);
                }
                console.log("In before (create)- register");
            });
            done();
        }, 300)
    });

    before(done => {
        setTimeout(() => {
            console.log(`Third 'before'`);
            sql2 = 'INSERT INTO users (email, password)' +
                ' VALUES ("test@example.com", "123test");';
            db.run(sql2, (err) => {
                if (err) {
                    console.log("Could not insert test DB users", err);
                }
                console.log("In before (insert)- register");
            });
            done();
        }, 100)
    });



    describe('POST /register', () => {
        it('1. should get 401 as we do not provide valid password', (done) => {
            let user = {
                email: "testing@example.com",
                password: "",
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);

                    done();
                });
        });

        it('2. should get 500 unique email constraint', (done) => {
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    var tx = "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email";

                    res.body.errors.detail.should.be.equal(tx);

                    done();
                });
        });


        it('3. should get 201', (done) => {
            let pre = makeid();
            let unique = pre + "@example.com";
            //console.log(unique);
            let user = {
                email: unique,
                password: "123test",
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.be.a("string");

                    done();
                });
        });
    });


    describe('POST /login', () => {
        it('4. should get 401 as we do not provide valid password', (done) => {
            let user = {
                email: "test@example.com",
                //password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    res.body.errors.title.should.be.equal("Email or password missing");

                    done();
                });
        });


        it('5. should get 401 as we do not provide valid email', (done) => {
            let user = {
                //email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    res.body.errors.title.should.be.equal("Email or password missing");

                    done();
                });
        });


        it('6. should get 401 as we provide wrong email', (done) => {
            let user = {
                email: "testing@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    res.body.errors.title.should.be.equal("Wrong password");

                    done();
                });
        });


        it('7. should get 401 as we provide wrong password', (done) => {
            let user = {
                email: "test@example.com",
                password: "1234test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    res.body.errors.title.should.be.equal("Wrong password");

                    done();
                });
        });


        it('8. should get 201 as we do provide correct keys', (done) => {
            process.env.JWT_SECRET = 'secret';
            //console.log("jwt", process.env.JWT_SECRET);
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    //console.log(res.body);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.be.equal("User logged in");
                    done();
                });
        });
        delete process.env.JWT_SECRET;
    });

});
