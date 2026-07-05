import mongoose from 'mongoose'; const schema=new mongoose.Schema({username:String,action:String,details:String},{timestamps:true}); export default mongoose.model('Audit',schema);
