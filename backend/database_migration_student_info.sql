-- Run these commands in phpMyAdmin to update your existing database

-- Add class information columns to users table
ALTER TABLE users 
ADD COLUMN class_name VARCHAR(50) DEFAULT NULL AFTER role,
ADD COLUMN section VARCHAR(10) DEFAULT NULL AFTER class_name,
ADD COLUMN roll_number VARCHAR(20) DEFAULT NULL AFTER section;

-- These columns will be NULL for existing users
-- Students can update them in their profile page
