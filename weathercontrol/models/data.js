/* eslint-disable indent */
import mongoose from 'mongoose'
var Schema = mongoose.Schema

var data = new Schema({
  temperature: {
    type: String,
    required: true
  },
  humidity: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  moisture: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
})

mongoose.models = {}

var Data = mongoose.model('Data', data)

export default Data
