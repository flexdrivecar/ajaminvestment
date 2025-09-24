# Post-Deployment Verification Checklist

## 1. Service Status Verification
```bash
ssh devine@165.22.108.44 "systemctl status ajmal-backend nginx postgresql"
```

## 2. Backend API Testing
```bash
curl -X GET https://ajmalinvestment.com/api/docs
curl -X GET https://ajmalinvestment.com/api/health
```

## 3. Frontend Access Testing
- Navigate to: https://ajmalinvestment.com
- Verify landing page loads correctly
- Test navigation to registration page

## 4. Registration Flow Testing
- Fill registration form with valid data
- Submit and verify no "Registration failed" error
- Check redirect to dashboard with onboarding banner

## 5. Database Connectivity
```bash
ssh devine@165.22.108.44 "sudo -u postgres psql -d ajmal_investments -c 'SELECT COUNT(*) FROM users;'"
```

## 6. SSL Certificate Verification
```bash
curl -I https://ajmalinvestment.com
openssl s_client -connect ajmalinvestment.com:443 -servername ajmalinvestment.com
```

## 7. Log Monitoring
```bash
ssh devine@165.22.108.44 "journalctl -u ajmal-backend -n 20"
ssh devine@165.22.108.44 "tail -f /var/log/nginx/error.log"
```

## 8. Platform Feature Testing
- Test user registration with referral codes
- Verify KYC upload functionality
- Check investment categories display
- Test admin panel access
- Verify PDF statement generation

## 9. Security Verification
- Confirm HTTPS is working
- Test password validation
- Verify email verification flow
- Check user status restrictions

## 10. Performance Monitoring
```bash
ssh devine@165.22.108.44 "htop"
ssh devine@165.22.108.44 "df -h"
ssh devine@165.22.108.44 "free -h"
```
