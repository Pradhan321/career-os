import axios from "axios";

export const createUserProfile = async (
  token
) => {
  try {
    await axios.post(
      process.env.USER_SERVICE_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(
      "User Service Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};