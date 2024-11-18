const express = require('express');
const router = express.Router();
const Interviewer = require('../models/interviewer');
const Interviewee = require('../models/interviewee');
const Recruiter = require('../models/recruiter')
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Signup interviewer
router.post('/signup_interviewer', async (req, res) => {
    const { name, phone_no, email_id, password, organisation, id_photo, dob, isRecruiter,is_admin} = req.body;

    try {
        let newUser;
        if(is_admin){
            newUser = await Admin.create({
                name,
                phone_no,
                email_id,
                password,
                organisation,
                id_photo,
                dob,
            });
        }

        else if (isRecruiter) {
            // Create Recruiter
            newUser = await Recruiter.create({
                name,
                phone_no,
                email_id,
                password,
                organisation,
                id_photo,
                dob,
                isRecruiter
            });
        } else {
            // Create Interviewer
            const is_interviewer = true;
            newUser = await Interviewer.create({
                name,
                phone_no,
                email_id,
                password,
                organisation,
                id_photo,
                is_interviewer,
                dob,
                isRecruiter: false // Explicitly set isRecruiter to false for Interviewer
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: `${isRecruiter ? 'Recruiter' : 'Interviewer'} created successfully`,
            user: newUser,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

// Signup interviewee
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'authenticheckv2@gmail.com', // Your email
        pass: 'qbni kcdx izyv wemq' // Your app-specific password
    }
});

router.post('/signup_interviewee', async (req, res) => {
    const { name, phone_no, email_id, password, id_photo, face_id, voice_id, dob } = req.body;
    const is_interviewee = true;

    try {
        // Create a new interviewee in the database
        const newInterviewee = await Interviewee.create({
            name,
            phone_no,
            email_id,
            password,
            id_photo,
            face_id,
            voice_id,
            is_interviewee,
            dob
        });

        // Generate JWT token
        const token = jwt.sign(
            { intervieweeId: newInterviewee.interviewee_id, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const mailOptions = {
            from: 'authenticheckv2@gmail.com', // Sender email
            to: email_id, // Recipient email
            subject: 'Welcome to Authenticheck! Your Account Details',
            html: `
                <h1>Welcome, ${name}!</h1>
                <p>Thank you for signing up as an interviewee on Authenticheck.</p>
                <p>Your account has been successfully created. Below are your login details:</p>
                <ul>
                    <li><strong>Email:</strong> ${email_id}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please keep this information secure and do not share it with anyone.</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br />
                <p>Best regards,</p>
                <p>The Authenticheck Team</p>
            `
        };

        // Send email using Nodemailer
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({
                    message: 'Error sending email to interviewee',
                    error: err.message
                });
            }
            console.log('Email sent:', info.response);

            // Respond with success
            res.status(201).json({
                message: 'Interviewee created successfully. Email sent.',
                interviewee: newInterviewee,
                token: token
            });
        });
    } catch (error) {
        console.error('Error creating interviewee:', error.message);
        res.status(500).json({
            message: 'Error creating interviewee',
            error: error.message
        });
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email_id, password } = req.body;

    try {
        // Check if the user is an interviewer
        const interviewer = await Interviewer.findOne({ where: { email_id: email_id, password: password } });
        if (interviewer) {
            // Generate JWT token for interviewer
            const token = jwt.sign(
                { interviewerId: interviewer.interviewer_id, isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ token: token, interviewer });
        }

        // Check if the user is an interviewee
        const interviewee = await Interviewee.findOne({ where: { email_id: email_id, password: password } });
        if (interviewee) {
            // Generate JWT token for interviewee
            const token = jwt.sign(
                { intervieweeId: interviewee.interviewee_id, isAdmin: false },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ token: token, interviewee });
        }
        const recruiter = await Recruiter.findOne({ where: { email_id, password } });
        if (recruiter) {
            // Generate JWT token for recruiter
            const token = jwt.sign(
                { userId: recruiter.recruiter_id, isAdmin: true, isRecruiter: true },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ token, recruiter });
        }
        const admin = await Admin.findOne({ where: { email_id: email_id, password: password } });
        if (admin) {
            // Generate JWT token for interviewer
            const token = jwt.sign(
                { interviewerId: admin.admin_id, isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ token: token, admin });
        }

        // If neither interviewer nor interviewee found
        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
