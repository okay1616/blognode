const { default: mongoose } = require('mongoose')
const url = "mongodb+srv://hemanshu1602:Gy5hIFtJ6RzK1lXm@cluster0.rpdsnpb.mongodb.net/?retryWrites=true&w=majority";
const connectToMongoose = async () => {
    mongoose.connect(url, {})
        .then(() => console.log(`Server Connected To Mongodb`))
        .catch((error) => console.log(`${error} did not connect`));
}
module.exports = connectToMongoose
