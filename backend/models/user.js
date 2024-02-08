const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  examHistory:{
    type:Object,
    quesArr:{type:Array},
    ansArr:{type:Array},
    incorrectAnsIndex:{type:Array},
    userExamID:{type:String}},
  progress:{
    type:Object,
    marks:{
      type:Number,
      default:0,
    },
    stat:{
      type:Number,
      default:0,
    },
    pure:{
      type:Number,
      default:0,
    },
    nerdpoints:{
      type:Number,
      default:0,
    }
  }
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
