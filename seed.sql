USE institution_db;

-- =====================
-- DEPARTMENTS
-- =====================

INSERT INTO DEPT (Dept_code, Dept_name) VALUES
('CSE', 'Computer Science and Engineering'),
('ECE', 'Electronics and Communication Engineering'),
('ME',  'Mechanical Engineering'),
('AI',  'Artificial Intelligence and Machine Learning');

-- =====================
-- FACULTY
-- =====================

INSERT INTO FACULTY
(Fac_name, Fac_email, Dept_code, Is_Counsellor, Is_Club_Coordinator)
VALUES
('Dr. Sharma', 'sharma@college.edu', 'CSE', TRUE, FALSE),
('Dr. Mehta',  'mehta@college.edu',  'ECE', TRUE, TRUE),
('Dr. Rao',    'rao@college.edu',    'ME',  FALSE, TRUE);

-- =====================
-- STUDENTS
-- =====================

INSERT INTO STUDENT
(Student_name, USN, DOB, Year, Dept_code, Student_email, Activity_pts, Supervised_by)
VALUES
('Mahesh', '1RV23AI001', '2003-05-10', 3, 'AI',  'mahesh@rvce.edu', 20, 1),
('Rahul',  '1RV22EC002', '2002-11-21', 4, 'ECE', 'rahul@rvce.edu',  15, 2),
('Anita',  '1RV24ME003', '2003-01-15', 2, 'ME',  'anita@rvce.edu',   0, NULL);

-- =====================
-- ADMIN
-- =====================

INSERT INTO ADMIN
(Admin_name, Admin_email, Password)
VALUES
('Super Admin', 'admin@college.edu', '$2a$10$hashedpassword');

-- =====================
-- LOGIN
-- =====================

INSERT INTO LOGIN
(Email, Password, Role, Ref_id)
VALUES
('mahesh@rvce.edu', 'pass123', 'Student', 1),
('rahul@rvce.edu',  'pass123', 'Student', 2),
('anita@rvce.edu',  'pass123', 'Student', 3),
('sharma@college.edu', '$2a$10$hash', 'Faculty', 1),
('mehta@college.edu',  '$2a$10$hash', 'Faculty', 2),
('admin@college.edu',  '$2a$10$hash', 'Admin',   1);

-- =====================
-- CLUBS
-- =====================

INSERT INTO CLUB
(Club_name, Description, Coordinator_id)
VALUES
('Coding Club',   'Programming and Hackathons', 2),
('Robotics Club', 'Robotics and Automation',    3);

-- =====================
-- EVENTS
-- =====================

INSERT INTO EVENT
(Event_name, Description, Duration, Club_id)
VALUES
('Hackathon',      '24-hour coding event', '1 Day', 1),
('Robotics Expo',  'Robot showcase',        '2 Days', 2);

-- =====================
-- CLUB MEMBERSHIP
-- =====================

INSERT INTO CLUB_MEMBERSHIP
(Student_id, Club_id, Status, Joined_At)
VALUES
(1, 1, 'Approved', NOW()),
(2, 1, 'Approved', NOW()),
(3, 2, 'Approved', NOW());

-- =====================
-- EVENT PARTICIPATION
-- =====================

INSERT INTO PARTICIPATION
(Student_id, Event_id, Participation_status, Role_in_event, Pts_earned)
VALUES
(1, 1, 'Completed', 'Participant', 20),
(2, 1, 'Completed', 'Volunteer',   15),
(3, 2, 'Registered','Participant', 0);

-- =====================
-- COUNSELLOR & ACTIVITY REQUESTS
-- =====================

INSERT INTO COUNSELLOR_REQUEST
(Student_id, Fac_id, Type, Status, Reason, Pts_earned)
VALUES
(1, 1, 'Counsellor Join', 'Approved', 'Academic guidance', 0),
(1, 1, 'Activity Point', 'Approved', 'Hackathon participation', 20);

-- =====================
-- CLUB FEED
-- =====================

INSERT INTO CLUB_FEED
(Club_id, Content)
VALUES
(1, 'Welcome to the Coding Club!'),
(2, 'Robotics workshop coming soon.');

-- =====================
-- ADMIN POLICIES
-- =====================

INSERT INTO ADMIN_POLICY
(Policy_name, Policy_type, Target_role, Threshold_value)
VALUES
('Max Activity Points', 'MAX_ACTIVITY_POINTS', 'Student', 100),
('Max Counsellor Load', 'MAX_COUNSELLOR_LOAD', 'Faculty', 30);

-- =====================
-- STUDENT AI INSIGHTS
-- =====================

INSERT INTO STUDENT_AI_INSIGHTS
(Student_id, summary_text, engagement_level, risk_score, risk_explanation)
VALUES
(1, 'Active participant in clubs and events', 'High', 0.12, 'Consistent engagement'),
(2, 'Moderate engagement in academics',       'Medium', 0.35, 'Limited co-curricular activity'),
(3, 'Low engagement detected',                'Low', 0.62, 'Minimal participation');

-- =====================
-- DIGITAL TWIN
-- =====================

INSERT INTO STUDENT_TWIN
(Student_id, Current_state, Last_updated)
VALUES
(1, 'Engaged', NOW()),
(2, 'Stable',  NOW()),
(3, 'At-Risk', NOW());
