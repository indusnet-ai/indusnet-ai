-- Migration 001: Add submitted_at column to bidder_sessions
ALTER TABLE bidder_sessions ADD COLUMN submitted_at TIMESTAMP NULL;
