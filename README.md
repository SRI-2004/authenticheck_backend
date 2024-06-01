
# Interview Management System

## Project Introduction

Welcome to our Interview Management System! This project aims to streamline the process of managing interviews by providing a centralized platform for interviewers and interviewees to schedule, track, and conduct interviews efficiently.

### Tech Stack

- **Node.js**: The backend of the application is built using Node.js, allowing for efficient handling of server-side logic.
- **Express.js**: We utilize Express.js as the web application framework for Node.js, enabling us to create robust and scalable APIs.
- **Sequelize**: Sequelize is used as the ORM (Object-Relational Mapping) library for interacting with the database, providing a simple and intuitive way to perform database operations.
- **AWS RDS**: Our database is hosted on Amazon RDS (Relational Database Service), offering high availability, scalability, and security for our data storage needs.
- **JWT (JSON Web Tokens)**: For secure authentication and authorization, we use JWT to generate and verify tokens, allowing users to access protected routes and resources securely.

With this tech stack, we aim to deliver a reliable and user-friendly solution for managing interviews effectively. Let's dive in and explore the features of our Interview Management System!

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/SRI-2004/authenticheck_backend/
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your PostgreSQL database connection in `config/database.js`.

## Overview

The system consists of three main tables, each designed to store specific information related to interviewers, interviewees, and scheduled meetings. These tables are intricately linked to ensure seamless coordination and communication throughout the interview process.

## Tables

### 1. Interviewer

The `Interviewer` table captures detailed information about interviewers participating in the interview process. It includes the following fields:
<details>
<summary>Interviewer Table Attributes</summary>
  
- **interviewer_id**: Primary key, auto-incremented integer.
- **name**: String, not nullable, storing the name of the interviewer.
- **phone_no**: String, not nullable, storing the phone number of the interviewer.
- **email_id**: String, not nullable, unique, validated as an email address, storing the email address of the interviewer.
- **password**: String, not nullable, storing the password of the interviewer.
- **organisation**: String, not nullable, storing the organization to which the interviewer belongs.
- **id_photo**: String, nullable, storing the path to the photo of the interviewer's identification.
- **dob**: Date, not nullable, storing the date of birth of the interviewer.
- **isAdmin**: Boolean, nullable, default true, indicating whether the interviewer is an administrator.
</details>

### 2. Interviewee

The `Interviewee` table stores essential details about candidates participating in the interview process. It includes the following fields:
<details>
<summary>Interviewee Table Attributes</summary>
  
- **interviewee_id**: Primary key, auto-incremented integer.
- **name**: String, not nullable, storing the name of the interviewee.
- **phone_no**: String, not nullable, storing the phone number of the interviewee.
- **email_id**: String, not nullable, unique, validated as an email address, storing the email address of the interviewee.
- **password**: String, not nullable, storing the password of the interviewee.
- **id_photo**: String, nullable, storing the path to the photo of the interviewee's identification.
- **face_id**: String, nullable, storing the unique identifier for facial recognition.
- **voice_id**: String, nullable, storing the unique identifier for voice recognition.
- **dob**: Date, not nullable, storing the date of birth of the interviewee.
</details>

### 3. Meeting

The `Meeting` table records details about scheduled meetings between interviewers and interviewees. It includes the following fields:
<details>
<summary>Meeting Table Attributes</summary>

- **meeting_id**: Primary key, auto-incremented integer.
- **date**: Date, not nullable, storing the date of the meeting.
- **time**: Time, not nullable, storing the time of the meeting.
- **role**: String, not nullable, storing the role of the interviewee in the meeting.
- **interviewer_id**: Integer, foreign key referencing the ID of the interviewer.
- **interviewee_id**: Integer, foreign key referencing the ID of the interviewee.
</details>


## API Endpoints

### Authentication

- **POST /auth/signup_interviewer**:
  - Register a new interviewer account.
  - Parameters:
    - `name`: String, required. Name of the interviewer.
    - `email_id`: String, required, unique. Email address of the interviewer.
    - `phone_no`: String, required. Phone number of the interviewer.
    - `password`: String, required. Password for the account.
    - `organisation`: String, required. Organization of the interviewer.

- **POST /auth/signup_interviewee**:
  - Register a new interviewee account.
  - Parameters:
    - `name`: String, required. Name of the interviewee.
    - `email_id`: String, required, unique. Email address of the interviewee.
    - `phone_no`: String, required. Phone number of the interviewee.
    - `password`: String, required. Password for the account.
    - `dob`: Date, required. Date of birth of the interviewee.

- **POST /auth/login**:
  - Authenticate and obtain a JWT token.
  - Parameters:
    - `email_id`: String, required. Email address of the user.
    - `password`: String, required. Password for the account.

### Interviewer Routes

- **GET /interviewer/details**:
  - Retrieve details of the logged-in interviewer.
  - Requires authentication.

- **POST /interviewer/create_meetings**:
  - Schedule a meeting with an interviewee.
  - Requires authentication.
  - Parameters:
    - `interviewee_id`: Integer, required. ID of the interviewee.
    - `date`: Date, required. Date of the meeting.
    - `time`: Time, required. Time of the meeting.
    - `role`: String, required. Role of the interviewee in the meeting.

- **GET /interviewer/meetings**:
  - Retrieve all meetings scheduled by the interviewer.
  - Requires authentication.

### Interviewee Routes

- **GET /interviewee/details**:
  - Retrieve details of the logged-in interviewee.
  - Requires authentication.

- **GET /interviewee/meetings**:
  - Retrieve all meetings scheduled with the interviewee.
  - Requires authentication.

## Usage

1. Start the server:
   ```
   npm start server
   ```

2. Access the API endpoints using appropriate HTTP methods. Tools like Postman or curl can be used for requests.

3. Authenticate using `/auth/signup_interviewer`, `/auth/signup_interviewee`, or `/auth/login` to receive a JWT token.

4. Use the token to access protected routes such as `/interviewer/details` and `/interviewee/details`.

5. Schedule meetings using `/interviewer/create_meetings`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code.

---
