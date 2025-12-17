import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

const User = mongoose.model('User', userSchema);
// En tus modelos, añade índices
userSchema.index({ email: 1 }, { unique: true });
export default User;

