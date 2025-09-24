import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def _send_email_sync(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None):
        """Send email synchronously"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    async def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None):
        """Send email asynchronously"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor, 
            self._send_email_sync, 
            to_email, 
            subject, 
            html_content, 
            text_content
        )
    
    async def send_verification_email(self, to_email: str, first_name: str, verification_token: str):
        """Send email verification email"""
        base_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        verification_url = f"{base_url}/verify-email?token={verification_token}"
        
        subject = "Verify Your Email - Ajmal Investments PLC"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Ajmal Investments PLC</h1>
                    <p>Premier International Investment Platform</p>
                </div>
                <div class="content">
                    <h2>Hello {first_name},</h2>
                    <p>Thank you for registering with Ajmal Investments PLC. To complete your registration and start investing, please verify your email address.</p>
                    
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </p>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 5px;">{verification_url}</p>
                    
                    <p><strong>This verification link will expire in 24 hours.</strong></p>
                    
                    <p>If you didn't create an account with us, please ignore this email.</p>
                    
                    <div class="footer">
                        <p>Best regards,<br>The Ajmal Investments Team</p>
                        <p>71-75 Shelton St, London WC2H 9JQ, UK<br>
                        Email: info@ajmalinvestment.com | Phone: +447882415437</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to Ajmal Investments PLC
        
        Hello {first_name},
        
        Thank you for registering with Ajmal Investments PLC. To complete your registration and start investing, please verify your email address by clicking the link below:
        
        {verification_url}
        
        This verification link will expire in 24 hours.
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        The Ajmal Investments Team
        
        71-75 Shelton St, London WC2H 9JQ, UK
        Email: info@ajmalinvestment.com | Phone: +447882415437
        """
        
        return await self.send_email(to_email, subject, html_content, text_content)
    
    async def send_welcome_email(self, to_email: str, first_name: str):
        """Send welcome email after verification"""
        subject = "Welcome to Ajmal Investments PLC - Start Your Investment Journey"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to Ajmal Investments</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .feature {{ background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1e3a8a; }}
                .button {{ display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to Ajmal Investments!</h1>
                    <p>Your investment journey starts here</p>
                </div>
                <div class="content">
                    <h2>Hello {first_name},</h2>
                    <p>Congratulations! Your email has been verified and your account is now active. You're ready to start building your investment portfolio with our diversified investment opportunities.</p>
                    
                    <div class="feature">
                        <h3>🚀 Next Steps:</h3>
                        <ul>
                            <li>Complete your KYC verification for higher investment limits</li>
                            <li>Explore our 9 investment categories</li>
                            <li>Make your first deposit and start investing</li>
                            <li>Share your referral code and earn commissions</li>
                        </ul>
                    </div>
                    
                    <div class="feature">
                        <h3>💼 Investment Categories Available:</h3>
                        <ul>
                            <li>Stocks & Equities (8-15% ROI)</li>
                            <li>Private Equity (15-25% ROI)</li>
                            <li>Venture Capital (10-50% ROI)</li>
                            <li>Real Estate (12-20% ROI)</li>
                            <li>And 5 more categories...</li>
                        </ul>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/dashboard" class="button">Access Your Dashboard</a>
                    </p>
                    
                    <p>If you have any questions, our support team is here to help at info@ajmalinvestment.com</p>
                    
                    <p>Happy investing!<br>The Ajmal Investments Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(to_email, subject, html_content)

email_service = EmailService()
