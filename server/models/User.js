import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true},password:{type:String,required:true},role:{type:String,enum:['admin','citizen'],default:'citizen'},phone:String,address:String},{timestamps:true});
export default mongoose.model('User',schema);
