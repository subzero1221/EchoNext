import { URL } from "./config";

export async function updateProfileData(email, nickName) {
  console.log(email, nickName);

  try {
    const res = await fetch(`${URL}/users/updateProfileData`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        nickName,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update profile data");
    }

    const data = await res.json();

    return {
      success: true,
      message: "Profile data updated succesfully",
      user: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function updatePassword(pass) {
  const { curPassword, newPassword, newPasswordConfirm } = pass;

  try {
    const res = await fetch(`${URL}/users/updatePassword`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        curPassword,
        newPassword,
        newPasswordConfirm,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return errorData.message;
    }

    const data = await res.json();

    return {
      success: true,
      message: "Password updated succesfully",
      user: data.user,
    };
  } catch (err) {
    console.log(res);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function uploadUserAvatar(formData) {
  console.log(formData);

  try {
    const res = await fetch(`${URL}/users/uploadUserAvatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();

    return {
      success: true,
      message: "Avatar uploaded successfully",
      user: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getUserCommunities() {
  try {
    const res = await fetch(`${URL}/users/getUserCommunities`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create community");
    }

    const data = await res.json();

    return data.communities;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getUserData(userId) {
  try {
    const res = await fetch(`${URL}/users/${userId}/getUserData`, {});

    if (!res.ok) {
      throw new Error("Failed to fetch user Data");
    }
    const data = await res.json();
    return {
      communities: data.communitiesWithImages,
      userData: data.userWithImage,
    };
  } catch (err) {
    console.error("Error fetching user Data:", err);
    return [];
  }
}

export async function getUserPosts(userId) {
  try {
    const res = await fetch(`${URL}/users/${userId}/posts`, {});

    if (!res.ok) {
      throw new Error("Failed to fetch user posts");
    }

    const data = await res.json();
    return data.filtredPosts;
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return [];
  }
}

export async function getUserShares(userId) {
  try {
    const res = await fetch(`${URL}/users/${userId}/shares`, {});

    if (!res.ok) {
      throw new Error("Failed to fetch user shares");
    }

    const data = await res.json();
    return data.sharedPostsWithImage;
  } catch (err) {
    console.error("Error fetching user shares:", err);
    return [];
  }
}

export async function getUserComments(userId) {
  try {
    const res = await fetch(`${URL}/users/${userId}/comments`, {});

    if (!res.ok) {
      throw new Error("Failed to fetch user comments");
    }

    const data = await res.json();
    return data.comments;
  } catch (err) {
    console.error("Error fetching user comments:", err);
    return [];
  }
}
