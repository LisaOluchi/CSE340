import db from './db.js';

async function getAllCategories() {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name ASC
    `);
    return result.rows;
}

async function getCategoryDetails(id) {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        WHERE category_id = $1
    `, [id]);
    return result.rows[0];
}

async function getCategoriesByProject(id) {
    const result = await db.query(`
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
    `, [id]);
    return result.rows;
}

async function getProjectsByCategory(id) {
    const result = await db.query(`
        SELECT sp.project_id, sp.title, sp.date
        FROM service_projects sp
        JOIN project_category pc ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.date ASC
    `, [id]);
    return result.rows;
}

async function createCategory(name) {
    const result = await db.query(
        'INSERT INTO category (name) VALUES ($1) RETURNING category_id',
        [name]
    );
    return result.rows[0].category_id;
}

async function getCategoryById(id) {
    const result = await db.query(
        'SELECT category_id, name FROM category WHERE category_id = $1',
        [id]
    );
    return result.rows[0];
}

async function updateCategory(id, name) {
    const result = await db.query(
        'UPDATE category SET name = $1 WHERE category_id = $2 RETURNING *',
        [name, id]
    );

    if (result.rowCount === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0];
}

export { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, createCategory, getCategoryById, updateCategory };