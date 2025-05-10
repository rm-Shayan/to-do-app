import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
} from "./firebase.js";

// ✅ Auth state check (NO REDIRECT after signup)
const checkUserLogin = () => {
  onAuthStateChanged(auth, (user) => {
    const isSignUp = sessionStorage.getItem("signedUp"); // 🚫 Skip redirect if just signed up

    if (user) {
      console.log("✅ User login:", user.uid);

      if (!isSignUp && !window.location.pathname.endsWith("index.html")) {
        window.location.href = "../index.html";
      }

      sessionStorage.removeItem("signedUp"); // Clear after use
    } else {
      console.log("⚠️ User signed out");
      if (!window.location.pathname.endsWith("auth.html")) {
        window.location.href = "../auth.html";
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  checkUserLogin();

  const signUpForm = document.getElementById("auth-form-sign-up");
  const loginForm = document.getElementById("auth-form-login");
  const loginTab = document.getElementById("login-tab");
  const signUpTab = document.getElementById("signup-tab");

  // 🧾 Toggle Login / Signup Form
  if (signUpTab && loginForm && loginTab && signUpForm) {
    signUpTab.addEventListener("click", () => {
      signUpForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });

    loginTab.addEventListener("click", () => {
      signUpForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    });
  }

  // ✅ Handle Sign Up
  signUpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("UserName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const password = document.getElementById("userPassword").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match.");
      return;
    }

    try {
      // 🚫 Set flag to skip redirect
      sessionStorage.setItem("signedUp", "true");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ User created:", user.uid);

      // 💾 Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      console.log("✅ User data saved to Firestore");

      alert("🎉 Signup successful!");

      // Switch to login form after signup
      signUpForm.reset();
      signUpForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    } catch (error) {
      console.error("❌ Signup Error:", error);
      alert("❌ Sign up error: " + error.message);
    }
  });

  // ✅ Handle Login
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
  window.location.href = location.origin + "/todo-app/index.html"
    } catch (error) {
      alert("❌ Login error: " + error.message);
    }
  });
});

export default checkUserLogin;
