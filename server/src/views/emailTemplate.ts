export const confirmationEmailTemplate = (
  username: string,
  verificationLink: string
) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
          background-color: #4CAF50;
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .content {
          margin: 20px 0;
          color: #333;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          color: #fff;
          background-color: #4CAF50;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
          .or {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome, ${username}!</h1>
        </div>
        <div class="content">
          <p>Thank you for registering. To complete your account setup, please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p class="or">or copy and paste this link into your browser: ${verificationLink}</p>
          </p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
