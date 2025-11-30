import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId ;
  name: string;
  role: "admin" | "user" | "deliveryBoy";
  image?: string;
  email: string;
  mobile?: string;
  myOrders?: mongoose.Types.ObjectId[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  socketId?:string
  isOnline:Boolean
  location?: {
    type: {
        type: string;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
}
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      
    },
    role: {
      type: String,
      enum: ["admin", "user", "deliveryBoy"],
      default:"user",
      required: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    myOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    location:{
type:{type:String,enum:['Point'],default:'Point'},
coordinates:{type:[Number],default:[0,0]}
   },
   socketId:{
     type:String,
     
    },
    isOnline:{
        type:Boolean,
        default:false
    },
  
}, { timestamps: true })

userSchema.index({location:'2dsphere'})
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
