import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    name: string;
    price: string;
    unit: string;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered" | "cancelled";

  // NEW FIELDS for OTP delivery
  deliveryOtp?: string;
  deliveryOtpVerified?: boolean;
  deliveredAt?: Date;

  assignment: Types.ObjectId | null;
  assignedDeliveryBoy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Grocery", required: true },
        name: String,
        price: String,
        unit: String,
        quantity: Number,
        image: String,
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    address: {
      fullName: String,
      phone: String,
      fullAddress: String,
      city: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
    },

    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered", "cancelled"],
      default: "pending",
    },

    /** ---------------------- OTP Fields ---------------------- */
    deliveryOtp: {
      type: String,
      default: null,
    },

    deliveryOtpVerified: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    /** ---------------------- Assignment ---------------------- */
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },

    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
