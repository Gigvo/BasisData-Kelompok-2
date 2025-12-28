const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign up new user (Pasien or Dokter)
module.exports.signup = async (userData, role) => {
  const { email, password, no_telepon } = userData;

  try {
    // Check if email already exists in the respective table
    let checkQuery;
    if (role === "pasien") {
      checkQuery = "SELECT email FROM pasien WHERE email = ?";
    } else if (role === "dokter") {
      checkQuery = "SELECT email FROM dokter WHERE email = ?";
    } else {
      throw new Error("Invalid role");
    }

    const [existingUsers] = await db.query(checkQuery, [email]);
    if (existingUsers.length > 0) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into respective table
    if (role === "pasien") {
      const [[[{ affectedRows }]]] = await db.query(
        "CALL pasien_add_or_edit(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          0, // id = 0 for new record
          userData.nama_pasien,
          userData.tanggal_lahir,
          userData.jenis_kelamin,
          userData.alamat,
          no_telepon,
          email,
          hashedPassword,
        ]
      );
      return affectedRows;
    } else if (role === "dokter") {
      const [[[{ affectedRows }]]] = await db.query(
        "CALL dokter_add_or_edit(?, ?, ?, ?, ?, ?)",
        [
          0, // id = 0 for new record
          userData.nama_dokter,
          userData.spesialisasi,
          no_telepon,
          email,
          hashedPassword,
        ]
      );
      return affectedRows;
    }
  } catch (error) {
    throw error;
  }
};

// Login user (Pasien or Dokter)
module.exports.login = async (email, password, role) => {
  try {
    let query;
    let idField;
    let nameField;

    if (role === "pasien") {
      query = "SELECT * FROM pasien WHERE email = ?";
      idField = "pasien_id";
      nameField = "nama_pasien";
    } else if (role === "dokter") {
      query = "SELECT * FROM dokter WHERE email = ?";
      idField = "dokter_id";
      nameField = "nama_dokter";
    } else {
      throw new Error("Invalid role");
    }

    const [users] = await db.query(query, [email]);

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user[idField],
        email: user.email,
        role: role,
        name: user[nameField],
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user[idField],
        name: user[nameField],
        email: user.email,
        role: role,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Verify token
module.exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Check if admin already exists
module.exports.checkAdminExists = async () => {
  try {
    const [admins] = await db.query(
      "SELECT resepsionis_id FROM resepsionis WHERE is_admin = TRUE LIMIT 1"
    );
    return admins.length > 0;
  } catch (error) {
    throw error;
  }
};

// Register admin (resepsionis with is_admin = true)
module.exports.registerAdmin = async (userData) => {
  const { nama_resepsionis, email, no_telepon, password } = userData;

  try {
    // Check if email already exists
    const [existingEmail] = await db.query(
      "SELECT email FROM resepsionis WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      throw new Error("Email already exists");
    }

    // Check if phone already exists
    const [existingPhone] = await db.query(
      "SELECT no_telepon FROM resepsionis WHERE no_telepon = ?",
      [no_telepon]
    );
    if (existingPhone.length > 0) {
      throw new Error("Phone already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin resepsionis
    const [result] = await db.query(
      "INSERT INTO resepsionis (nama_resepsionis, email, no_telepon, password, is_admin) VALUES (?, ?, ?, ?, TRUE)",
      [nama_resepsionis, email, no_telepon, hashedPassword]
    );

    return { affectedRows: result.affectedRows };
  } catch (error) {
    throw error;
  }
};

// Login resepsionis (includes admin)
module.exports.loginResepsionis = async (email, password) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM resepsionis WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate JWT token with admin status
    const token = jwt.sign(
      {
        id: user.resepsionis_id,
        email: user.email,
        role: "resepsionis",
        name: user.nama_resepsionis,
        isAdmin: user.is_admin === 1 || user.is_admin === true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.resepsionis_id,
        name: user.nama_resepsionis,
        email: user.email,
        role: "resepsionis",
        isAdmin: user.is_admin === 1 || user.is_admin === true,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Delete all admin accounts (for reset purposes)
module.exports.deleteAllAdmins = async () => {
  try {
    const [result] = await db.query(
      "DELETE FROM resepsionis WHERE is_admin = TRUE"
    );

    return {
      deletedCount: result.affectedRows
    };
  } catch (error) {
    throw error;
  }
};
