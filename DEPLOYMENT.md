# VTECHSOFT Backend Deployment Guide

## 🚀 Deployment Options

### Option 1: Render (Recommended for Backend)

#### Step 1: Create Render Account
- Go to [render.com](https://render.com)
- Sign up for a free account

#### Step 2: Connect Repository
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `vtechsoft-backend` folder

#### Step 3: Configure Service
- **Name**: `vtechsoft-backend`
- **Environment**: Node
- **Root Directory**: `vtechsoft-backend`
- **Build Command**: `echo 'No build step required'`
- **Start Command**: `npm start`
- **Instance Type**: Free (to start)

#### Step 4: Set Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://techsoft:techsoft9838@cluster0.cdfsqrd.mongodb.net
JWT_SECRET=vtechsoft_jwt_secret_key_2026
EMAIL_USER=vtechsoft9838@gmail.com
EMAIL_PASS=vivekshukla9838
FRONTEND_URL=https://vtechsoft-frontend.vercel.app
```

### Option 2: Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
cd d:\desktop\p\vtechsoft-backend
heroku create vtechsoft-backend
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=mongodb+srv://techsoft:techsoft9838@cluster0.cdfsqrd.mongodb.net
heroku config:set JWT_SECRET=vtechsoft_jwt_secret_key_2026
heroku config:set EMAIL_USER=vtechsoft9838@gmail.com
heroku config:set EMAIL_PASS=vivekshukla9838
heroku config:set FRONTEND_URL=https://vtechsoft-frontend.vercel.app
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: Railway

#### Step 1: Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

#### Step 2: Deploy Project
- Click "New Project" → "Deploy from GitHub repo"
- Select your repository
- Configure environment variables

## 🔧 Environment Variables

### Required Environment Variables:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://techsoft:techsoft9838@cluster0.cdfsqrd.mongodb.net
JWT_SECRET=vtechsoft_jwt_secret_key_2026
EMAIL_USER=vtechsoft9838@gmail.com
EMAIL_PASS=vivekshukla9838
FRONTEND_URL=https://vtechsoft-frontend.vercel.app
PORT=5001
```

## 📋 Pre-Deployment Checklist

### ✅ Before Deploying:
- [ ] Test all API endpoints locally
- [ ] Verify database connection
- [ ] Test authentication endpoints
- [ ] Check email functionality
- [ ] Verify CORS settings
- [ ] Update frontend URL in CORS

### ✅ After Deploying:
- [ ] Test all API endpoints
- [ ] Check database connectivity
- [ ] Test user registration/login
- [ ] Verify email sending
- [ ] Test CORS with frontend
- [ ] Check error handling

## 🌐 Live URLs After Deployment

### Backend URLs:
- **Render**: `https://vtechsoft-backend.onrender.com`
- **Heroku**: `https://vtechsoft-backend.herokuapp.com`
- **Railway**: `https://vtechsoft-backend.up.railway.app`

## 🔗 CORS Configuration

Update your CORS settings to include your frontend URL:

```javascript
// In server.js
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vtechsoft-frontend.vercel.app',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

## 🛠️ Troubleshooting

### Common Issues:
- **Database Connection**: Check MONGO_URI format
- **CORS Errors**: Verify frontend URL in CORS settings
- **Environment Variables**: Ensure all required variables are set
- **Port Issues**: Make sure backend listens on correct port

### Debug Steps:
1. Check deployment logs
2. Test API endpoints directly
3. Verify environment variables
4. Check database connection
5. Test CORS configuration

## 📊 Monitoring

### Recommended Monitoring Tools:
- **Render**: Built-in metrics and logs
- **Heroku**: Heroku metrics
- **Railway**: Built-in monitoring

### Key Metrics to Monitor:
- Response times
- Error rates
- Database connection status
- Memory usage
- API request counts
