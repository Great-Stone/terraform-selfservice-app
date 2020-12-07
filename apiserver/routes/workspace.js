const fs = require("fs");
const express = require("express");
const request = require("request");
const router = express.Router();

const headers = {
    Authorization: "Bearer " + process.env.TFE_TOKEN,
    "Content-Type": "application/vnd.api+json",
};

const createWorkspace = (req, res, next) => {
    const moduleName = req.body.moduleSelect
    const workspaceName = req.body.workspaceName + "-gs-selfservice"
    let rawdata = fs.readFileSync(__dirname + `/../template/${moduleName}/workspace.json`)
    let jsondata = JSON.parse(rawdata)
    jsondata.data.attributes.name = workspaceName
    console.log(jsondata);

    let options = {
        url: "https://app.terraform.io/api/v2/organizations/gs-selfservice/workspaces",
        method: "POST",
        headers: headers,
        body: JSON.stringify(jsondata),
    };
    
    request(options, function (error, response, body) {
        if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
            const info = JSON.parse(body)
            console.log(info)
            req.workspaceId = info.data.id
            next()
        } else {
            console.log(error)
            res.redirect("/?result=false")
        }
    });
};

const createVariables = (req, res, next) => {
    console.log(req.body)
    console.log(req.workspaceId)
    const moduleName = req.body.moduleSelect
    const workspaceId = req.workspaceId
    const credential = fs.readFileSync(__dirname + `/../credentials.json`, 'utf8');
    const rawdata = fs.readFileSync(__dirname + `/../template/${moduleName}/variables.json`);
    let jsondata = JSON.parse(rawdata);
    jsondata.credentials.data.attributes.value = credential;
    jsondata.prefix.data.attributes.value = req.body.workspaceName
    jsondata.machine_type.data.attributes.value = req.body.computeMachineType
    jsondata.boot_disk.data.attributes.value = req.body.bootDist
    jsondata.sql_machine_type.data.attributes.value = req.body.sqlMachineType
    jsondata.database_version.data.attributes.value = req.body.databaseVersion

    Object.values(jsondata).forEach(val => {
        val.data.relationships.workspace.data.id = workspaceId
        let options = {
            url: "https://app.terraform.io/api/v2/vars",
            method: "POST",
            headers: headers,
            body: JSON.stringify(val),
        };

        request(options, function (error, response, body) {
            if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
                const info = JSON.parse(body)
                console.log(`${info.data.attributes.key} created`)
                next()
            } else {
                console.log(error)
                deleteWorkspace(workspaceId)
                res.redirect("/?result=false")
            }
        });
    });
};

const runWorkspace = (req, res, next) => {
    const workspaceId = req.workspaceId
    let rawdata = fs.readFileSync(__dirname + `/../template/runs.json`)
    let jsondata = JSON.parse(rawdata)
    jsondata.data.relationships.workspace.data.id = workspaceId
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
            req.workspaceId = info.data.id
            next()
        } else {
            console.log(error)
            res.redirect("/?result=false")
        }
    });
};

const infoWorkspace = (req, res, next) => {
    const workspaceId = req.params.id

    let options = {
        url: `https://app.terraform.io/api/v2/workspaces/${workspaceId}`,
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

const deleteWorkspace = (workspaceId) => {
    let options = {
        url: `https://app.terraform.io/api/v2/workspaces/${workspaceId}`,
        method: "DELETE",
        headers: headers
    };

    request(options, function (error, response, body) {
        if (!error && (response.statusCode >= 200 || response.statusCode < 400)) {
        } else {
            console.log(error)
        }
    });
}

router.post( "/create", [createWorkspace, createVariables, runWorkspace], function (req, res, next) {
        console.log("the response will be sent by the next function ...");
        next();
    },
    function (req, res) {
        res.redirect("/?result=true");
    }
);

router.get( "/delete/:id", function (req, res, next) {
    deleteWorkspace(req.params.id)
    res.send('ok')
});

router.get( "/info/:id", [infoWorkspace], function (req, res, next) {
        next();
    },
    function (req, res) {
        res.send(res.body);
    }
);

module.exports = router;
