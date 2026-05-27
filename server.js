import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { showProjectsPage, showProjectDetailsPage } from './src/controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './src/controllers/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage } from './src/controllers/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', (req, res) => res.render('home', { title: 'Home' }));
app.get('/organizations', showOrganizationsPage);
app.get('/organization/:id', showOrganizationDetailsPage);
app.get('/projects', showProjectsPage);
app.get('/project/:id', showProjectDetailsPage);
app.get('/categories', showCategoriesPage);
app.get('/category/:id', showCategoryDetailsPage);

// Catch-all 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).render('error', {
        title: 'Error',
        message: status === 404 ? 'The page you requested does not exist.' : 'An unexpected error occurred.',
        status
    });
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});