const express = require('express');
const router = express.Router();
const Interviewer = require('../models/interviewer');
const Interviewee = require('../models/interviewee');
const jwt = require('jsonwebtoken');

// Signup interviewer
router.post('/signup_interviewer', async (req, res) => {
    const { name, phone_no, email_id, password, organisation, id_photo, dob } = req.body;

    try {
        const newInterviewer = await Interviewer.create({
            name,
            phone_no,
            email_id,
            password,
            organisation,
            id_photo,
            dob
        });

        // Generate JWT token
        const token = jwt.sign(
            { interviewerId: newInterviewer.interviewer_id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Interviewer created successfully',
            interviewer: newInterviewer,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating interviewer',
            error: error.message
        });
    }
});

// Signup interviewee
router.post('/signup_interviewee', async (req, res) => {
    const { name, phone_no, email_id, password, id_photo, face_id, voice_id, dob } = req.body;

    try {
        const newInterviewee = await Interviewee.create({
            name,
            phone_no,
            email_id,
            password,
            id_photo,
            face_id,
            voice_id,
            dob
        });

        // Generate JWT token
        const token = jwt.sign(
            { intervieweeId: newInterviewee.interviewee_id, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Interviewee created successfully',
            interviewee: newInterviewee,
            token: token
        });
    } catch (error) {
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
            return res.status(200).json({ token: token });
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
            return res.status(200).json({ token: token });
        }

        // If neither interviewer nor interviewee found
        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
