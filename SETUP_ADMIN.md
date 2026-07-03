# How to Set Up an Admin Account

By default, all new users are created as **Students**. To promote a user to Admin, follow these steps:

1. **Sign Up/Login** with the email you want to be admin
2. **Go to Supabase Dashboard**
3. **Navigate to Table Editor**
4. **Find the `user_roles` table**
5. **Update your role**:
   - Find the row with your user's ID
   - Change the `role` column from `student` to `admin`
6. **Refresh the page** in your app

That's it! You now have full admin access to manage courses and milestones.

## Quick SQL Query (Optional)
If you want to set a user as admin using SQL:

```sql
-- Replace 'your-user-id-here' with your actual user ID
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'your-user-id-here';
```
