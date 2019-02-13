const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');

module.exports = (function () {
    function addReport(res, body) {
        const kmom = body.kmom;
        const json = body.json;

        //console.log("I reports.js", body);

        if (!kmom || !json) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/reports",
                    title: "Kmom or json missing",
                    detail: "Kmom or json missing in request"
                }
            });
        }

        db.run("INSERT INTO texts (kmom, json) VALUES (?, ?)",
            kmom,
            json, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/reports",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                res.status(201).json({
                    data: {
                        message: kmom + " with content: " + json
                    }
                });
            });
    }


    function getReport(req, res) {
        var kmom = req.params.kmom;

        //console.log(kmom);

        db.get("SELECT * FROM texts WHERE kmom = ?",
            kmom,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/reports/" + kmom,
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/reports/" + kmom,
                            title: kmom + " not found",
                            detail: "Text with provided kmom not found."
                        }
                    });
                }

                const texts = rows;


                res.status(201).json({
                    data: {
                        questions: texts.json
                    }
                });
            });
    }


    function updateReport(res, body) {
        let kmom = body.kmom;
        let text = body.json;

        console.log(kmom);
        console.log("I reports.js", body);

        if (!kmom || !text) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/update",
                    title: "Kmom or json missing",
                    detail: "Kmom or json missing in request"
                }
            });
        }

        db.get("UPDATE texts SET json = ? WHERE kmom = ?",
            text,
            kmom,
            (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/reports/update",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                res.status(201).json({
                    data: {
                        message: "Updated kmom " + kmom + " with content: " + text
                    }
                });
            });
    }


    return {
        addReport: addReport,
        getReport: getReport,
        updateReport: updateReport,
    };
}());
