const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 5000
const sourceServerUrl = 'http://localhost:5002/api/prices?key=0921MND2'
const fetchInterval = 5000
import cors from 'cors'

let lastRecordedData = null

const fetchData = async () => {
  try {
    const response = await axios.get(sourceServerUrl)
    lastRecordedData = response.data
    console.log('Data fetched successfully:', lastRecordedData)
  } catch (error) {
    console.error('Error fetching data from the source server:', error.message)
  }
}

setInterval(() => {
  fetchData()
  forwardData
}, fetchInterval)

app.use(cors())

app.get('/api/prices', (req, res) => {
    return res.json(lastRecordedData)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
