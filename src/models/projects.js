import db from "./db.js";

async function getAllProjects() {
  const result = await db.query(`
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.date ASC
    `);
  return result.rows;
}

async function getUpcomingProjects(number_of_projects) {
  const result = await db.query(
    `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.date >= CURRENT_DATE
        ORDER BY sp.date ASC
        LIMIT $1
    `,
    [number_of_projects],
  );
  return result.rows;
}

async function getProjectDetails(id) {
  const result = await db.query(
    `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1
    `,
    [id],
  );
  return result.rows[0];
}

async function updateProject(
  id,
  { title, description, location, date, organizationId },
) {
  const result = await db.query(
    `UPDATE service_projects 
         SET title = $1, description = $2, location = $3, date = $4, organization_id = $5 
         WHERE project_id = $6
         RETURNING *`,
    [title, description, location, date, organizationId, id],
  );

  if (result.rowCount === 0) {
    throw new Error("Project not found");
  }

  return result.rows[0];
}

async function createProject(
  title,
  description,
  location,
  date,
  organizationId,
) {
  const result = await db.query(
    "INSERT INTO service_projects (title, description, location, date, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING project_id",
    [title, description, location, date, organizationId],
  );
  return result.rows[0].project_id;
}

async function addVolunteer(userId, projectId) {
  const result = await db.query(
    "INSERT INTO user_volunteers (user_id, project_id) VALUES ($1, $2) RETURNING volunteer_id",
    [userId, projectId],
  );
  return result.rows[0];
}

async function removeVolunteer(userId, projectId) {
  const result = await db.query(
    "DELETE FROM user_volunteers WHERE user_id = $1 AND project_id = $2",
    [userId, projectId],
  );
  return result.rowCount > 0;
}

async function checkIfVolunteered(userId, projectId) {
  const result = await db.query(
    "SELECT volunteer_id FROM user_volunteers WHERE user_id = $1 AND project_id = $2",
    [userId, projectId],
  );
  return result.rows.length > 0;
}

async function getUserVolunteerProjects(userId) {
  const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.date, o.name as organization_name
        FROM service_projects sp
        JOIN user_volunteers uv ON sp.project_id = uv.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE uv.user_id = $1
        ORDER BY sp.date ASC
    `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

export {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  updateProject,
  createProject,
  addVolunteer,
  removeVolunteer,
  checkIfVolunteered,
  getUserVolunteerProjects,
};
