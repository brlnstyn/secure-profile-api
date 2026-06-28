const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama wajib diisi'],
            trim: true,
            minLength: [3, 'Nama harus terdiri dari 3-50 karakter'],
            maxLength: [50, 'Nama harus terdiri dari 3-50 karakter'],
        },
        email: {
            type: String,
            required: [true, 'Email wajib diisi'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
        },
        password: {
            type: String,
            required: [true, 'Password wajib diisi'],
            minLength: [8, 'Password minimal 8 karakter'],
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role harus user atau admin',
            },
            default: 'user',
        },
    },
    { timestamps: true, versionKey: false }
);

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

const User = mongoose.model("User", userSchema);
module.exports = User;