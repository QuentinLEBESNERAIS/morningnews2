var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect("mongodb+srv://admin:test@cluster0.2bkd3.mongodb.net/morninghack?retryWrites=true&w=majority",
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose