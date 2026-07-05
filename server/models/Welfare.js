import mongoose from 'mongoose';
const schemeSchema=new mongoose.Schema({name:{type:String,required:true},description:String,eligibility:String,benefit:String,active:{type:Boolean,default:true}},{timestamps:true});
const appSchema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},scheme:{type:mongoose.Schema.Types.ObjectId,ref:'WelfareScheme'},applicantName:String,status:{type:String,default:'pending'}},{timestamps:true});
export const WelfareScheme=mongoose.model('WelfareScheme',schemeSchema); export const WelfareApplication=mongoose.model('WelfareApplication',appSchema);
