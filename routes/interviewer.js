const express = require('express');
const router = express.Router();
const Interviewer = require('../models/interviewer');
const Meeting = require('../models/meeting');
const Interviewee = require('../models/interviewee');
const { verifyToken, isAdmin } = require('../utils/middleware');

// Get interviewer details by ID from token
router.get('/details', verifyToken, isAdmin, async (req, res) => {
    try {
        const interviewer = await Interviewer.findByPk(req.user.interviewerId);
        if (!interviewer) {
            return res.status(404).json({ message: 'Interviewer not found' });
        }
        res.status(200).json(interviewer);
    } catch (error) {
        console.error('Error fetching interviewer details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Create a new meeting
router.post('/create_meetings', verifyToken, isAdmin, async (req, res) => {
    const { interviewee_id, date, time, role } = req.body;

    try {
        // Check if interviewee_id is provided
        if (!interviewee_id) {
            return res.status(400).json({ message: 'Interviewee ID is missing' });
        }

        // Extract interviewer_id from token
        const interviewer_id = req.user.interviewerId;

        // Check if interviewee_id exists
        const interviewee = await Interviewee.findByPk(interviewee_id);
        if (!interviewee) {
            return res.status(404).json({ message: 'Interviewee not found' });
        }

        // Create the meeting
        const newMeeting = await Meeting.create({
            interviewer_id,
            interviewee_id,
            date,
            time,
            role
        });

        res.status(201).json({
            message: 'Meeting created successfully',
            meeting: newMeeting
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/meetings', verifyToken, isAdmin, async (req, res) => {
    try {
        // Extract interviewer_id from token
        const interviewer_id = req.user.interviewerId;

        // Query meetings associated with the interviewer_id
        const meetings = await Meeting.findAll({ where: { interviewer_id } });

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
