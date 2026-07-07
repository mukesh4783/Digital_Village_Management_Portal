import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  cert_type:{type:String,required:true},
  type:String,
  applicantName:String,
  citizen_name:String,
  purpose:String,
  status:{type:String,default:'requested'},
  certificateNumber:String,
  issue_date:Date,
  admin_notes:String,
  additional_data:{type:mongoose.Schema.Types.Mixed,default:{}},
  status_history:[{status:String,note:String,changed_by:String,changed_at:{type:Date,default:Date.now}}]
},{timestamps:true});
export default mongoose.model('Certificate',schema);
