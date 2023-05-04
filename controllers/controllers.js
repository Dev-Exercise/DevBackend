//Home
exports.home = (req, res) => {
  res.send("hello world get");
};

//Upload CSV File
// exports.uploadCsv = (req, res) => {
//   console.log("File Recieved", req.file);
//   req.pipe(req.busboy);
//   req.busboy.on("file", (fieldname, file, filename) => {
//     file
//       .pipe(csv())
//       .on("data", (data) => {
//         console.log(data);
//         // const record = new YourModel(data);
//         // record.save();
//       })
//       .on("end", () => {
//         res.sendStatus(200);
//       });
//   });
// };

// Set up multer middleware to handle file uploads
