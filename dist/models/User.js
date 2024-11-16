import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    thoughts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thought',
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Self-reference
        },
    ],
}, {
    toJSON: {
        virtuals: true, // Include virtuals when document is converted to JSON
    },
    id: false, // Disable the default 'id' virtual getter
});
// Create a virtual property `friendCount` that gets the number of friends
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});
const User = mongoose.model('User', UserSchema);
export default User;
