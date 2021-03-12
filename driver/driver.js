'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const { Consumer } = require('sqs-consumer');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-2.amazonaws.com/560831323692/packages.fifo';


var params = {
  AttributeNames: [
    'SentTimestamp',
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: queueUrl,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log('Receive Error', err);
  } else if (data.Messages) {
    var deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle,
    };
    let stageOne = JSON.parse(data.Messages[0].Body);
    let stageTwo = JSON.parse(stageOne.Message);
    console.log(stageTwo);
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log('Delete Error', err);
      } else {
        console.log('Message Deleted', data);
      }
    });
  }
});

