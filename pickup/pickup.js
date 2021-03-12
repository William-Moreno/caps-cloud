'use strict';

const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:560831323692:pickup.fifo';
const vendor = 'arn:aws:sqs:us-west-2:560831323692:acme-widgets';



setInterval(() => {

  const order = {
    orderId: faker.random.uuid(),
    customer: faker.name.findName(),
    vendorId: vendor,
  };
  
  const params = {
    MessageGroupId: 'test',
    MessageDeduplicationId: faker.random.uuid(),
    TopicArn: topic,
    Message:JSON.stringify(order),
  };
  
  sns.publish(params).promise().then(console.log).catch(console.error);
}, (5000 + ((Math.random() * 10) * 500)));