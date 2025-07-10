
-- First, let's see what users exist and check the current user_roles
-- You'll need to replace 'your-email@example.com' with your actual email

-- Find your user ID in the users table
SELECT id, email, full_name, auth_id FROM users WHERE email = 'eric777arthur@gmail.com';

-- Check if you have any roles assigned
SELECT ur.role, u.email, u.full_name 
FROM user_roles ur 
JOIN users u ON ur.user_id = u.id 
WHERE u.email = 'eric777arthur@gmail.com';

-- If no admin role exists, insert it (replace the user_id with your actual user ID from the first query)
-- You'll need to get your user ID from the first query and replace it below
INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM users 
WHERE email = 'eric777arthur@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
