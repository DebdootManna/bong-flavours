# 🚀 CORRECT VERCEL ENVIRONMENT VARIABLES

# Copy these EXACT values to your Vercel dashboard

# === REQUIRED FOR MONGODB ===

MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bong-flavours?retryWrites=true&w=majority

# === REQUIRED FOR AUTHENTICATION ===

JWT_SECRET=prod-bong-flavours-jwt-super-secure-random-string-32-chars-minimum-length-2024
NEXTAUTH_SECRET=prod-bong-flavours-nextauth-secure-random-string-32-chars-minimum-length-2024

# === REQUIRED FOR VERCEL DEPLOYMENT ===

NEXTAUTH_URL=https://bong-flavours-55e3ez86f-debdootmannas-projects.vercel.app
NEXT_PUBLIC_SITE_URL=https://bong-flavours-55e3ez86f-debdootmannas-projects.vercel.app

# === EMAIL CONFIGURATION (Using your Gmail) ===

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=debdootmanna007@gmail.com
SMTP_PASS=dtcj docu mfru czml

# === RESTAURANT INFO ===

NEXT_PUBLIC_RESTAURANT_EMAIL=mannadebdoot007@gmail.com
NEXT_PUBLIC_RESTAURANT_PHONE=8238018577

# === RESTAURANT INFO (OPTIONAL) ===

NEXT_PUBLIC_RESTAURANT_EMAIL=mannadebdoot007@gmail.com
NEXT_PUBLIC_RESTAURANT_PHONE=8238018577

# === IMPORTANT NOTES ===

# 1. Replace MONGODB_URI with your actual MongoDB Atlas connection string

# 2. Use the EXACT Vercel URL (no localhost!)

# 3. Generate strong random strings for JWT secrets

# 4. Delete any SOCKET_URL or localhost references

# === DO NOT ADD TO VERCEL ===

# SOCKET_URL (delete this - not needed for production)

# Any localhost URLs (these won't work on Vercel)
