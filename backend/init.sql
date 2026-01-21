-- Initial database setup for task management system
-- This file is automatically executed when the MySQL container starts

-- Grant necessary permissions to app_user for Prisma migrations
GRANT ALL PRIVILEGES ON `prisma_%`.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON `task_management`.* TO 'app_user'@'%';
GRANT CREATE, ALTER, DROP ON `task_management`.* TO 'app_user'@'%';
GRANT SUPER ON *.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
