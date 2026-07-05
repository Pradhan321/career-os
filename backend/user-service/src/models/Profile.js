import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { _id: false }
);
const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    skills: [skillSchema],

    education: [educationSchema],

    experience: [experienceSchema],

    socialLinks: [socialLinkSchema],
  },
  {
    timestamps: true,
  }
);
profileSchema.index({
  "skills.name": 1,
});

profileSchema.index({
  headline: "text",
  bio: "text",
});
const Profile = mongoose.model("Profile", profileSchema);

export default Profile;