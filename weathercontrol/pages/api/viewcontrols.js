import connectDB from '../../middlewares/mongodb'
import Controls from '../../models/controls'

const handler = (req, res) => {
    // Get date from browser
    // Fetch data from database
    Controls.findById("controls").exec()
        .then(data => {
            // Return data fetched
            return res.status(200).send(data)
        })
        .catch(error => {
            return res.status(500).send(error.message)
        })
}
export default connectDB(handler)