const fs = require("fs");
const express = require("express");
const request = require("request");
const router = express.Router();

const headers = {
    Authorization: "Bearer " + process.env.TFE_TOKEN,
    "Content-Type": "application/vnd.api+json",
};

const destroyRun = (req, res, next) => {
    const workspaceId = req.body.id
    let rawdata = fs.readFileSync(__dirname + `/../template/runs.json`)
    let jsondata = JSON.parse(rawdata)
    jsondata.data.relationships.workspace.data.id = workspaceId
    jsondata.data.attributes["is-destroy"] = true
    jsondata.data.attributes.message = 'API destroy'
    console.log(jsondata);

    let options = {
        url: "https://app.terraform.io/api/v2/runs",
        method: "POST",
        headers: headers,
        body: JSON.stringify(jsondata),
    };
    
    request(options, function (error, response, body) {
        if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
            const info = JSON.parse(body)
            console.log(info)
            req.workspaceId = info.data.relationships.workspace.id
            next();
        } else {
            console.log(error)
            res.redirect("/?result=false")
        }
    });
};

router.post( "/destroy", [destroyRun], function (req, res, next) {
        console.log("the response will be sent by the next function ...");
        next();
    },
    function (req, res) {
        res.redirect("/?result=true");
    }
);

module.exports = router;
