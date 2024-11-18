import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    thoughts: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
    friendCount?: number; // This is a virtual property
  }
  
  const UserSchema: Schema = new Schema(
    {
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
          ref: 'User', 
        },
      ],
    },
    {
      toJSON: {
        virtuals: true, // Include virtuals when document is converted to JSON
      },
      id: false, // Disable the default 'id' virtual getter
    }
  );
  
  // Create a virtual property `friendCount` that gets the number of friends
  UserSchema.virtual('friendCount').get(function (this: IUser) {
    return this.friends.length;
  });
  
  const User = mongoose.model<IUser>('User', UserSchema);
  
  export default User;