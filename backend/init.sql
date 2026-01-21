-- Initial database setup for task management system
-- This file is automatically executed when the PostgreSQL container starts

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions (PostgreSQL handles this via POSTGRES_USER env var)
-- Additional grants can be added here if needed
