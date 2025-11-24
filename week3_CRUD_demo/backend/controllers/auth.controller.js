const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

// Sign up endpoint
router.post("/signup", async (req, res) => {
  try {
    const { role, ...userData } = req.body;

    if (!role || (role !== "pasien" && role !== "dokter")) {
      return res.status(400).send({ message: "Invalid role specified" });
    }

    // Validate required fields based on role
    if (role === "pasien") {
      const requiredFields = [
        "nama_pasien",
        "tanggal_lahir",
        "jenis_kelamin",
        "alamat",
        "no_telepon",
        "email",
        "password",
      ];
      const missingFields = requiredFields.filter(
        (field) => !userData[field]
      );
      if (missingFields.length > 0) {
        return res.status(400).send({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
    } else if (role === "dokter") {
      const requiredFields = [
        "nama_dokter",
        "spesialisasi",
        "no_telepon",
        "email",
        "password",
      ];
      const missingFields = requiredFields.filter(
        (field) => !userData[field]
      );
      if (missingFields.length > 0) {
        return res.status(400).send({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
    }

    const affectedRows = await authService.signup(userData, role);

    if (affectedRows > 0) {
      res.status(201).send({
        message: `${role === "pasien" ? "Pasien" : "Dokter"} registered successfully`,
      });
    } else {
      res.status(500).send({ message: "Registration failed" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    if (error.message === "Email already exists") {
      res.status(409).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message || "Server error" });
    }
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).send({
        message: "Email, password, and role are required",
      });
    }

    if (role !== "pasien" && role !== "dokter") {
      return res.status(400).send({ message: "Invalid role specified" });
    }

    const result = await authService.login(email, password, role);

    res.status(200).send({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.message === "User not found" || error.message === "Invalid password") {
      res.status(401).send({ message: "Invalid email or password" });
    } else {
      res.status(500).send({ message: error.message || "Server error" });
    }
  }
});

// Verify token endpoint (optional - for checking if user is authenticated)
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decoded = authService.verifyToken(token);
    res.status(200).send({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).send({ valid: false, message: "Invalid token" });
  }
});

// Admin registration endpoint (secret - requires ADMIN_SECRET_KEY)
router.post("/register-admin", async (req, res) => {
  try {
    const { secret_key, nama_resepsionis, email, no_telepon, password } = req.body;

    // Validate secret key
    if (!secret_key || secret_key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).send({ message: "Invalid secret key" });
    }

    // Validate required fields
    const requiredFields = ["nama_resepsionis", "email", "no_telepon", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if admin already exists
    const existingAdmin = await authService.checkAdminExists();
    if (existingAdmin) {
      return res.status(409).send({
        message: "Admin account already exists. Only one admin is allowed.",
      });
    }

    // Register admin
    const result = await authService.registerAdmin({
      nama_resepsionis,
      email,
      no_telepon,
      password,
    });

    if (result.affectedRows > 0) {
      res.status(201).send({
        message: "Admin registered successfully",
      });
    } else {
      res.status(500).send({ message: "Admin registration failed" });
    }
  } catch (error) {
    console.error("Admin registration error:", error);
    if (error.message === "Email already exists" || error.message === "Phone already exists") {
      res.status(409).send({ message: error.message });
    } else {
      res.status(500).send({ message: error.message || "Server error" });
    }
  }
});

// Resepsionis login endpoint (admin logs in here too, but as resepsionis)
router.post("/login-resepsionis", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }

    const result = await authService.loginResepsionis(email, password);

    res.status(200).send({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Resepsionis login error:", error);
    if (error.message === "User not found" || error.message === "Invalid password") {
      res.status(401).send({ message: "Invalid email or password" });
    } else {
      res.status(500).send({ message: error.message || "Server error" });
    }
  }
});

module.exports = router;
