'use strict';

const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:560831323692:pickup.fifo';
const vendorA = 'https://sqs.us-west-2.amazonaws.com/560831323692/acme-widgets';
const vendorB = 'https://sqs.us-west-2.amazonaws.com/560831323692/lolo-prices';


setInterval(() => {
  let vendor;
  let randomStore = Math.ceil(Math.random() * 10);
  if(randomStore % 2) {
    vendor = vendorA;
  } else {
    vendor = vendorB;
  }

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
}, (1000 + ((Math.random() * 10) * 500)));