const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (function () {
    function login(res, req) {
        const simplepw = req.body.password;
        const email = req.body.email;

        //console.log(req.body);

        if (!email || !simplepw) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }

                const user = rows;

                bcrypt.compare(simplepw, user.password, (err, result) => {
                    if (err) {
                        //console.log("I compare", err);
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/login",
                                title: "bcrypt error",
                                detail: "bcrypt error"
                            }
                        });
                    }


                    if (result) {
                        const payload = { email: user.email };
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                        return res.json({
                            data: {
                                type: "success",
                                message: "User logged in",
                                user: payload,
                                token: token
                            }
                        });
                    } else {
                        return res.status(401).json({
                            errors: {
                                status: 401,
                                source: "/login",
                                title: "Wrong password",
                                detail: "Password is incorrect."
                            }
                        });
                    }
                });
            });
    }




    function checkToken(req, res, next) {
        var token = req.headers['x-access-token'];

        //console.log(req.headers, token);

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.token = decoded.token;
                req.user.email = decoded.email;

                next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }

    return {
        login: login,
        checkToken: checkToken
    };
}());
