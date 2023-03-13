const express = require("express");
var AWS = require('aws-sdk');
const app = express();

const checkIfTopicExists = require('./checkIfTopicExists');
const createTopic = require('./createTopic.js')
app.use(express.json())

// add accesskeyid, secret key in aws in ur system(aws credential)
const creds = new AWS.SharedIniFileCredentials({ profile: "default" })

AWS.config.update({ region: "ap-south-1" });

//start of sns service
var sns = new AWS.SNS({ creds, region: "ap-south-1" });



// create topic &receive TopicArn 
app.get("/createTopic", async (req, res) => {
    const ifTopicExists = await checkIfTopicExists(AWS, req.body.topicName)
    if (!ifTopicExists) {
        let topicARN = await createTopic(AWS, req.body.topicName)
        res.send(topicARN)
    } else {
        res.json({"messgae" : "topic already exists", "data" : ifTopicExists})
    }
})

// api call for sns
app.get('/status', (req, res) => {
    res.send({ status: "ok", value: sns })
})


// subscribe with IAM values and check mail to subscribe or you can do it in Dashboard page
app.post('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: 'arn:aws:sns:ap-south-1:281856750054:VEERU_CREATED',
        Endpoint: req.body.email
    }
    sns.subscribe(params, (err, data) => {
        if (err) res.send(err);
        else {
            res.send(data)
        }

    })
})


//publish meessages

app.post('/publish', (req, res) => {

    let params = {
        Subject: req.body.subject,
        Message: req.body.message,
        TopicArn: 'arn:aws:sns:ap-south-1:281856750054:VEERU_CREATED',
    }
    sns.publish(params, (err, data) => {
        if (err) res.send(err);
        else {
            res.send(data)
        }

    })
})
app.listen(3000, () => {
    console.log(`port connected to 3000`)
})

module.exports = app;