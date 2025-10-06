import { URL } from "./config";

export async function sendFriendRequest(recipientId) {
  try {
    const res = await fetch(`${URL}/friends/sendFriendRequest/${recipientId}`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send friend request");
    }

    const data = await res.json();
    console.log(data);

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

export async function getRelationship(recipientId) {
  try {
    const res = await fetch(`${URL}/friends/getRelationship/${recipientId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to get relationship");
    }

    const data = await res.json();

    return {
      success: true,
      relationship: data.relationship,
      relationshipType: data.relationshipType,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function acceptFriendRequest(requesterId) {
  try {
    const res = await fetch(
      `${URL}/friends/acceptFriendRequest/${requesterId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send friend request");
    }

    const data = await res.json();
    console.log(data);

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

export async function declineFriendRequest(requesterId) {
  try {
    const res = await fetch(
      `${URL}/friends/declineFriendRequest/${requesterId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send friend request");
    }

    const data = await res.json();
    console.log(data);

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

export async function getFriends() {
  try {
    const res = await fetch(`${URL}/friends/getFriends`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to get relationship");
    }

    const data = await res.json();
    return data.myFriends;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
