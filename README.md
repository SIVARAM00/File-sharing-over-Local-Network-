# File-sharing-over-Local-Network
File Sharing Web Application

A simple web-based file-sharing application using **Node.js, Express, and Multer** for file uploads and management.

## Features
- Secure file uploads with PIN verification
- File listing with size information
- Download and delete options for uploaded files
- Progress bar for upload tracking
- Ability to cancel uploads
- Responsive UI for different screen sizes

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Steps to Install
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/video-sharing.git
   cd video-sharing
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
4. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Usage

### Uploading Files
1. Click on the **Upload Files** button.
2. Enter the PIN when prompted (default is `1234`).
3. Select files and confirm the upload.
4. Track the upload progress using the progress bar.

### Downloading Files
1. Files uploaded will be listed in the table.
2. Click on the **Download** link to download a file.

### Deleting Files
1. Click the **Delete** button next to the file.
2. Enter the PIN for confirmation.
3. The file will be removed from the server.

## Project Structure
```
video-sharing/
│── uploads/          # Uploaded files storage
│── server.js         # Express server
│── package.json      # Project dependencies
│── index.html        # Frontend UI
│── README.md         # Documentation
```

## Dependencies
- **Express**: Web framework for Node.js
- **Multer**: Middleware for handling file uploads
- **CORS**: Enables Cross-Origin Resource Sharing
- **Nodemon**: Auto-restart server on file changes (for development)

## Customization
### Changing the PIN
To change the PIN for file operations, update the `CORRECT_PIN` value in `server.js`:
```js
const CORRECT_PIN = "your_new_pin";
```

### Changing the Port
Modify the `PORT` variable in `server.js`:
```js
const PORT = 5000; // Change to your preferred port
```


## Contributions
Feel free to fork this repository and submit pull requests for improvements!

## Contact
For any questions or suggestions, please open an issue on GitHub.

