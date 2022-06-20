const express = require("express");
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const fileFilter = (req, file, cb) => {
  console.log("filefilter executed");
  if (file.mimetype === "video/mp4" || file.mimetype === "video/mpeg") {
    cb(null, true);
  } else {
    console.log("image type incorrect");
    cb("only Video files is allowed", false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        err,
      });
    }
    return res.json({
      success: true,
      filepath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/uploadThumbnail", (req, res) => {
  const fileFilterThumbnail = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/apng" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      console.log("image type incorrect");
      cb("Sorry bruh You cant have a **not image** thumbnail(for now)*", false);
    }
  };
  const storageThumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Uploads/thumbnails/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + file.originalname;
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  const uploadThumbnail = multer({
    storage: storageThumbnail,
    fileFilter: fileFilterThumbnail,
  }).single("file");

  uploadThumbnail(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        err,
      });
    }
    return res.json({
      success: true,
      filepath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  let Thumbsfilepath = [];
  let fileDuration = "";

  ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      for (names in filenames) {
        Thumbsfilepath.push("Uploads/thumbnails/" + filenames[names]);
      }
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        Thumbsfilepath: Thumbsfilepath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: "Uploads/thumbnails",
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
