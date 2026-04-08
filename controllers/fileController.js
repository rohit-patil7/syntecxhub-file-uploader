const mongoose = require("mongoose");
const multer = require("multer");

//  Multer config 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("image")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Images allowed"));
    }
  }
});

// Upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "uploads" }
    );

    const stream = bucket.openUploadStream(req.file.originalname);
    stream.end(req.file.buffer);

    stream.on("finish", () => {
      res.json({
        message: "File uploaded successfully",
        filename: stream.filename,
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all files
const getFiles = async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "uploads" }
  );

  const files = await bucket.find().toArray();
  res.json(files);
};

//  Download
const getFile = async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "uploads" }
  );

  try {
    const files = await bucket
      .find({ filename: req.params.filename })
      .toArray();

    if (!files[0]) {
      return res.status(404).json({ message: "File not found" });
    }

    const stream = bucket.openDownloadStreamByName(
      req.params.filename
    );

    stream.pipe(res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
const deleteFile = async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "uploads" }
  );

  try {
    const file = await bucket
      .find({ filename: req.params.filename })
      .toArray();

    if (!file[0]) {
      return res.status(404).json({ message: "File not found" });
    }

    await bucket.delete(file[0]._id);

    res.json({ message: "File deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upload,
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
};