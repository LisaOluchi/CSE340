import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import { testConnection } from "./src/models/db.js";
import { getUserVolunteerProjects } from "./src/models/projects.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
  showEditProjectForm,
  processEditProjectForm,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  volunteerForProject,
  removeVolunteerFromProject,
} from "./src/controllers/projects.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
} from "./src/controllers/organizations.js";
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
} from "./src/controllers/categories.js";

import {
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation,
} from "./src/controllers/organizations.js";
import {
  showRegisterPage,
  processRegister,
  showLoginPage,
  processLogin,
  logout,
  registerValidation,
  loginValidation,
  requireRole,
  showUsersPage,
} from "./src/controllers/users.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to do that");
    return res.redirect("/login");
  }
  next();
};

// Then use it on your volunteer routes
app.post("/volunteer/:id", requireLogin, volunteerForProject);
app.post("/unvolunteer/:id", requireLogin, removeVolunteerFromProject);

// Middleware to set res.locals variables for all templates
app.use((req, res, next) => {
  res.locals.isLoggedIn = false;
  res.locals.user = null;

  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
    res.locals.user = req.session.user;
  }

  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Middleware to log all requests
app.use((req, res, next) => {
  if (NODE_ENV === "development") {
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
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

/**
 * Routes
 */
// PUBLIC ROUTES (no protection needed)
app.get("/", async (req, res) => {
  let volunteeredProjects = [];

  if (req.session && req.session.user) {
    volunteeredProjects = await getUserVolunteerProjects(
      req.session.user.user_id,
    );
  }

  res.render("home", {
    title: "Home",
    volunteeredProjects,
  });
});
app.get("/organizations", showOrganizationsPage);
app.get("/organization/:id", showOrganizationDetailsPage);
app.get("/projects", showProjectsPage);
app.get("/project/:id", showProjectDetailsPage);
app.get("/categories", showCategoriesPage);
app.get("/category/:id", showCategoryDetailsPage);

// AUTHENTICATION ROUTES
app.get("/register", showRegisterPage);
app.post("/register", registerValidation, processRegister);
app.get("/login", showLoginPage);
app.post("/login", loginValidation, processLogin);
app.get("/logout", logout);

// ADMIN-ONLY ROUTES (protected)
app.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
app.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
app.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);
app.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);

app.get("/new-project", requireRole("admin"), showNewProjectForm);
app.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);
app.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
app.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);

app.get("/new-category", requireRole("admin"), showNewCategoryForm);
app.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);
app.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
app.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  processEditCategoryForm,
);

// Users page (admin only)
app.get("/users", requireRole("admin"), showUsersPage);

// Catch-all 404 handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).render("error", {
    title: "Error",
    message:
      status === 404
        ? "The page you requested does not exist."
        : "An unexpected error occurred.",
    status,
  });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
