## Instructions to student.

This repository contains the starting code for a lab-based exam on the Distributed Systems module concerning IaC on the AWS platform. 

### Setup

You are required to take the following steps in preparation for this exam:

+ Clone this repository.
+ Import the project into VS Code and run the following commands:
~~~bash
$ npm install
$ npm run schema
~~~
+ Create a new repository in your GitHub account called 'edaExam'.
+ In VS Code, type the following commands:
~~~bash
$ git remote remove origin
$ git remote add origin ...URL of your new repository...
$ git push origin master
~~~

### The App.

Deploy the app to your AWS account (cdk deploy).

The app is very similar to one of the demo apps discussed in the lectures that illustrated the SQS service. The architecture has been slightly changed. A lambda function generates test data (Orders) and publishes them to an SNS topic. The topic has an SQS subscriber, which, in turn, has a lambda consumer. 

Examine all aspects of the stack and the lambda functions. __Do not change the code.__

When you have fully understood the app, you may destroy the stack. However, redeploy the app again the day before the exam and leave it deployed. 
