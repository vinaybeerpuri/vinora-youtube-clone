const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://vinay:mongodb799@cluster0.wflvege.mongodb.net/vinora?retryWrites=true&w=majority"
)
    .then(() => {
        console.log("Connected Successfully");
        process.exit();
    })
    .catch(err => {
        console.log(err);
    });