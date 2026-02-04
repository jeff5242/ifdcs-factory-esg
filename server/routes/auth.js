const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

// Helper to send emails
async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        // User needs to provide SES or SMTP credentials here
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"IFDCS Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken,
            },
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify_email.html?token=${verificationToken}`;
        const emailHtml = `
      <h1>歡迎註冊 IFDCS</h1>
      <p>請點擊下方連結以完成電子郵件驗證：</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;

        // Commented out until user provides credentials
        // await sendEmail(email, '請驗證您的 IFDCS 帳號', emailHtml);

        res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/auth/verify-email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset_password.html?token=${resetToken}`;
        const emailHtml = `
      <h1>找回您的 IFDCS 密碼</h1>
      <p>請點擊下方連結以重設密碼（有效期 1 小時）：</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

        // await sendEmail(email, 'IFDCS 密碼重設請求', emailHtml);

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
