import { Schema, model } from "mongoose";

const TaskSchema = new Schema<ITask>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
});

export default model("Task", TaskSchema);
