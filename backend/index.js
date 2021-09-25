const serverless = require('serverless-http');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-1' })
app.use(bodyParser.json({ strict: false }))

const getTableName = (query) => {
  switch(query['info']) {
    case 'TOURIST_FACILITIES':
      return 'TOURIST_FACILITIES'
      break;
    case 'SHELTER':
      return 'shelters'
      break;
    default:
      return 'shelters'
  }
}

app.get('/', function (req, res) {
  const params = {
    TableName: getTableName(req.query)
  }
  if (!req.query) {
    res.send('Hello World!')
  } else {
    dynamoDb.scan(params, (error, result) => {
      if(error) {
        console.log(error)
        res.status(400).json({ error: 'Cloud not get datas'})
      }
      if (result.Items) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
        res.json(result.Items)
      }
    })
  }
})

module.exports.handler = serverless(app);
