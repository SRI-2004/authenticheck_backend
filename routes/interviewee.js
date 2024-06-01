const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const Interviewee = require('../models/interviewee');
const { verifyToken } = require('../utils/middleware');

// Get details associated with the interviewee ID from token
router.get('/details', verifyToken, async (req, res) => {
    try {
        // Extract interviewee_id from token
        const interviewee_id = req.user.intervieweeId;

        // Query details associated with the interviewee_id
        const interviewee = await Interviewee.findByPk(interviewee_id);
        if (!interviewee) {
            return res.status(404).json({ message: 'Interviewee not found' });
        }

        res.status(200).json(interviewee);
    } catch (error) {
        console.error('Error fetching interviewee details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all meetings associated with the current interviewee ID
router.get('/meetings', verifyToken, async (req, res) => {
    try {
        // Extract interviewee_id from token
        const interviewee_id = req.user.intervieweeId;

        // Query meetings associated with the interviewee_id
        const meetings = await Meeting.findAll({ where: { interviewee_id } });

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
