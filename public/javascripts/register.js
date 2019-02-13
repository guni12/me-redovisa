const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');
const saltRounds = 10;

module.exports = (function () {
    function hashbcrypt(req, res) {
        const bcrypt = require('bcrypt');
        const simplepw = req.body.password;
        const email = req.body.email;

        if (!email || !simplepw) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(simplepw, saltRounds, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            db.run("INSERT INTO users (email, password) VALUES (?, ?)",
                email,
                hash, (err) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/register",
                                title: "Database error",
                                detail: err.message
                            }
                        });
                    }

                    res.status(201).json({
                        data: {
                            message: "User " + email + " successfully registered with: ." + hash
                        }
                    });
                });
        });
    }


    return {
        hashbcrypt: hashbcrypt,
    };
}());

