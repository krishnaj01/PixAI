export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #266bb6, #2c6eb6); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #266bb6;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>PixAI Team</p>
    <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1736017266/logo_sxzdwi.png" alt="logo" style="width: 200px;">
    </div>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
    <main style="background-color: #f0fdfa;">
        <section style="text-align: center;">
                <div style="width: 100%;">
                    <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1736566137/logo_icon_xpaxtt.png" alt="logo-icon" style="width: 20%; height: auto;">
                    <h1 style="font-weight: 900;">WELCOME TO PIXAI</h1>
                </div>
            <div style="max-width: 700px; margin: auto;">
                <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1735899683/PixAI/wqn2duadde2henqy9jbd.png" alt="welcome-email-image" style="width: 70%; height: auto; border-radius: 5px;">
            </div>
        </section>

        <section>
            <div style="padding: 0 1rem 0 1rem;">
                <p style="font-size: x-large; font-weight: 700; margin-bottom: -0.5rem;">Hi, {name}</p>
                <p><b>Welcome to PixAI 😎</b> &mdash; where your imagination transforms into stunning visuals!</p>
            </div>
            <div style="padding: 0 1rem 1rem 1rem;">
                <p>We're thrilled to have you on board. Here's what you can do with us:</p>
                
                <p style="margin-bottom: -0.75rem;"><span style="font-weight: 700;">🎨 Create Stunning Images</span> &mdash; Generate high-quality visuals with just a few clicks.</p>
                <p style="margin-bottom: -0.75rem;"><span style="font-weight: 700;">✨ Unique Creations</span> &mdash; Craft one-of-a-kind visuals tailored to your ideas.</p>
                <p><span style="font-weight: 700;">🚀 Fast and Easy</span> &mdash; Get professional results in seconds, no design skills needed.</p>
                
                <h2>Get Started in 3 Easy Steps:</h2>
                <p><span style="font-weight: 700;">1. Explore the Community 🌍:</span> Check out examples and find inspiration.</p>
                <p><span style="font-weight: 700;">2. Generate Your First Image 🤩:</span> Use our intuitive interface to bring your ideas to life.</p>
                <p><span style="font-weight: 700;">3. Share Your Creations 🤝:</span> Download and share your masterpiece with the world.</p>
                
                <br>
                <p style="line-height: 0.01;">Happy creating ❤️,</p>
                <p>PixAI Team</p>

                <div style="text-align: center;">
                    <a href="https://pixai-image-generation.onrender.com" target="_blank"
                        style="text-decoration: none;">
                        <div style="display: inline-block; background-color: #266bb6; color: white; padding: 1rem; border-radius: 10px;">
                            Continue to the website
                        </div>
                    </a>
                </div>
                <p style="text-align: center; color: #737373ad; margin-top: 1.5rem;">We hope you enjoy this journey as much as we enjoy creating it for you.</p>
                <div style="text-align: center;">
                    <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1736017266/logo_sxzdwi.png" alt="logo" style="width: 40%; height: auto; margin-top: 1rem;">
                </div>
            </div>
        </section>
    </main>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>PixAI Team</p>
    <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1736017266/logo_sxzdwi.png" alt="logo" style="width: 200px;">
    </div>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #b0296e, #b03776); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #b0296e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>PixAI Team</p>
    <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dbnufnao9/image/upload/v1736017266/logo_sxzdwi.png" alt="logo" style="width: 200px;">
    </div>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;