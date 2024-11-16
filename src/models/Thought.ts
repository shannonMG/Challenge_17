// models/Thought.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions: IReaction[];
  reactionCount?: number; // Virtual property
}

interface IReaction {
  reactionId: mongoose.Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

const ReactionSchema: Schema = new Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Getter method to format the timestamp
      get: (timestamp: Date) => timestamp.toISOString(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const ThoughtSchema: Schema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp: Date) => timestamp.toISOString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema], // Array of nested reaction documents
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual property `reactionCount` that retrieves the number of reactions
ThoughtSchema.virtual('reactionCount').get(function (this: IThought) {
  return this.reactions.length;
});

const Thought = mongoose.model<IThought>('Thought', ThoughtSchema);

export default Thought;
