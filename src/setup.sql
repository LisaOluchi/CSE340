-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- Service Projects Table
-- ========================================
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(1, 'Food Drive', 'Collecting canned goods for families in need', 'Community Center', '2026-06-01'),
(1, 'Park Cleanup', 'Beautifying local parks', 'Riverside Park', '2026-06-15'),
(1, 'Tutoring Program', 'After-school tutoring for kids', 'Lincoln Elementary', '2026-07-01'),
(1, 'Clothing Drive', 'Collecting winter clothing donations', 'City Hall', '2026-07-20'),
(1, 'Blood Drive', 'Partnering with Red Cross', 'Downtown Clinic', '2026-08-05'),
(2, 'Habitat Build', 'Building homes for low-income families', 'Eastside District', '2026-06-10'),
(2, 'Senior Visit', 'Visiting elderly residents', 'Sunrise Care Home', '2026-06-25'),
(2, 'Beach Cleanup', 'Removing trash from local beaches', 'Lakeside Beach', '2026-07-10'),
(2, 'Literacy Night', 'Reading event for children', 'Public Library', '2026-07-30'),
(2, 'Garden Project', 'Building community vegetable garden', 'Northside Lot', '2026-08-12'),
(3, 'Shelter Volunteer', 'Serving meals at homeless shelter', 'Hope Shelter', '2026-06-05'),
(3, 'Tree Planting', 'Planting 100 trees in the city', 'Memorial Park', '2026-06-20'),
(3, 'Tech Workshop', 'Teaching digital skills to seniors', 'Community Library', '2026-07-15'),
(3, 'Animal Shelter Help', 'Walking and caring for shelter animals', 'City Animal Shelter', '2026-08-01'),
(3, 'Fundraiser Run', '5K run to raise money for local schools', 'City Stadium', '2026-08-20');


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- ========================================
-- Project Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_projects(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Community Outreach'),
('Environmental'),
('Education'),
('Health & Wellness'),
('Food Security');

-- ========================================
-- Insert sample data: Project Categories
-- ========================================
INSERT INTO project_category (project_id, category_id) VALUES
(1, 5), (2, 2), (3, 3), (4, 1), (5, 4),
(6, 1), (7, 1), (8, 2), (9, 3), (10, 2),
(11, 5), (12, 2), (13, 3), (14, 1), (15, 4);