const { default: mongoose } = require('mongoose')
const url = "mongodb://localhost:27017/First";
const connectToMongoose = () => {
    mongoose.connect(url, { })
        .then(() => console.log(`Server Connected To Mongodb`))
        .catch((error) => console.log(`${error} did not connect`));
}
module.exports = connectToMongoose
