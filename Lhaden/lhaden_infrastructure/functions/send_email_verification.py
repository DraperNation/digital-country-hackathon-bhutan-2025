import logging as logger
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email_for_verification(recipient_email, otp):
    """
    Send error report via email.
    """
    gmail_user = "YOUR-GMAIL-ID"
    gmail_password = "GMAIL-PASSWORD"

    if not recipient_email:
        logger.error(f"No email provided")
        return

    try:
        # Create the email
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = recipient_email  # Now a string
        msg['Subject'] = 'Verify your email for Lhaden'
        msg.attach(MIMEText(
            f"""
Hi there,

To start your journey with Lhaden, we just need to make sure this email address is yours.
                     
Your security code (valid for {120 // 60} minutes):
                     
{otp}
                     
If you didn't request this code, simply ignore this message.
                     
Thanks & Regards,
The Lhaden Account Team""", "plain"))

        # Send the email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(gmail_user, gmail_password)
            server.sendmail(gmail_user, recipient_email, msg.as_string())

    except smtplib.SMTPException as smtp_error:
        logger.error(f"SMTP error occurred while sending mail: {smtp_error}")
    except Exception as general_error:
        logger.error(f"Failed to send mail: {general_error}")
    finally:
        logger.info("Login confirmation process completed.")
