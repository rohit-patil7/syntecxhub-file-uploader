const express = require("express");
const router = express.Router();

const {
  upload,
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
} = require("../controllers/fileController");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.get("/:filename", getFile);
router.delete("/:filename", deleteFile);

module.exports = router;