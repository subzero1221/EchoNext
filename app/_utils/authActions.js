import { URL } from "./config";

export async function signup(formData) {
  const { email, nickName, password, passwordConfirm } = formData;

  try {
    const res = await fetch(`${URL}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        nickName,
        password,
        passwordConfirm,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return errorData;
    }

    const data = await res.json();

    return {
      success: true,
      message: "Signup successful",
      user: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function signin(formData) {
  const { identifier, password } = formData;

  try {
    const res = await fetch(`${URL}/auth/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to sign in");
    }

    const data = await res.json();
    console.log("Runs on client side!");
    return {
      success: true,
      message: "Signin successful",
      user: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await fetch(`${URL}/auth/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await res.json();

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function resetPassword(resetToken, password, passwordConfirm) {
  try {
    const res = await fetch(`${URL}/auth/resetPassword/${resetToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        passwordConfirm,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await res.json();

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
