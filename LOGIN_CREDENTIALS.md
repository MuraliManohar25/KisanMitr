# Login Credentials & Authentication

## 🔐 Demo Account

After setting up MongoDB and running the seed script, you can use these credentials:

**Email:** `demo@farmer.com`  
**Password:** `demo123`

## 📝 Creating Demo User

To create the demo user, run:

```powershell
cd backend
npm run create-demo
```

This will create a demo user with:
- Username: `demo`
- Email: `demo@farmer.com`
- Password: `demo123`
- Farmer Name: `Demo Farmer`
- Location: `Demo Village`

## 🆕 Creating Your Own Account

1. Go to http://localhost:3000/login
2. Click on "Register" tab
3. Fill in:
   - Username (min 3 characters)
   - Email
   - Password (min 6 characters)
   - Optional: Farmer Name, Location, Phone
4. Click "Create Account"

## 🔑 Features

### Login Page
- **URL:** http://localhost:3000/login
- Toggle between Login and Register
- Form validation
- Error handling
- Demo credentials displayed

### Dashboard
- **URL:** http://localhost:3000/dashboard
- View all your certificates
- Statistics (Total, Grade A/B/C counts)
- Quick access to certificates
- Logout functionality

### Protected Routes
- Dashboard requires authentication
- Certificates are linked to user accounts
- Automatic redirect to login if not authenticated

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Tokens stored in localStorage
- Protected API routes require authentication

## 🚀 Usage Flow

1. **Register/Login** → Get authenticated
2. **Create Analysis** → Analysis linked to your account
3. **View Dashboard** → See all your certificates
4. **Download Certificates** → Access anytime

## 📋 API Endpoints

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `GET /api/certificates/my-certificates` - Get user's certificates (protected)

