import axios from 'axios'
import mongodb from 'mongodb'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import chalk from 'chalk'
import { config } from './config/index.mjs'

const app = express()

const mongoClient = new mongodb.MongoClient(config.mongoUrl)
const connectMongo = async () => {
    console.log('Connecting to MongoDB...'); // Add this line
    try {
      await mongoClient.connect();
      console.log('Connected to MongoDB successfully!'); // Add this line
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };
connectMongo()

const db = mongoClient.db('webware')
const userCollection = db.collection('users')
const marginCollection = db.collection('margins')

let users = []
let margins = []
let ip = ''

const fetchItems = async () => {
    users = await userCollection.find({}).toArray();
    margins = await marginCollection.find({}).toArray();
}
fetchItems()
setInterval(fetchItems, 5000)

async function getPublicIP() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
    ip = response.data.ip;
    } catch (error) {
      console.error('Error retrieving public IP:', error.message);
    }
  }
getPublicIP()
app.use(cors())
app.use(express.json())

app.get('/api/margins', (req,res) => {
    if (`${req.ip}` !== `${ip}`) {

    }
    return res.json({data: margins, code: 200})
})
app.get('/api/users/verify/:token', (req, res) => {
    let decodedUser;
    let isUserFound = false;
    try {
        decodedUser = jwt.verify(req.params.token, config.jwtKey)
    } catch (e) {
        return res.json({msg: e.message || e, code: 0})
    }
    for (const user of users) {
        if(decodedUser.username === user.username && decodedUser.password === user.password) {
            isUserFound = true;
            break;
        }
    }
    if(isUserFound) {
        return res.json({msg: 'User Found', username:decodedUser.username,code: 200})
    } else {
        return res.json({msg:'User not found!', code: 0})
    }
})
app.post('/api/users', (req, res) => {
    const payload = req.body;
    let userFound;
    let isPayloadFound = false
    console.log(payload, users)
    for (const user of users) {
        if (payload.username === user.username && payload.password === user.password) {
            isPayloadFound = true
            userFound = user
          break;
        } else {
            isPayloadFound = false
        }
      }
    if(isPayloadFound) {
        return res.json({msg: 'User Found',username:payload.username, token: jwt.sign(userFound, config.jwtKey), code: 200})
    } else {
        return res.json({msg:'User not found!', token: 'null', code: 0})
    }
});
app.post('/api/margins/set', async (req,res) => {
    const payload = req.body
    console.log(payload)
    let decodedUser;
    try {
        decodedUser = jwt.verify(payload.token, config.jwtKey)
    } catch (e) {
        return res.json({msg: e.message || e, code: 0})
    }
    let isUserFound = false
    if(!decodedUser) {
        return res.json({msg: 'Invalid Token!', code: 0})
    }
    for (const user of users) {
        if(decodedUser.username === user.username && decodedUser.password === user.password) {
            isUserFound = true
            break;
        } else {
            isUserFound = false
        }
    }
    if(isUserFound) {
        let isMarginFound = false
        for (const margin of margins) {
            if(margin.id === payload.id) {
                isMarginFound = true;
                break;
            } else isMarginFound = false
        }
        if(isMarginFound) {
            if(isNaN(payload.value)) {
                return res.json({msg: 'Value must be a number!', code: 0})
            } else {
                await marginCollection.updateOne(
                    {
                        id: payload.id
                    },
                    {
                        $set: {
                            value: payload.value
                        }
                    }
                )
                return res.json({msg: 'Successfully Edited Value', code: 200})
            }
        } else return res.json({msg: 'Margin ID Not Found. Check margins @ https://api.muscatbullion.com:5001/api/margins', code: 0})
    } else return res.json({msg: 'User Credentials/Token Invalid', code: 0})
})
app.listen(config.port, () => {
    console.log('App listening on ' + config.port)
})