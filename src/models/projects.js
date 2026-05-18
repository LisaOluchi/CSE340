import db from './db.js';

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

export { getAllProjects };