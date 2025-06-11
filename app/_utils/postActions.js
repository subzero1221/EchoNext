import { URL } from "./config";

export async function createPost(formData) {
  console.log(formData);

  try {
    const res = await fetch(`${URL}/posts/createPost`, {
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
      post: data.newPost,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getPosts(authToken) {
  try {
    const encodedToken = encodeURIComponent(authToken); // Re-encode the token
    const res = await fetch(`${URL}/posts/getPosts`, {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${encodedToken}`, // Send the encoded token
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const posts = data.posts;
    console.log(posts);
    return posts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getCommunityPosts(communityId) {
  try {
    const res = await fetch(`${URL}/posts/getCommunityPosts/${communityId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const posts = data.filtredPosts;
    console.log(posts);
    return posts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getPost(authToken, postId) {
  try {
    const encodedToken = encodeURIComponent(authToken); // Re-encode the token
    const res = await fetch(`${URL}/posts/getPosts/${postId}`, {
      method: "GET",
      headers: {
        Cookie: `connect.sid=${encodedToken}`, // Send the encoded token
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const post = data.posts;
    return post;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getComments(postId) {
  try {
    const res = await fetch(`${URL}/comments/getComments/${postId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const data = await res.json();
    return data.comments;
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    throw new Error(err.message || "An error occurred"); // 🔥 Throw instead of return
  }
}

export async function deletePost(postId) {
  try {
    const res = await fetch(`${URL}/posts/deletePost/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const message = data.message;
    return {
      success: true,
      message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getComment(commentId) {
  try {
    const res = await fetch(`${URL}/comments/getComment/${commentId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const data = await res.json();
    return data.comment;
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    throw new Error(err.message || "An error occurred"); // 🔥 Throw instead of return
  }
}

export async function addComment(postId, content) {
  try {
    const res = await fetch(`${URL}/comments/addComment/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    console.log("newComment:", data);
    const comment = data.newComment;
    return comment;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function deleteComment(commentId, userId) {
  console.log("deliting comment:", commentId, userId);
  try {
    const res = await fetch(`${URL}/comments/deleteComment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const message = data.message;
    return message;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function handleVote(postId, vote) {
  console.log("Registring vote:", postId, vote);
  try {
    const res = await fetch(`${URL}/posts/handleVotes/${postId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vote }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const post = data.votedPost;
    return post;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function addReply(commentId, content) {
  try {
    const res = await fetch(`${URL}/replies/addReply/${commentId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    console.log("newComment:", data);
    const reply = data.newReply;
    return reply;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getReplies(commentId) {
  try {
    const res = await fetch(`${URL}/replies/getReplies/${commentId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const data = await res.json();
    return data.replies;
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    throw new Error(err.message || "An error occurred"); // 🔥 Throw instead of return
  }
}

export async function deleteReply(replyId, userId) {
  console.log("deliting comment:", replyId, userId);
  try {
    const res = await fetch(`${URL}/replies/deleteReply/${replyId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const message = data.message;
    return message;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function handleCommenteVote(commentId, vote) {
  console.log("Registring vote:", commentId, vote);
  try {
    const res = await fetch(`${URL}/comments/handleVotes/${commentId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vote }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const comment = data.votedComment;
    return comment;
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function addReaction(postId, type) {
  console.log("Registring react:", postId, type);
  try {
    const res = await fetch(`${URL}/reactions/addReaction/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const reactions = data.reactions;
    return reactions;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getReactions(postId) {
  try {
    const res = await fetch(`${URL}/reactions/getReactions/${postId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const data = await res.json();

    return data.reactions;
  } catch (err) {
    console.error("Error fetching reactions:", err.message);
    throw new Error(err.message || "An error occurred");
  }
}

export async function getTopics(timeframe) {
  try {
    console.log("Fetching topics");
    const res = await fetch(`${URL}/posts/getTopics?timeframe=${timeframe}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const posts = data.posts;
    return posts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getFiltredPosts(category, tags, page, sortBy) {
  try {
    console.log("Fetching filtred posts:", category, tags);
    const res = await fetch(
      `${URL}/posts/getFiltredPosts?category=${category}&tags=${tags}&page=${page}&sortBy=${sortBy}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await res.json();
    const posts = data.posts;
    console.log("Filtred posts", posts);
    return posts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getMostUsedTags() {
  try {
    const res = await fetch(`${URL}/posts/popularTags`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch Tags");
    }

    const data = await res.json();
    const tags = data.tags;
    return tags;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getPendingCommunityPosts(communityId) {
  try {
    const res = await fetch(
      `${URL}/posts/getPendingCommunityPosts/${communityId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch Tags");
    }

    const data = await res.json();
    const pendingPosts = data.pendingPosts;
    return pendingPosts;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function approvePost(postId, communityId) {
  try {
    const res = await fetch(`${URL}/posts/approvePost/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ communityId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to approve post");
    }

    const data = await res.json();
    return {
      success: true,
      message: "Post approved successfully",
      post: data.post,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function declinePost(postId, communityId) {
  try {
    const res = await fetch(`${URL}/posts/declinePost/${postId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ communityId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to decline post");
    }

    const data = await res.json();
    return {
      success: true,
      message: "Post declined successfully",
      post: data.post,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
