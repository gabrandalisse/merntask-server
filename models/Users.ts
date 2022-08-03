import { Schema, model } from "mongoose";

const UsersSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  registration: {
    type: Date,
    default: Date.now(),
  },
});

export default model("User", UsersSchema);
