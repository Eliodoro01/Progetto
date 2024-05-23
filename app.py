import secrets
import codecs
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory

# Importing the User model and database functions
from moduliPy.dbUser import db, User, get_reset_token

import requests
import os
from flask import Flask, redirect, request, session

import stripe

# Set the Stripe API key for testing
stripe.api_key = 'sk_test_51OHq8tJttODyNVO7oKk23ZAKUeRQUJPEzZdpxCHigO2hNGRrqgE8gIBITzJ0mOggwNoasym8dfq6EaKyMgFmGjL6008XPIXI30'

# Define the domain for redirect URLs
YOUR_DOMAIN = 'http://localhost:5000'

# Create a Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'ofamoperilmeme'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///utenti.db'
db.init_app(app)


# Function to check if a user is authenticated
def is_authenticated():
    return 'user' in session


# Route for the home page
@app.route("/home", methods=("GET", "POST"))
def home():
    # Check if the user is authenticated
    if is_authenticated():
        return render_template("index.html")
    else:
        flash('Please log in first.', 'danger')
        return redirect('/login')


# Default route, renders the registration page
@app.route("/")
def index():
    return render_template("registrazione.html")


# Login route
@app.route("/login", methods=("GET", "POST"))
def login():
    if request.method == 'POST':
        # Get user input from the login form
        email = request.form.get('email')
        password = request.form.get('password')

        # Query the database for the user with the provided email
        user = User.query.filter_by(email=email).first()

        # Check if the user exists and the password is correct
        if user and user.check_password(password):
            flash('Login successful!', 'success')
            # Store the user's email in the session to maintain login state
            session['user'] = user.email
            return render_template('index.html')
        else:
            flash('Invalid credentials. Please try again.', 'danger')

    return render_template('login.html')


# Logout route
@app.route("/logout", methods=("GET", "POST"))
def logout():
    # Remove user from the session to log out
    session.pop('user', None)
    return render_template('login.html')


# Signup route
@app.route("/signup", methods=("GET", "POST"))
def signup():
    if request.method == 'POST':
        # Get user input from the registration form
        username = request.form.get("name")
        last_name = request.form.get("last_name")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # Check if the username or email is already in use
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            flash('Username or email already in use. Please choose a different one.', 'danger')
        else:
            # Check if the passwords match
            if password == confirm_password:
                # Create a new user and add it to the database
                new_user = User(
                    username=username,
                    last_name=last_name,
                    email=email,
                    token=secrets.token_urlsafe(16)
                )
                new_user.set_password(password)
                db.session.add(new_user)
                db.session.commit()
                db.session.close()
                return render_template('login.html')
            else:
                flash("Passwords do not match.")
    return render_template("registrazione.html")


# Forgot password route
@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        # Get user input from the forgot password form
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        if user:
            # Generate a reset token and create a reset link
            token = get_reset_token(email)
            reset_link = url_for('reset_password', token=token, _external=True)

            # Email setup
            sender = "lorenzo_noreply@metromasters.com"
            subject = "RESET PASSWORD"
            message = MIMEMultipart()
            message['From'] = sender
            message['To'] = email
            message['Subject'] = subject
            body = f'''
                   To reset your password, visit the following link:
                   {reset_link}

                   If you did not make this request, simply ignore this email, and no changes will be made.
                   '''
            message.attach(MIMEText(body, 'plain'))
            try:
                # Send the reset email using SMTP
                with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
                    server.starttls()
                    server.login("a8cdff5db6c18c", "ddceca889e7d43")
                    server.sendmail(sender, "email", message.as_string())
                flash(f"{user} check your email")
            except Exception as e:
                flash(f"Error sending email: {e}")
        else:
            flash("User not found in the database")
            return render_template('registrazione.html')
    return render_template('forgot_password.html')


# Reset password route
@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    return render_template('reset_password.html', token=token)


# Apply reset password route
@app.route('/apply_reset_password/<token>', methods=['GET', 'POST'])
def apply_reset_password(token):
    user = User.query.filter_by(token=token).first()
    try:
        if user:
            # Get the new password from the form and update the user's password
            password = request.form.get('password')
            user.set_password(password)
            user.update_token()
            db.session.commit()
            flash('Your password has been reset.', 'success')
            return redirect('/login')
        else:
            flash("Token expired")
            return render_template('reset_password.html', token=token)
    except Exception as e:
        flash(f"Generic error - please retry password recovery: {e}")
        return render_template('reset_password.html', token=token)


# Ticket route
@app.route('/ticket', methods=['GET', 'POST'])
def ticket():
    return render_template('checkout2.html')


# Create checkout session route
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        # Create a checkout session using the Stripe API
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID of the product to sell
                    'price': 'price_1OHrJMJttODyNVO7c8dsfeFs',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success',
            cancel_url=YOUR_DOMAIN + '/cancel',
            #             success_url= 'https://m2q2ls8m-5000.euw.devtunnels.ms/success',
            #             cancel_url= 'https://m2q2ls8m-5000.euw.devtunnels.ms/cancel',
        )
    except Exception as e:
        return str(e)

    # Redirect to the Stripe checkout page
    return redirect(checkout_session.url, code=303)


# Success route
@app.route('/success')
def success():
    return render_template('success.html')


# Cancel route
@app.route('/cancel')
def cancel():
    return render_template('cancel.html')


# Display station route
@app.route('/station')
def display_station():
    return render_template('display_station.html')


# Route for searching a station
@app.route('/ricercaStazione', methods=['GET', 'POST'])
def ricerca_stazione():
    return render_template('ArrivalsDepartures.html')


@app.route('/sw')
def sw():
    return send_from_directory('static', 'sw.js')


# Run the application
if __name__ == '__main__':
    app.run(debug=True)
