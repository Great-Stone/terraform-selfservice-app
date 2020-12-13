const fs = require("fs")
const express = require("express")
const request = require("request")
const config = require("../config")
const router = express.Router()

const headers = {
    Authorization: "Bearer " + config.terraform.tf_token,
    "Content-Type": "application/vnd.api+json",
};

const currentStateVersion = (req, res, next) => {
    const workspaceId = req.params.id

    let options = {
        url: `https://app.terraform.io/api/v2/workspaces/${workspaceId}/current-state-version?include=outputs`,
        method: "GET",
        headers: headers
    };
    
    request(options, function (error, response, body) {
        if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
            res.body = body
            next()
        } else {
            console.log(error)
            res.redirect("/?result=false")
        }
    });
};

router.get( "/:id", [currentStateVersion], function (req, res, next) {
        next();
    },
    function (req, res) {
        res.send(res.body);
    }
);

module.exports = router;
