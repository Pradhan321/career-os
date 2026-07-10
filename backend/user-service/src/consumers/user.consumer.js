import Profile from "../models/Profile.js";

export const handleUserCreated = async (data) => {

  console.log("📩 Event Received:", data);

  const exists = await Profile.findOne({
    userId: data.userId,
  });

  if (exists) {
    console.log("Profile already exists");
    return;
  }

  await Profile.create({
    userId: data.userId,
    name: data.name,
    email: data.email,
  });

  console.log("✅ Profile Created");
};