/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_FORMTABLE_ARN
	STORAGE_FORMTABLE_NAME
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const aws = require('aws-sdk')
const docClient = aws.DynamoDB.docClient();

function id() {
  return Math.random.toString(36).substring(2) + Date.now().toString(36);
}

app.post('/contact', function(req, res) {
  console.log(req);
  var params = {
    TableName : progress.env.STORAGE_FORMTABLE_NAME,
    Item: {
      id: id(),
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    } 
  }
  docClient.put(params, function(err, data) {
    if(err) res.json({err})
    else res.json({success:'Contact created successfully!'})
  })
})

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
