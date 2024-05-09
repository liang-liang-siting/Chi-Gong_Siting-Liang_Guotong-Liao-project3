# Password Manager App

**This Password Manager App is designed to help users track, generate, and share passwords securely. As cybersecurity becomes increasingly important, managing passwords is essential for protecting sensitive information.**

## Features

- **User Authentication:** Users can register and log in securely to access their password manager.
  
- **Password Management:** Users can store, update, and delete passwords associated with different websites or services.

- **Password Generation:** Users can generate secure passwords with customizable criteria such as length, alphabets, numerals, and symbols.

- **Sharing Passwords:** Users can securely share passwords with trusted individuals in case of emergencies.

- **Data Encryption:** User data is encrypted in the database to add an extra level of security.

- **Easy Copy to Clipboard:** Each password has a button next to it that allows users to copy the password to the clipboard.

- **Visually Obscured Passwords:** Passwords are visually obscured on the password manager page. When the user presses the password or a nearby button, it reveals the password.

- **Password Search:** Users can search for passwords by service/domain name using a search bar at the top of the page.

- **Cryptographically Secure Passwords:** Password generation is cryptographically secure, ensuring stronger password generation compared to using Math.random.

## How to Use

1. **Register/Login:** Users can create a new account or log in with existing credentials.
  
2. **Password Manager:** Once logged in, users are directed to the password manager page where they can:
   - Add new passwords by providing a URL and password or generating a random password.
   - View and manage existing passwords.
   - Share passwords securely with other users.

3. **Navbar:** The navbar provides easy navigation throughout the app, including links to the home page, login/register, and user-specific actions.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** bcrypt for password encryption
- **Deployment:** Render, Heroku, or similar platforms

## Setup

1. **Clone the Repository:**
git clone https://github.com/your-username/password-manager.git

2. **Install Dependencies:**
cd password-manager
npm install

3. **Start the Server:**
npm start
4. **Access the App:**
Open your web browser and navigate to `http://localhost:3000`

## Contributors

- [Siting Liang](https://github.com/liang-liang-siting) 
  - Frontend development (login/register and home page)
  - Backend development (password manager page)
  - Database management
  - UI design

- [Guotong Liao](https://github.com/GlintonLiao)
  - Share password function
  - Backend development
  - Database management
  - UI design
  - Debugging

- [Chi Gong](https://github.com/Kevin990001) 
  - Testing
