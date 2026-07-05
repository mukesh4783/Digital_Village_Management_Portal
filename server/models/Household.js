import mongoose from 'mongoose';
const schema=new mongoose.Schema({houseNumber:{type:String,required:true},headName:{type:String,required:true},address:String,members:{type:Number,default:1},category:String,annualIncome:Number},{timestamps:true}); export default mongoose.model('Household',schema);
