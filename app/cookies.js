"use client";
import Cookies from "js-cookie";

// Function to save object to cookie, updating if video_id already exists
export const saveObjectToCookie = (data, cookie_name) => {
  // Get existing cookie data
  const existingData = getObjectFromCookie(cookie_name) || [];

  // Check if the video_id already exists in the existing data
  const index = existingData.findIndex(
    (item) => item.video_id === data.video_id,
  );

  if (index !== -1) {
    // Update the existing object
    existingData[index] = data;
  } else {
    // Append the new data
    existingData.push(data);
  }

  // Save updated data back to cookie
  Cookies.set(cookie_name, JSON.stringify(existingData), { expires: 365 }); // Cookie expires in 365 days
};

export const getObjectFromCookie = (cookie_name) => {
  const cookieData = Cookies.get(cookie_name);
  console.log(cookieData);
  return cookieData ? JSON.parse(cookieData) : null;
};

export const clearCookie = (cookie_name) => {
  Cookies.remove(cookie_name);
};
