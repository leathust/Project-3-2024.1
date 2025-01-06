import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true, // Email phải là duy nhất
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: {
        type: String,
        default: "/avatar/default-avatar.jpg",
    },
    uploads: [
        {
            fileName: { type: String, required: true }, // Tên file
            filePath: { type: String, required: true }, // Đường dẫn file
            uploadedAt: { type: Date, default: Date.now }, // Thời gian upload
        },
    ],
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    // Chỉ mã hóa mật khẩu nếu nó được thay đổi
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Phương thức kiểm tra mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
