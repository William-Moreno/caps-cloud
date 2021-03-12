'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const { Consumer } = require('sqs-consumer');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const sns = new AWS.SNS();

const queueUrl = 'https://sqs.us-west-2.amazonaws.com/560831323692/packages.fifo';


const params = {
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

setInterval(() => {
  let stageOne;
  let orderInfo;

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      let deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };
      stageOne = JSON.parse(data.Messages[0].Body);
      orderInfo = JSON.parse(stageOne.Message);
      console.log(orderInfo);
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log('Delete Error', err);
        } else {
          console.log('Message Deleted', data);
        }
        const order = {
          orderId: orderInfo.orderId,
          customer: orderInfo.customer,
          status: 'delivered',
        };
        
        const sendParams = {
          QueueUrl: orderInfo.vendorId,
          MessageBody:JSON.stringify(order),
        };
        
        sqs.sendMessage(sendParams, function(err, data) {
          if (err) {
            console.log('Error', err);
          } else {
            console.log('Success', data.MessageId);
          }
        });
      });
    }
  });

  
}, (2500 + (Math.random() * 5) * 500));

