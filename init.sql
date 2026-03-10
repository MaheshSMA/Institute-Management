-- ================================
-- Student360 / Institution DB Init
-- ================================

DROP DATABASE IF EXISTS institution_db;
CREATE DATABASE institution_db;
USE institution_db;

-- =====================
-- MASTER TABLES
-- =====================

CREATE TABLE DEPT (
  Dept_code VARCHAR(10) PRIMARY KEY,
  Dept_name VARCHAR(100) NOT NULL
);

CREATE TABLE ADMIN (
  Admin_id INT AUTO_INCREMENT PRIMARY KEY,
  Admin_name VARCHAR(100),
  Admin_email VARCHAR(100) UNIQUE,
  Password VARCHAR(255)
);

-- =====================
-- FACULTY & STUDENT
-- =====================

CREATE TABLE FACULTY (
  Fac_id INT AUTO_INCREMENT PRIMARY KEY,
  Fac_name VARCHAR(100) NOT NULL,
  Fac_email VARCHAR(100) UNIQUE NOT NULL,
  Dept_code VARCHAR(10),
  Is_Counsellor BOOLEAN DEFAULT FALSE,
  Is_Club_Coordinator BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (Dept_code) REFERENCES DEPT(Dept_code)
);

CREATE TABLE STUDENT (
  Student_id INT AUTO_INCREMENT PRIMARY KEY,
  Student_name VARCHAR(100) NOT NULL,
  USN VARCHAR(30) UNIQUE NOT NULL,
  DOB DATE,
  Year INT,
  Dept_code VARCHAR(10),
  Student_email VARCHAR(100) UNIQUE,
  Activity_pts INT DEFAULT 0,
  Supervised_by INT,
  FOREIGN KEY (Dept_code) REFERENCES DEPT(Dept_code),
  FOREIGN KEY (Supervised_by) REFERENCES FACULTY(Fac_id)
);

-- =====================
-- AUTHENTICATION
-- =====================

CREATE TABLE LOGIN (
  Login_id INT AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('Student','Faculty','Admin','Club') NOT NULL,
  Ref_id INT NOT NULL
);

-- =====================
-- CLUBS & EVENTS
-- =====================

CREATE TABLE CLUB (
  Club_id INT AUTO_INCREMENT PRIMARY KEY,
  Club_name VARCHAR(100) NOT NULL,
  Description TEXT,
  Coordinator_id INT NOT NULL,
  FOREIGN KEY (Coordinator_id) REFERENCES FACULTY(Fac_id)
);

CREATE TABLE CLUB_MEMBERSHIP (
  Student_id INT NOT NULL,
  Club_id INT NOT NULL,
  Status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  Joined_At TIMESTAMP NULL,
  PRIMARY KEY (Student_id, Club_id),
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
  FOREIGN KEY (Club_id) REFERENCES CLUB(Club_id)
);

CREATE TABLE PARTICIPATION (
  Student_id INT NOT NULL,
  Event_id INT NOT NULL,
  Participation_status ENUM('Registered','Attended','Completed','Absent') DEFAULT 'Registered',
  Role_in_event ENUM('Participant','Volunteer','Organizer') DEFAULT 'Participant',
  Pts_earned INT DEFAULT 0,
  PRIMARY KEY (Student_id, Event_id),
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
  FOREIGN KEY (Event_id) REFERENCES EVENT(Event_id)
);

CREATE TABLE CLUB_FEED (
  Feed_id INT AUTO_INCREMENT PRIMARY KEY,
  Club_id INT NOT NULL,
  Content TEXT NOT NULL,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Club_id) REFERENCES CLUB(Club_id)
);

-- =====================
-- REQUESTS & MESSAGING
-- =====================

CREATE TABLE COUNSELLOR_REQUEST (
  Request_id INT AUTO_INCREMENT PRIMARY KEY,
  Student_id INT NOT NULL,
  Fac_id INT NOT NULL,
  Type ENUM('Counsellor Join','Activity Point') NOT NULL,
  Status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  Reason TEXT,
  Document_path VARCHAR(255),
  Pts_earned INT DEFAULT 0,
  Is_read BOOLEAN DEFAULT FALSE,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
  FOREIGN KEY (Fac_id) REFERENCES FACULTY(Fac_id)
);

CREATE TABLE MESSAGE (
  Message_id INT AUTO_INCREMENT PRIMARY KEY,
  Student_id INT NOT NULL,
  Fac_id INT NOT NULL,
  Sender ENUM('Student','Faculty') NOT NULL,
  Content TEXT NOT NULL,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id),
  FOREIGN KEY (Fac_id) REFERENCES FACULTY(Fac_id)
);

-- =====================
-- POLICY ENGINE
-- =====================

CREATE TABLE ADMIN_POLICY (
  Policy_id INT AUTO_INCREMENT PRIMARY KEY,
  Policy_name VARCHAR(100) NOT NULL,
  Policy_type ENUM(
    'MAX_ACTIVITY_POINTS',
    'MAX_COUNSELLOR_LOAD',
    'EVENT_MIN_COUNT'
  ) NOT NULL,
  Target_role ENUM('Student','Faculty','Club') NOT NULL,
  Threshold_value INT NOT NULL,
  Is_active BOOLEAN DEFAULT TRUE,
  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE POLICY_VIOLATION (
  Violation_id INT AUTO_INCREMENT PRIMARY KEY,
  Policy_id INT NOT NULL,
  Target_id INT NOT NULL,
  Target_role ENUM('Student','Faculty','Club') NOT NULL,
  Current_value INT,
  Threshold_value INT,
  Status ENUM('Detected','Resolved','Ignored') DEFAULT 'Detected',
  Detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_active_violation (Policy_id, Target_id, Target_role, Status),
  FOREIGN KEY (Policy_id) REFERENCES ADMIN_POLICY(Policy_id)
);

CREATE TABLE POLICY_ACTION_LOG (
  Action_id INT AUTO_INCREMENT PRIMARY KEY,
  Violation_id INT,
  Action_taken VARCHAR(100),
  Action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Violation_id) REFERENCES POLICY_VIOLATION(Violation_id)
);

-- =====================
-- AI / DIGITAL TWIN
-- =====================

CREATE TABLE STUDENT_AI_INSIGHTS (
  Student_id INT PRIMARY KEY,
  summary_text TEXT,
  dominant_topics JSON,
  engagement_level VARCHAR(20),
  risk_score FLOAT,
  risk_explanation TEXT,
  ai_source ENUM('ollama','rule_based') DEFAULT 'rule_based',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
);

CREATE TABLE STUDENT_TWIN (
  Student_id INT PRIMARY KEY,
  Current_state VARCHAR(30),
  Last_updated DATETIME,
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
);

CREATE TABLE TWIN_STATE_LOG (
  Log_id INT AUTO_INCREMENT PRIMARY KEY,
  Student_id INT,
  Old_state VARCHAR(30),
  New_state VARCHAR(30),
  Rule_code VARCHAR(20),
  Explanation TEXT,
  Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Student_id) REFERENCES STUDENT(Student_id)
);



