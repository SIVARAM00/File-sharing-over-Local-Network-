const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const os = require("os");
const fs = require("fs");

const app = express();
const uploadDir = path.join(__dirname, "uploads");
const CORRECT_PIN = "1234"; // PIN for secure operations
let activeUploads = new Set(); // Track active uploads

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(uploadDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/verify-pin", (req, res) => {
  const { pin } = req.body;
  if (pin === CORRECT_PIN) {
    console.log(`PIN verification from IP: ${req.ip} - Accepted`);
    res.sendStatus(200);
  } else {
    console.log(`PIN verification from IP: ${req.ip} - Rejected`);
    res.sendStatus(403);
  }
});

app.post("/upload", (req, res, next) => {
  upload.array("files")(req, res, (err) => {
    if (err) {
      console.log(`Upload from IP: ${req.ip} - Rejected (Error: ${err})`);
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      console.log(`Upload from IP: ${req.ip} - Rejected (No files)`);
      return res.status(400).json({ error: "No files uploaded." });
    }

    req.files.forEach((file) => activeUploads.delete(file.originalname)); // Mark upload complete
    console.log(
      `Upload from IP: ${req.ip} - Accepted (${req.files.length} files uploaded)`
    );
    res.status(200).json({ message: "Files uploaded successfully!" });
  });
});

app.get("/files", (req, res) => {
  console.log(`Files request from IP: ${req.ip}`);

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads directory:", err);
      return res.status(500).json({ error: "Error reading files." });
    }

    const fileDetails = files
      .filter((file) => !activeUploads.has(file))
      .map((file) => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath); // Get file stats
        const size = stats.size; // File size in bytes
        const fileUrl = `http://${getLocalIP()}:${PORT}/${file}`;
        return { url: fileUrl, size: size };
      });

    res.json(fileDetails); // Send both URL and file size in the response
  });
});

app.delete("/delete", (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    console.log(
      `Delete request from IP: ${req.ip} - Rejected (No filename provided)`
    );
    return res.status(400).json({ error: "Filename is required." });
  }
  if (activeUploads.has(filename)) {
    console.log(
      `Delete request from IP: ${req.ip} - Rejected (File is uploading)`
    );
    return res.status(400).json({ error: "Cannot delete while uploading." });
  }

  const filePath = path.join(uploadDir, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ error: "Error deleting file." });
    }
    console.log(
      `Delete request from IP: ${req.ip} - Accepted (File deleted: ${filename})`
    );
    res.status(200).json({ message: "File deleted successfully!" });
  });
});

app.post("/cancel-upload", (req, res) => {
  const { filename } = req.body;
  if (activeUploads.has(filename)) {
    activeUploads.delete(filename);
    console.log(`Upload cancelled: ${filename}`);
    res.status(200).json({ message: "Upload cancelled." });
  } else {
    res.status(400).json({ error: "No ongoing upload found for this file." });
  }
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at: http://${getLocalIP()}:${PORT}`);
});
