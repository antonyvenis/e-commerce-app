from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from reportlab.pdfgen import canvas
from io import BytesIO

# ================================
# 📧 EMAIL & INVOICE UTILS
# ================================

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


# ================================
# 🧾 INVOICE GENERATION
# ================================

def generate_invoice(order):

    buffer = BytesIO()

    p = canvas.Canvas(buffer)

    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, 800, "INVOICE")

    p.setFont("Helvetica", 12)

    p.drawString(50, 760, f"Order ID: {order.id}")
    p.drawString(50, 740, f"Customer: {order.user.username}")

    y = 700

    for item in order.items.all():

        p.drawString(
            50,
            y,
            f"{item.product.name} x {item.quantity}"
        )

        y -= 20

    p.drawString(50, y - 20, f"Total: ₹{order.total_price}")

    p.save()

    buffer.seek(0)

    return buffer        