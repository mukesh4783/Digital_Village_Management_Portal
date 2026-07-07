import mongoose from 'mongoose';
const schemeSchema=new mongoose.Schema({
  name:{type:String,required:true},
  description:String,
  eligibility:String,
  benefit:String,
  benefit_amount:Number,
  department:String,
  status:{type:String,default:'active'},
  active:{type:Boolean,default:true}
},{timestamps:true});

const appSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  scheme:{type:mongoose.Schema.Types.ObjectId,ref:'WelfareScheme'},
  scheme_name:String,
  citizen_name:String,
  applicantName:String,
  reason:String,
  remarks:String,
  disbursed_amount:{type:Number,default:0},
  status:{type:String,default:'applied'}
},{timestamps:true});

export const WelfareScheme=mongoose.model('WelfareScheme',schemeSchema);
export const WelfareApplication=mongoose.model('WelfareApplication',appSchema);
