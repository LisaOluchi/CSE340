import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { testConnection } from './src/models/db.js';
import { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm } from './src/controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './src/controllers/organizations.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './src/controllers/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Middleware to log all requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

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
app.get('/edit-project/:id', showEditProjectForm);
app.post('/edit-project/:id', processEditProjectForm);
app.get('/categories', showCategoriesPage);
app.get('/category/:id', showCategoryDetailsPage);
app.get('/new-category', showNewCategoryForm);
app.post('/new-category', categoryValidation, processNewCategoryForm);
app.get('/edit-category/:id', showEditCategoryForm);
app.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

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