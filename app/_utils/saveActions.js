import { URL } from "./config";

export async function savePost(postId) {
  try {
    const res = await fetch(`${URL}/saves/savePost/${postId}`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();
    console.log(data);

    return {
      success: true,
      savedPost: data.savedPost,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getSavedPosts() {
  console.log("Getting saved posts");
  try {
    const res = await fetch(`${URL}/saves/getSavedPosts`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const savedPosts = data.savedPosts;
    console.log(savedPosts);
    return savedPosts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function sharePost(postId) {
  try {
    const res = await fetch(`${URL}/shares/sharePost/${postId}`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();
    console.log(data);

    return {
      success: true,
      sharedPost: data.sharedPost,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getSharedPosts() {
  try {
    const res = await fetch(`${URL}/shares/getSharedPosts`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const sharedPosts = data.sharedPosts;
    console.log(sharedPosts);
    return sharedPosts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function deleteMyWallPost(postId, type) {
  try {
    const res = await fetch(
      `${URL}/${type}s/delete${
        type.charAt(0).toUpperCase() + type.slice(1)
      }/${postId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();
    console.log(data);

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
