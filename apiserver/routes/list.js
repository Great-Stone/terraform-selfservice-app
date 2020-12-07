const express = require("express");
const request = require("request");
const router = express.Router();

const headers = {
    Authorization: "Bearer " + process.env.TFE_TOKEN,
    "Content-Type": "application/vnd.api+json",
};

router.get("/", function (req, res) {
    console.log('Workspace list request')
    let options = {
        url: "https://app.terraform.io/api/v2/organizations/gs-selfservice/workspaces",
        method: "GET",
        headers: headers
    };

    request(options, function (error, response, body) {
        if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
            const info = JSON.parse(body);

            result = []
            info.data.forEach(function(element){
              data = {}
              data.id = element.id
              data.name = element.attributes.name
              result.push(data)
            });
            res.json(result);
        } else {
            console.log(error);
            res.redirect("/?result=false");
        }
    });
});

module.exports = router;
