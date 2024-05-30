require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/job")
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());


app.get("/health", (req, res) => {
  res.json({
    status: "active",
    Service: "Backend job listing API server",
    time: new Date(),
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", jobRoute);

app.use((error , req , res , next) => {  // Function to Show 'error' with less code... 
  console.log(error)
  res.status(500).json({errorMessage : "Something Went Wrong"})
})

//www.health.com
//www.health.com / about
//www.health.com / api / v1     //api means simply backend and v1 means Version 1

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.log("DB failed to connect", error);
  });

const PORT = process.env.PORT //5000;

app.listen(PORT, () => {
  console.log(`Server is running in the PORT`);
});
