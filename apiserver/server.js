const express = require('express')
const config = require('./config')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const workspaceRouter = require('./routes/workspace');
const listRouter = require('./routes/list');
const runRouter = require('./routes/runs');
const outputRouter = require('./routes/output');

app.use('/workspace', workspaceRouter);
app.use('/list', listRouter);
app.use('/runs', runRouter);
app.use('/output', outputRouter);

app.get('/getorg', (req, res) => {
    res.send(config.workspace.organization)
})

app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/public/index.js')
})

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/favicon.ico')
})

app.get('', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(3000, () => {
    console.log('Terraform Self-Service Test - port 3000')
})