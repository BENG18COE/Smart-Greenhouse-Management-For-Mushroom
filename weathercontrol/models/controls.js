/* eslint-disable indent */
import mongoose from 'mongoose'
var Schema = mongoose.Schema

var controls = new Schema({
    _id: String,
    irrigation: {
        type: Number,
        default: 1
    },
    window: {
        type: Number,
        default: 1
    },
    fan: {
        type: Number,
        default: 1
    }
})

mongoose.models = {}

var Controls = mongoose.model('Controls', controls)

export default Controls
