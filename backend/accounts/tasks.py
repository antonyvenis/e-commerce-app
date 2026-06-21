from celery import shared_task


@shared_task
def send_email_otp_task(email, otp):
    from .views import send_email_otp
    send_email_otp(email, otp)


@shared_task
def send_forgot_email_otp_task(email, otp):
    from .views import send_forgot_email_otp
    send_forgot_email_otp(email, otp)


@shared_task
def send_welcome_email_task(email, username):
    from .views import send_welcome_email
    send_welcome_email(email, username)