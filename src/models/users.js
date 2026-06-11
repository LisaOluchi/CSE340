import db from "./db.js";
import bcrypt from "bcryptjs";

async function createUser(email, password) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, (SELECT role_id FROM roles WHERE role_name = $3)) RETURNING user_id, email",
    [email, hashedPassword, "user"],
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
  const result = await db.query(query, [email]);
  return result.rows[0];
}

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
async function getAllUsers() {
  const query = `
        SELECT u.user_id, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.email ASC
    `;
  const result = await db.query(query);
  return result.rows;
}

export { createUser, findUserByEmail, verifyPassword, getAllUsers };
