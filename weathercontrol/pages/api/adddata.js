import connectDB from '../../middlewares/mongodb';
import Data from '../../models/data';

const handler = (req, res) => {
  // Get data from the circuit
  const { temperature, humidity } = req.query;
  if (temperature && humidity) {
    var data = new Data({
      temperature,
      humidity
    });
    // Save the data to database
    data.save()
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(error => {
        return res.status(500).send(error.message);
      });
  } else {
    res.status(422).send('Data_Incomplete');
  }
};
export default connectDB(handler);
