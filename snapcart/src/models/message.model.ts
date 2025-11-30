import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
    time: { type: Date, default: Date.now }  // 🔥 FIX: No error even if not sent
  },
  { timestamps: true }
);


export default mongoose.models.Message || mongoose.model("Message", messageSchema);
