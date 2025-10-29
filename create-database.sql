-- SQL script to create the database if it doesn't exist
-- Run this with: mysql -u parkm_drzewa -p < create-database.sql

CREATE DATABASE IF NOT EXISTS parkm_trees CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE parkm_trees;

-- Database will be initialized by the application via /api/init
SELECT 'Database parkm_trees is ready!' AS status;
