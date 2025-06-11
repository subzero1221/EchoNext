import { URL } from "./config";

export async function createCommunity(name, description, type) {
  console.log(name, description, type);

  try {
    const res = await fetch(`${URL}/communities/createCommunity`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, type }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create community");
    }

    const data = await res.json();

    return {
      success: true,
      message: "Community created successfully",
      community: data.newCommunity,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getCommunity(communityId) {
  try {
    const res = await fetch(`${URL}/communities/getCommunity/${communityId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create community");
    }

    const data = await res.json();
    return data.community;
  } catch (err) {
    return null;
  }
}

export async function uploadCommunityPhoto(formData, communityId) {
  console.log(formData);

  try {
    const res = await fetch(
      `${URL}/communities/uploadCommunityPhoto/${communityId}`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();

    return {
      success: true,
      message: "Avatar uploaded successfully",
      community: data.community,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function uploadCommunityCoverPhoto(formData, communityId) {
  console.log(formData);

  try {
    const res = await fetch(
      `${URL}/communities/uploadCommunityCoverPhoto/${communityId}`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to upload avatar");
    }

    const data = await res.json();

    return {
      success: true,
      message: "Avatar uploaded successfully",
      community: data.community,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function joinCommunity(communityId) {
  console.log("Doing Join Leave:", communityId);

  try {
    const res = await fetch(`${URL}/communities/joinCommunity/${communityId}`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to join/leave community");
    }

    const data = await res.json();
    console.log(data);
    return {
      success: true,
      members: data.members,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function leaveCommunity(communityId) {
  console.log("Doing Join Leave:", communityId);

  try {
    const res = await fetch(
      `${URL}/communities/leaveCommunity/${communityId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to join/leave community");
    }

    const data = await res.json();
    console.log(data);
    return {
      success: true,
      members: data.members,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function answerUserRequest(communityId, userId, answer) {
  console.log("Doing Join Leave:", communityId);

  try {
    const res = await fetch(
      `${URL}/communities/answerUserRequest/${communityId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, answer }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to join/leave community");
    }

    const data = await res.json();
    return {
      success: true,
      members: data.members,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function adminAction(communityId, userId, action) {
  console.log("Doing Join Leave:", communityId);

  try {
    const res = await fetch(`${URL}/communities/adminAction/${communityId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, action }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to join/leave community");
    }

    const data = await res.json();
    return {
      success: true,
      members: data.admin,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function removeMember(communityId, userId) {
  console.log("Doing Join Leave:", communityId);

  try {
    const res = await fetch(`${URL}/communities/removeMember/${communityId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to join/leave community");
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

export async function deleteCommunity(communityId) {
  console.log("Deleting community:", communityId);

  try {
    const res = await fetch(
      `${URL}/communities/deleteCommunity/${communityId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete community");
    }

    const data = await res.json();

    return {
      success: true,
      message: data.message,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function addCommunityRule(communityId, rule) {
  try {
    const res = await fetch(
      `${URL}/communities/addCommunityRule/${communityId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rule }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add rule");
    }

    const data = await res.json();
    return {
      success: true,
      message: "Rule added successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function deleteCommunityRule(communityId, ruleIndex) {
  try {
    const res = await fetch(
      `${URL}/communities/deleteCommunityRule/${communityId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruleIndex }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete rule");
    }

    const data = await res.json();
    return {
      success: true,
      message: "Rule deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
