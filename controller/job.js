const job = require("../models/job");
const Job = require("../models/job");

const createJobPost = async (req, res, next) => {
  try {
    const currentUserId = req.currentUserId;
    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      aboutCompany,
      skills,
      jobType,
      information,
    } = req.body;

    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !location ||
      !duration ||
      !salary ||
      !jobType ||
      !aboutCompany ||
      !skills ||
      !information
    ) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill all the fields" });
    }
    const jobDetails = new Job({
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      skills,
      jobType,
      information,
      refUserId: currentUserId,
    });

    await jobDetails.save();
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    // res.status(500),json({errorMessage : "Something went wrong"})

    next(error); // ( Global Error Handler Middleware Function ) Take from the Function which is created in the Server.js
  }
};

const getJobDetailsById = async (req, res, next) => {
  try {
    const { jobId } = req.params; // To Copy the Input as Id which is searched by the user.....

    if (!jobId) {
      //then find Id is available or not
      return res.status(400).json({ errorMessage: "Please Enter Valid Id" });
    }

    const jobDetails = await Job.findById(jobId);

    if (!jobDetails) {
      // then find corresponding job according to the given ID  (if not)
      return res.status(404).json({ errorMessage: "Job Not Found" });
    }

    res.json({ jobDetails });
  } catch (error) {
    // res.status(500).json({errorMessage : "Something Error Occurred"})
    next(error); // ( Global Error Handler Middleware Function ) Take from the Function which is created in the Server.js
  }
};

const updateJobDetailsById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const {
      companyName,
      logoUrl,
      title,
      description,
      salary,
      location,
      duration,
      skills,
      jobType,
      information,
    } = req.body;

    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !description ||
      !salary ||
      !location ||
      !duration ||
      !skills ||
      !jobType ||
      !information
    ) {
      return res.status(400).json({ errorMessage: " Data Insufficient" });
    }
    if (!jobId) {
      return res.status(400).json({ errorMessage: "Please enter valid Id" });
    }
    const isJobExists = await Job.findById({ _id: jobId });
    if (!isJobExists) {
      return res.status(400).json({ errorMessage: "Job not Exists" });
    }

    await job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          logoUrl,
          title,
          description,
          salary,
          location,
          duration,
          skills,
          jobType,
          information,
        },
      }
    );
    res.json({ message: "Job Updated Successfully" });
  } catch (error) {
    next(error);
  }
};
const getAllJobs = async (req, res, next) => {
  try {
    const searchQuery = req.query.searchQuery || ""; //This is called QUERY PARAMETER where you can filter which data have to show when a user search about Job....

    const skills = req.query.skills;
    let filteredSkills;
    let filter = {};
    if (skills && skills.length > 0) {
      filteredSkills = skills.split(",");

      const caseInsensitiveSkills = filteredSkills.map(
        (skill) => new RegExp(skill, "i")
      );
      filteredSkills = caseInsensitiveSkills;
      filter = { skills: { $in: filteredSkills } }; //$IN  is search for each of the skills which is given by the user
    }

    const jobList = await job.find(
      // {title : searchQuery} ,  // Whole title have to search here otherwise it will through an error

      { title: { $regex: searchQuery, $options: "i" }, ...filter }, // This is called REGEX where you can search any part of the title...

      { title: 1, companyName: 1, location: 1, jobType: 1, skills: 1 }
    ); //This is called PROJECTION where you can filter which data have to show when a user search about Job....
    res.json({ data: jobList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getJobDetailsById,
  updateJobDetailsById,
  getAllJobs,
};
