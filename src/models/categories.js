import db from './db.js';

async function getAllCategories() {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name ASC
    `);
    return result.rows;
}

export { getAllCategories };