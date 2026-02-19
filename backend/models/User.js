const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName:{type:String,required:true },
    lastName:{type:String,required:true },
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true},
    gender:{type:String,enum:["Male","Female"],required:true},
    status:{type:String,enum:["Active","InActive"],default:"Active"},
    profileImage:{type:String },
    location:{type:String,required:true},
  },{timestamps:true},);
module.exports = mongoose.model("User", userSchema);
