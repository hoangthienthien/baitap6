require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return { EC: 2, EM: "Email/Password không hợp lệ" };
            } else {
                const payload = { email: user.email, name: user.name };
                const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                return {
                    EC: 0,
                    access_token,
                    user: { email: user.email, name: user.name }
                };
            }
        } else {
            return { EC: 1, EM: "Email/Password không hợp lệ" };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Lưu tạm mã reset password (trong production nên dùng Redis)
const resetCodes = new Map();

const forgotPasswordService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { EC: 1, EM: "Email không tồn tại trong hệ thống" };
        }
        // Tạo mã xác nhận 6 số
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Lưu mã với thời hạn 5 phút
        resetCodes.set(email, {
            code: code,
            expiry: Date.now() + 5 * 60 * 1000 // 5 phút
        });
        // In mã ra console (trong thực tế sẽ gửi email)
        console.log(`\n========================================`);
        console.log(`📧 MÃ XÁC NHẬN RESET PASSWORD`);
        console.log(`   Email: ${email}`);
        console.log(`   Mã: ${code}`);
        console.log(`   Hết hạn sau 5 phút`);
        console.log(`========================================\n`);
        return { EC: 0, EM: "Đã gửi mã xác nhận đến email" };
    } catch (error) {
        console.log(error);
        return null;
    }
}

const resetPasswordService = async (email, code, newPassword) => {
    try {
        const stored = resetCodes.get(email);
        if (!stored) {
            return { EC: 1, EM: "Chưa yêu cầu reset password hoặc mã đã hết hạn" };
        }
        if (Date.now() > stored.expiry) {
            resetCodes.delete(email);
            return { EC: 2, EM: "Mã xác nhận đã hết hạn" };
        }
        if (stored.code !== code) {
            return { EC: 3, EM: "Mã xác nhận không đúng" };
        }
        // Reset password
        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        await User.updateOne({ email }, { password: hashPassword });
        // Xóa mã đã dùng
        resetCodes.delete(email);
        return { EC: 0, EM: "Đặt lại mật khẩu thành công" };
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { createUserService, loginService, getUserService, forgotPasswordService, resetPasswordService };
