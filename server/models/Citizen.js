import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},fatherName:String,dob:Date,gender:String,phone:String,email:String,address:String,aadhaar:String,householdId:String,occupation:String,status:{type:String,default:'active'}},{timestamps:true});
export default mongoose.model('Citizen',schema);
