import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  title:{type:String,required:true},
  category:{type:String,required:true},
  description:String,
  priority:{type:String,default:'medium'},
  location:String,
  status:{type:String,default:'submitted'},
  assigned_to:String,
  admin_notes:String,
  comments:[{text:String,by:String,at:{type:Date,default:Date.now}}],
  status_history:[{status:String,note:String,changed_by:String,changed_at:{type:Date,default:Date.now}}]
},{timestamps:true});
export default mongoose.model('ServiceRequest',schema);
