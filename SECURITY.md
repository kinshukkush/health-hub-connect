# 🔒 Security Guidelines

## Environment Variables Security

### ✅ What's Been Done

**MongoDB credentials are now separated** to prevent accidental exposure:

Instead of:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

Now using:
```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=cluster.mongodb.net
MONGODB_DATABASE=database_name
```

### 🚨 CRITICAL: Never Commit Passwords

**Files that should NEVER be committed to Git:**
- `Backend/.env.local` - Contains actual MongoDB password
- `Frontend/.env.local` - Contains actual API URLs
- Any file with `.env.local` or `.env.production` suffix

**Files safe to commit (templates only):**
- `Backend/.env` - Template with placeholder values
- `Frontend/.env` - Template with placeholder values
- `.env.example` - Example template for documentation

### ✅ `.gitignore` Protection

Your `.gitignore` is configured to block these files:
```
.env.local
.env.production
Frontend/.env.local
Backend/.env.local
```

### 🔍 Before Pushing to GitHub

**Always check before `git push`:**
```bash
# Check what files will be committed
git status

# View staged changes
git diff --staged

# Make sure no .env.local files are listed!
```

### 🛡️ If Password Accidentally Committed

**Immediate actions:**

1. **Change your MongoDB password immediately:**
   - Go to MongoDB Atlas
   - Database Access → Edit User
   - Change password
   - Update local `.env.local` file

2. **Remove from Git history:**
   ```bash
   # If just committed (before push)
   git reset HEAD~1
   
   # If already pushed (advanced - requires force push)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch Backend/.env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Rotate JWT secret:**
   - Generate new random string
   - Update in deployment platform (Render/Vercel)

### 📋 Production Deployment Security

**When deploying to Render/Vercel:**

1. **Set environment variables in dashboard** - Don't use files
2. **Use separate passwords** for production vs development
3. **Enable 2FA** on MongoDB Atlas account
4. **Whitelist IPs** in MongoDB Atlas (or use 0.0.0.0/0 for cloud)
5. **Rotate secrets** periodically

### ✅ Safe Practices

**DO:**
- ✅ Use `.env.local` for local development
- ✅ Set environment variables in hosting dashboards
- ✅ Keep passwords separate from connection strings
- ✅ Use different credentials for dev vs production
- ✅ Share templates (`.env.example`) with team

**DON'T:**
- ❌ Commit `.env.local` files
- ❌ Hardcode passwords in source code
- ❌ Share passwords in chat/email
- ❌ Use same password across environments
- ❌ Commit actual MongoDB connection strings

### 🔐 MongoDB Atlas Security

**Recommended settings:**

1. **Database Access:**
   - Use strong passwords (16+ characters)
   - Enable IP Whitelist (production)
   - Use 0.0.0.0/0 only for development

2. **Network Access:**
   - Add Render IP addresses (production)
   - Add your local IP (development)

3. **Backup:**
   - Enable automatic backups
   - Test restore procedures

### 📝 Current Setup

**Your MongoDB Credentials:**
- **Username**: `kinshuksaxena3_db_user`
- **Password**: Separated in `.env.local` (not in Git)
- **Cluster**: `cluster0.ceqszik.mongodb.net`
- **Database**: `healthhub`

**Environment Variables Required:**
```env
# Backend/.env.local (LOCAL ONLY - NOT IN GIT)
MONGODB_USERNAME=kinshuksaxena3_db_user
MONGODB_PASSWORD=<actual_password_here>
MONGODB_CLUSTER=cluster0.ceqszik.mongodb.net
MONGODB_DATABASE=healthhub
JWT_SECRET=<random_secret>
```

### 🎯 Deployment Checklist

**Before deploying:**
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Checked `git status` for sensitive files
- [ ] Set environment variables in Render dashboard
- [ ] Set environment variables in Vercel dashboard
- [ ] Different JWT secrets for dev vs production
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Test deployment with demo accounts

### 📞 If Security Breach

1. **Immediately** change MongoDB password
2. Rotate all JWT secrets
3. Check MongoDB Atlas logs for unauthorized access
4. Review Git history for leaked credentials
5. Contact hosting support if needed

---

**Last Updated**: 2026-01-02  
**Security Policy Version**: 1.0

⚠️ **Remember**: Security is ongoing. Regularly review access logs and rotate credentials!
