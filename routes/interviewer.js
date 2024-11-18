const express = require('express');
const router = express.Router();
const axios = require('axios');
const Interviewer = require('../models/interviewer');
const Meeting = require('../models/meeting');
const Interviewee = require('../models/interviewee');
const { verifyToken, isAdmin } = require('../utils/middleware');
const nodemailer = require('nodemailer');

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




router.post('/create_meetings', verifyToken, isAdmin, async (req, res) => {
    const { date, time, role, recruiter_mail, interviewee_mail, meet_link } = req.body;

    try {
        // Check if interviewee_mail is provided
        if (!interviewee_mail) {
            return res.status(400).json({ message: 'Interviewee email is missing' });
        }

        // Extract interviewer_id from token
        const interviewer_id = req.user.interviewerId;

        // Find interviewer details
        const interviewer = await Interviewer.findOne({ where: { interviewer_id } });
        if (!interviewer) {
            return res.status(404).json({ message: 'Interviewer not found' });
        }

        // Check if interviewee with the provided email_id exists
        const interviewee = await Interviewee.findOne({ where: { email_id: interviewee_mail } });
        if (!interviewee) {
            return res.status(404).json({ message: 'Interviewee not found' });
        }
        const website = 'https://authenticheckv3.netlify.app/';
        // Create the meeting
        const newMeeting = await Meeting.create({
            interviewer_id,
            interviewee_id: interviewee.interviewee_id,
            interviewer_mail: interviewer.email_id,
            interviewee_mail,
            recruiter_mail,
            meet_link,
            date,
            time,
            role
        });

        // Set up Nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can change this to another email service if needed
            auth: {
                user: 'authenticheckv2@gmail.com', // Your email
                pass: 'qbni kcdx izyv wemq'   // Your email password or an app-specific password
            }
        });

        // Email content for interviewee (without meeting link)
        const intervieweeMailOptions = {
            from: 'authenticheckv2@gmail.com', // Sender's email
            to: interviewee_mail, // Send to interviewee
            subject: `Interview Scheduled for the role: ${role}`,
            text: `Dear ${interviewee.name},

You have been scheduled for an interview.

Details:
- Role: ${role}
- Date: ${date}
- Time: ${time}
- Website: ${website}

Please be prepared for the interview.

Best regards,
Team`
        };

        // Email content for recruiter and interviewer (with meeting link)
        const meetingMailOptions = {
            from: 'authenticheckv2@gmail.com', // Sender's email
            to: [recruiter_mail, interviewer.email_id], // Send to recruiter and interviewer
            subject: `Interview Scheduled for the role: ${role}`,
            text: `Dear ${interviewer.name} and Recruiter,

An interview has been scheduled for the following candidate.

Details:
- Role: ${role}
- Date: ${date}
- Time: ${time}
- Website: ${website}
- Meeting Link: ${meet_link}

Please join the meeting on time.

Best regards,
Team`
        };

        // Send email to the interviewee
        transporter.sendMail(intervieweeMailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email to interviewee:', err);
            } else {
                console.log('Email sent to interviewee: ' + info.response);
            }
        });

        // Send email to recruiter and interviewer
        transporter.sendMail(meetingMailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email to recruiter/interviewer:', err);
            } else {
                console.log('Email sent to recruiter and interviewer: ' + info.response);
            }
        });

        res.status(201).json({
            message: 'Meeting created successfully and emails sent',
            meeting: newMeeting
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.post('/get_presigned_url', verifyToken,isAdmin, async (req, res) => {
    const { interviewee_name, meeting_id } = req.body;
    try {
        // Validate input
        if (!interviewee_name || !meeting_id) {
            return res.status(400).json({ message: 'Both interviewee_name and meeting_id are required' });
        }

        // Construct the folder and file names
        const folder_name = `${interviewee_name}-${meeting_id}`;
        const file_name = 'interview_video.mp4';  // or any other filename
        const lambda_url = 'https://nyludtz4f7mjhemwui4zst2etq0zjcqi.lambda-url.ap-south-1.on.aws/';  // Replace with your actual Lambda URL or API Gateway URL

        // Make a GET request to Lambda function to get the presigned URL
        const response = await axios.get(lambda_url, {
            params: {
                folder: folder_name,
                filename: file_name
            }
        });

        // Extract the presigned URL from the Lambda's response
        const { uploadURL } = response.data;

        // Return the presigned URL to the client
        return res.status(200).json({ uploadURL: uploadURL });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return res.status(500).json({ message: 'Error generating presigned URL', error: error.message });
    }
});

router.post('/meeting_details', verifyToken, isAdmin, async (req, res) => {
    const { meeting_id } = req.body;

    try {
        // Query the meeting based on meeting_id
        const meeting = await Meeting.findOne({ where: { meeting_id } });

        // If meeting is not found
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Construct S3 folder URL (Assuming bucket name is 'interviewee-video')
        const BUCKET_NAME = 'interviewee-video';
        const REGION = 'ap-south-1'; // Replace with your bucket's region
        const folder_url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${meeting_id}/`;

        // Return meeting details along with the S3 folder URL
        res.status(200).json({
            message: 'Meeting details retrieved successfully',
            meeting: meeting.toJSON(), // Convert Sequelize object to plain JSON
            folderURL: folder_url
        });
    } catch (error) {
        console.error('Error fetching meeting details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/meetings', verifyToken, isAdmin, async (req, res) => {
    try {
        // Extract interviewer_id from token
        const interviewer_id = req.user.interviewerId;

        // Query meetings associated with the interviewer_id
        const meetings = await Meeting.findAll({ where: { interviewer_id } });

        // If no meetings are found
        if (!meetings || meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found' });
        }

        // Process each meeting to generate presigned URLs
        const meetingsWithURLs = await Promise.all(meetings.map(async (meeting) => {
            const { meeting_id } = meeting;

            // Construct the folder name using the interviewee email and meeting ID
            const folder_name = `${meeting_id}`;
            const file_name = 'interview_video.mp4'; // or any appropriate filename
            const lambda_url = 'https://nyludtz4f7mjhemwui4zst2etq0zjcqi.lambda-url.ap-south-1.on.aws/';  // Replace with your Lambda API Gateway URL
            const BUCKET_NAME = 'interviewee-video';
            const REGION = 'ap-south-1'; // Replace with your bucket's region
            const folder_url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${meeting_id}/`;
            try {
                // Call Lambda function to get the presigned URL
                const response = await axios.get(lambda_url, {
                    params: {
                        folder: folder_name,
                        filename: file_name
                    }
                });

                // Extract presigned URL from Lambda response
                const { uploadURL } = response.data;

                // Attach presigned URL to meeting details
                return {
                    ...meeting.toJSON(),  // Convert Sequelize object to plain JSON
                    uploadURL: uploadURL,
                    folderURl: folder_url,
                };
            } catch (error) {
                console.error(`Error generating presigned URL for meeting ${meeting_id}:`, error);
                return {
                    ...meeting.toJSON(),
                    uploadURL: null,  // Return null if there's an error generating the URL
                    error: `Error generating presigned URL: ${error.message}`
                };
            }
        }));

        // Return the meetings with their respective presigned URLs
        res.status(200).json(meetingsWithURLs);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
