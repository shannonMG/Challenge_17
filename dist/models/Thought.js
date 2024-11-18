// models/Thought.ts
import mongoose, { Schema } from 'mongoose';
const ReactionSchema = new Schema({
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
        get: (timestamp) => timestamp.toISOString(),
    },
}, {
    toJSON: {
        getters: true,
    },
    id: false,
});
const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => timestamp.toISOString(),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [ReactionSchema], // Array of nested reaction documents
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
// Virtual property `reactionCount` that retrieves the number of reactions
ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});
const Thought = mongoose.model('Thought', ThoughtSchema);
export default Thought;
