from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

def send_email_otp(email, otp):
    try:
        message = Mail(
            from_email='antonyvenis1212@gmail.com',  # 🔥 verified email
            to_emails=email,
            subject='Your OTP Code',
            html_content=f'<strong>Your OTP is {otp}</strong>'
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)

        print("STATUS 👉", response.status_code)

    except Exception as e:
        print("EMAIL ERROR 👉", str(e))