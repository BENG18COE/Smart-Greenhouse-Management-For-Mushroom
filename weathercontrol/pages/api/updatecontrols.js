import connectDB from '../../middlewares/mongodb'
import Controls from '../../models/controls'

const handler = (req, res) => {
    const { fan, window, irrigation } = req.query;
    if (fan && window && irrigation) {
        Controls.findByIdAndUpdate("controls", { fan, window, irrigation }).exec()
            .then(data => {
                // Return data fetched
                return res.status(200).send("saved")
            })
            .catch(error => {
                return res.status(500).send(error.message)
            })
    } else {
        return res.status(422).send("incomplete_message");
    }
}
export default connectDB(handler)