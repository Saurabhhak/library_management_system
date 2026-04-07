-- ALTER TABLE returns ADD COLUMN fine_amount DECIMAL(10,2) DEFAULT 0;
-- ALTER TABLE members ADD COLUMN membership_type VARCHAR(20);

-- ALTER TABLE members
-- ADD COLUMN password VARCHAR(255);
-- INSERT INTO categories (name, description) VALUES
-- ('Technology', 'Books about modern technology, innovation, and technical advancements.'),
-- ('Computer Science', 'Core computer science concepts, theory, and computing fundamentals.'),
-- ('Programming', 'Coding books covering various programming languages and techniques.'),
-- ('Databases', 'Database design, SQL, NoSQL, and data management systems.'),
-- ('Artificial Intelligence', 'AI concepts including intelligent systems and automation.'),
-- ('Machine Learning', 'ML algorithms, models, and practical implementations.'),
-- ('Data Science', 'Data analysis, visualization, statistics, and big data.'),
-- ('Cyber Security', 'Information security, ethical hacking, and network security.'),
-- ('Networking', 'Computer networks, protocols, and network architecture.'),
-- ('Software Engineering', 'Software development lifecycle, architecture, and best practices.'),
-- ('Web Development', 'Frontend and backend web development technologies.'),
-- ('Mobile Development', 'Android, iOS, and cross-platform mobile app development.'),
-- ('Cloud Computing', 'Cloud platforms, distributed computing, and cloud architecture.'),
-- ('DevOps', 'CI/CD, automation, deployment, and infrastructure management.'),
-- ('Operating Systems', 'Concepts of OS like Linux, Windows, memory, and processes.'),
-- ('Algorithms', 'Algorithm design, analysis, and problem-solving techniques.'),
-- ('Data Structures', 'Data organization and structures like arrays, trees, graphs.'),
-- ('Science', 'General science and scientific discoveries.'),
-- ('Mathematics', 'Pure and applied mathematics concepts and theories.'),
-- ('Physics', 'Physics principles including motion, energy, and matter.'),
-- ('Chemistry', 'Chemical reactions, compounds, and laboratory science.'),
-- ('Biology', 'Study of living organisms and life sciences.'),
-- ('History', 'Historical events, civilizations, and world history.'),
-- ('Geography', 'Earth, environment, and physical geography.'),
-- ('Economics', 'Microeconomics, macroeconomics, and economic theory.'),
-- ('Business', 'Business strategy, entrepreneurship, and management.'),
-- ('Finance', 'Financial management, investing, and banking.'),
-- ('Marketing', 'Marketing strategies, branding, and advertising.'),
-- ('Psychology', 'Human behavior and mental processes.'),
-- ('Self Help', 'Personal development and self-improvement books.'),
-- ('Productivity', 'Time management and productivity improvement.'),
-- ('Health', 'General health and wellness.'),
-- ('Fitness', 'Exercise, workouts, and physical fitness.'),
-- ('Medicine', 'Medical science and healthcare.'),
-- ('Fiction', 'Imaginary stories and literature novels.'),
-- ('Non-Fiction', 'Real stories, facts, and informational books.'),
-- ('Fantasy', 'Fantasy stories with magical or supernatural elements.'),
-- ('Mystery', 'Mystery and detective stories.'),
-- ('Thriller', 'Thrilling and suspense stories.'),
-- ('Romance', 'Romantic novels and love stories.'),
-- ('Biography', 'Life stories of famous people.'),
-- ('Autobiography', 'Self-written life stories.'),
-- ('Education', 'Academic and educational books.'),
-- ('Children', 'Books for kids and young readers.'),
-- ('Comics', 'Comic books and graphic novels.'),
-- ('Travel', 'Travel guides and travel stories.'),
-- ('Religion', 'Religious and spiritual books.'),
-- ('Art', 'Art, drawing, and creative works.'),
-- ('Design', 'Graphic, UI/UX, and product design.'),
-- ('Photography', 'Photography techniques and guides.'),
-- ('Music', 'Music theory, instruments, and songs.');
-- ----------------- Books
-- ALTER TABLE books 
-- ALTER COLUMN available_copies SET DEFAULT 0,
-- ALTER COLUMN status SET DEFAULT 'available',
-- ALTER COLUMN is_deleted SET DEFAULT false,
-- ALTER COLUMN created_at SET DEFAULT NOW(),
-- ALTER COLUMN updated_at SET DEFAULT NOW();
-- CREATE OR REPLACE FUNCTION set_available_copies()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.available_copies := NEW.total_copies;
--   NEW.status := 'available';
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER trigger_set_available
-- BEFORE INSERT ON books
-- FOR EACH ROW
-- EXECUTE FUNCTION set_available_copies();

-- Insert Books 
-- INSERT INTO books (title, author, isbn, category_id, total_copies, shelf_location) VALUES
-- -- Technology
-- ('Clean Code', 'Robert C Martin', '9780132350884', 1, 5, 'T-A1'),
-- ('The Innovators', 'Walter Isaacson', '9781476708706', 1, 4, 'T-A2'),

-- -- Computer Science
-- ('Introduction to Algorithms', 'Thomas H Cormen', '9780262046305', 2, 6, 'CS-B1'),
-- ('Computer Networks', 'Andrew S Tanenbaum', '9780132126953', 2, 3, 'CS-B2'),

-- -- Programming
-- ('You Don’t Know JS', 'Kyle Simpson', '9781491904244', 3, 5, 'P-C1'),
-- ('Python Crash Course', 'Eric Matthes', '9781593279288', 3, 4, 'P-C2'),

-- -- Databases
-- ('Database System Concepts', 'Silberschatz', '9780073523323', 4, 5, 'DB-D1'),
-- ('SQL in 10 Minutes', 'Ben Forta', '9780672336072', 4, 3, 'DB-D2'),

-- -- Artificial Intelligence
-- ('Artificial Intelligence A Modern Approach', 'Stuart Russell', '9780136042594', 5, 4, 'AI-E1'),

-- -- Machine Learning
-- ('Hands-On Machine Learning', 'Aurelien Geron', '9781492032649', 6, 5, 'ML-F1'),

-- -- Data Science
-- ('Data Science from Scratch', 'Joel Grus', '9781492041139', 7, 4, 'DS-G1'),

-- -- Cyber Security
-- ('The Web Application Hacker Handbook', 'Dafydd Stuttard', '9781118026472', 8, 3, 'CY-H1'),

-- -- Networking
-- ('Computer Networking', 'James Kurose', '9780133594140', 9, 4, 'NW-I1'),

-- -- Software Engineering
-- ('The Mythical Man-Month', 'Frederick Brooks', '9780201835953', 10, 3, 'SE-J1'),

-- -- Web Development
-- ('Eloquent JavaScript', 'Marijn Haverbeke', '9781593279509', 11, 5, 'WD-K1'),

-- -- Mobile Development
-- ('Android Programming', 'Big Nerd Ranch', '9780134706054', 12, 3, 'MB-L1'),

-- -- Cloud Computing
-- ('Cloud Computing Basics', 'Rajkumar Buyya', '9780133387520', 13, 4, 'CC-M1'),

-- -- DevOps
-- ('The Phoenix Project', 'Gene Kim', '9780988262591', 14, 4, 'DO-N1'),

-- -- Operating Systems
-- ('Operating System Concepts', 'Silberschatz', '9781118063330', 15, 6, 'OS-O1'),

-- -- Algorithms
-- ('Grokking Algorithms', 'Aditya Bhargava', '9781617292231', 16, 5, 'AL-P1'),

-- -- Data Structures
-- ('Data Structures Using C', 'Reema Thareja', '9780198099307', 17, 4, 'DS-Q1'),

-- -- Mathematics
-- ('Discrete Mathematics', 'Kenneth Rosen', '9780073383095', 19, 5, 'MA-R1'),

-- -- Physics
-- ('Concepts of Physics', 'HC Verma', '9788177091878', 20, 6, 'PH-S1'),

-- -- Business
-- ('The Lean Startup', 'Eric Ries', '9780307887894', 26, 4, 'BU-T1'),

-- -- Finance
-- ('Rich Dad Poor Dad', 'Robert Kiyosaki', '9781612680194', 27, 5, 'FI-U1'),

-- -- Psychology
-- ('Thinking Fast and Slow', 'Daniel Kahneman', '9780374533557', 29, 4, 'PS-V1'),

-- -- Self Help
-- ('Atomic Habits', 'James Clear', '9780735211292', 30, 6, 'SH-W1'),

-- -- Fiction
-- ('The Alchemist', 'Paulo Coelho', '9780062315007', 35, 5, 'FC-X1'),

-- -- Fantasy
-- ('Harry Potter', 'JK Rowling', '9780545582889', 37, 7, 'FA-Y1'),

-- -- Mystery
-- ('Sherlock Holmes', 'Arthur Conan Doyle', '9780451524935', 38, 4, 'MY-Z1'),

-- -- Biography
-- ('Steve Jobs', 'Walter Isaacson', '9781451648539', 41, 3, 'BG-A3'),

-- -- Education
-- ('The Art of Teaching', 'Gilbert Highet', '9780674872554', 43, 3, 'ED-B3');

-- INSERT INTO states (id, name) VALUES
-- (1, 'Andhra Pradesh'),
-- (2, 'Arunachal Pradesh'),
-- (3, 'Assam'),
-- (4, 'Bihar'),
-- (5, 'Chhattisgarh'),
-- (6, 'Goa'),
-- (7, 'Gujarat'),
-- (8, 'Haryana'),
-- (9, 'Himachal Pradesh'),
-- (10, 'Jharkhand'),
-- (11, 'Karnataka'),
-- (12, 'Kerala'),
-- (13, 'Madhya Pradesh'),
-- (14, 'Maharashtra'),
-- (15, 'Manipur'),
-- (16, 'Meghalaya'),
-- (17, 'Mizoram'),
-- (18, 'Nagaland'),
-- (19, 'Odisha'),
-- (20, 'Punjab'),
-- (21, 'Rajasthan'),
-- (22, 'Sikkim'),
-- (23, 'Tamil Nadu'),
-- (24, 'Telangana'),
-- (25, 'Tripura'),
-- (26, 'Uttar Pradesh'),
-- (27, 'Uttarakhand'),
-- (28, 'West Bengal');
-- --------------------- ADD Cities Data
-- INSERT INTO cities (state_id, name) VALUES

-- -- Andhra Pradesh
-- (1,'Visakhapatnam'),(1,'Vijayawada'),(1,'Guntur'),(1,'Nellore'),(1,'Kurnool'),
-- (1,'Rajahmundry'),(1,'Tirupati'),(1,'Anantapur'),(1,'Eluru'),(1,'Kadapa'),

-- -- Arunachal Pradesh
-- (2,'Itanagar'),(2,'Tawang'),(2,'Ziro'),(2,'Pasighat'),(2,'Roing'),
-- (2,'Bomdila'),(2,'Tezu'),(2,'Naharlagun'),(2,'Seppa'),(2,'Aalo'),

-- -- Assam
-- (3,'Guwahati'),(3,'Silchar'),(3,'Dibrugarh'),(3,'Jorhat'),(3,'Nagaon'),
-- (3,'Tinsukia'),(3,'Tezpur'),(3,'Bongaigaon'),(3,'Karimganj'),(3,'Sivasagar'),

-- -- Bihar
-- (4,'Patna'),(4,'Gaya'),(4,'Bhagalpur'),(4,'Muzaffarpur'),(4,'Darbhanga'),
-- (4,'Purnia'),(4,'Arrah'),(4,'Begusarai'),(4,'Katihar'),(4,'Munger'),

-- -- Chhattisgarh
-- (5,'Raipur'),(5,'Bhilai'),(5,'Durg'),(5,'Bilaspur'),(5,'Korba'),
-- (5,'Rajnandgaon'),(5,'Jagdalpur'),(5,'Ambikapur'),(5,'Raigarh'),(5,'Dhamtari'),

-- -- Goa
-- (6,'Panaji'),(6,'Margao'),(6,'Vasco da Gama'),(6,'Mapusa'),(6,'Ponda'),
-- (6,'Bicholim'),(6,'Curchorem'),(6,'Sanquelim'),(6,'Canacona'),(6,'Quepem'),

-- -- Gujarat
-- (7,'Ahmedabad'),(7,'Surat'),(7,'Vadodara'),(7,'Rajkot'),(7,'Bhavnagar'),
-- (7,'Jamnagar'),(7,'Junagadh'),(7,'Gandhinagar'),(7,'Anand'),(7,'Navsari'),

-- -- Haryana
-- (8,'Gurgaon'),(8,'Faridabad'),(8,'Panipat'),(8,'Ambala'),(8,'Karnal'),
-- (8,'Hisar'),(8,'Rohtak'),(8,'Sonipat'),(8,'Yamunanagar'),(8,'Panchkula'),

-- -- Himachal Pradesh
-- (9,'Shimla'),(9,'Manali'),(9,'Dharamshala'),(9,'Solan'),(9,'Mandi'),
-- (9,'Kullu'),(9,'Chamba'),(9,'Bilaspur'),(9,'Hamirpur'),(9,'Una'),

-- -- Jharkhand
-- (10,'Ranchi'),(10,'Jamshedpur'),(10,'Dhanbad'),(10,'Bokaro'),(10,'Deoghar'),
-- (10,'Hazaribagh'),(10,'Giridih'),(10,'Ramgarh'),(10,'Medininagar'),(10,'Chatra'),

-- -- Karnataka
-- (11,'Bangalore'),(11,'Mysore'),(11,'Mangalore'),(11,'Hubli'),(11,'Belgaum'),
-- (11,'Davangere'),(11,'Bellary'),(11,'Shimoga'),(11,'Tumkur'),(11,'Udupi'),

-- -- Kerala
-- (12,'Thiruvananthapuram'),(12,'Kochi'),(12,'Kozhikode'),(12,'Thrissur'),(12,'Kannur'),
-- (12,'Alappuzha'),(12,'Kollam'),(12,'Palakkad'),(12,'Malappuram'),(12,'Kottayam'),

-- -- Madhya Pradesh
-- (13,'Bhopal'),(13,'Indore'),(13,'Gwalior'),(13,'Jabalpur'),(13,'Ujjain'),
-- (13,'Sagar'),(13,'Rewa'),(13,'Satna'),(13,'Ratlam'),(13,'Dewas'),

-- -- Maharashtra
-- (14,'Mumbai'),(14,'Pune'),(14,'Nagpur'),(14,'Nashik'),(14,'Aurangabad'),
-- (14,'Solapur'),(14,'Kolhapur'),(14,'Amravati'),(14,'Nanded'),(14,'Sangli'),

-- -- Manipur
-- (15,'Imphal'),(15,'Thoubal'),(15,'Bishnupur'),(15,'Churachandpur'),(15,'Ukhrul'),
-- (15,'Senapati'),(15,'Tamenglong'),(15,'Kakching'),(15,'Jiribam'),(15,'Moreh'),

-- -- Meghalaya
-- (16,'Shillong'),(16,'Tura'),(16,'Nongpoh'),(16,'Jowai'),(16,'Baghmara'),
-- (16,'Williamnagar'),(16,'Resubelpara'),(16,'Mairang'),(16,'Nongstoin'),(16,'Cherrapunji'),

-- -- Mizoram
-- (17,'Aizawl'),(17,'Lunglei'),(17,'Champhai'),(17,'Serchhip'),(17,'Kolasib'),
-- (17,'Saiha'),(17,'Lawngtlai'),(17,'Mamit'),(17,'Saitual'),(17,'Khawzawl'),

-- -- Nagaland
-- (18,'Kohima'),(18,'Dimapur'),(18,'Mokokchung'),(18,'Tuensang'),(18,'Wokha'),
-- (18,'Zunheboto'),(18,'Phek'),(18,'Mon'),(18,'Longleng'),(18,'Kiphire'),

-- -- Odisha
-- (19,'Bhubaneswar'),(19,'Cuttack'),(19,'Rourkela'),(19,'Puri'),(19,'Sambalpur'),
-- (19,'Berhampur'),(19,'Balasore'),(19,'Baripada'),(19,'Jharsuguda'),(19,'Jeypore'),

-- -- Punjab
-- (20,'Ludhiana'),(20,'Amritsar'),(20,'Jalandhar'),(20,'Patiala'),(20,'Bathinda'),
-- (20,'Mohali'),(20,'Hoshiarpur'),(20,'Pathankot'),(20,'Moga'),(20,'Abohar'),

-- -- Rajasthan
-- (21,'Jaipur'),(21,'Udaipur'),(21,'Jodhpur'),(21,'Kota'),(21,'Bikaner'),
-- (21,'Ajmer'),(21,'Alwar'),(21,'Bharatpur'),(21,'Sikar'),(21,'Pali'),

-- -- Sikkim
-- (22,'Gangtok'),(22,'Namchi'),(22,'Gyalshing'),(22,'Mangan'),(22,'Rangpo'),
-- (22,'Singtam'),(22,'Jorethang'),(22,'Nayabazar'),(22,'Ravangla'),(22,'Soreng'),

-- -- Tamil Nadu
-- (23,'Chennai'),(23,'Coimbatore'),(23,'Madurai'),(23,'Salem'),(23,'Tiruchirappalli'),
-- (23,'Tirunelveli'),(23,'Erode'),(23,'Vellore'),(23,'Thoothukudi'),(23,'Dindigul'),

-- -- Telangana
-- (24,'Hyderabad'),(24,'Warangal'),(24,'Nizamabad'),(24,'Karimnagar'),(24,'Khammam'),
-- (24,'Ramagundam'),(24,'Mahbubnagar'),(24,'Adilabad'),(24,'Suryapet'),(24,'Miryalaguda'),

-- -- Tripura
-- (25,'Agartala'),(25,'Udaipur'),(25,'Dharmanagar'),(25,'Kailashahar'),(25,'Belonia'),
-- (25,'Ambassa'),(25,'Khowai'),(25,'Sabroom'),(25,'Sonamura'),(25,'Teliamura'),

-- -- Uttar Pradesh
-- (26,'Lucknow'),(26,'Kanpur'),(26,'Varanasi'),(26,'Agra'),(26,'Meerut'),
-- (26,'Prayagraj'),(26,'Ghaziabad'),(26,'Noida'),(26,'Bareilly'),(26,'Aligarh'),

-- -- Uttarakhand
-- (27,'Dehradun'),(27,'Haridwar'),(27,'Roorkee'),(27,'Haldwani'),(27,'Nainital'),
-- (27,'Rudrapur'),(27,'Kashipur'),(27,'Rishikesh'),(27,'Pithoragarh'),(27,'Almora'),

-- -- West Bengal
-- (28,'Kolkata'),(28,'Howrah'),(28,'Durgapur'),(28,'Asansol'),(28,'Siliguri'),
-- (28,'Darjeeling'),(28,'Malda'),(28,'Kharagpur'),(28,'Haldia'),(28,'Bardhaman');

-- --------- Create Google id 
-- ALTER TABLE members ADD COLUMN google_id VARCHAR(255);

-- ------------- Admin 
-- DROP TABLE IF EXISTS admin CASCADE;

-- CREATE TABLE admin (
--     id SERIAL PRIMARY KEY,

--     first_name VARCHAR(80) NOT NULL,
--     last_name VARCHAR(80),

--     email VARCHAR(150) UNIQUE NOT NULL,
--     phone VARCHAR(15) UNIQUE,

--     password_hash VARCHAR(255),

--     role VARCHAR(20) NOT NULL DEFAULT 'admin',
--     is_active BOOLEAN DEFAULT TRUE,
--     is_verified BOOLEAN DEFAULT FALSE,

--     verify_token TEXT,
--     token_expiry TIMESTAMP,

--     reset_otp VARCHAR(10),
--     otp_expiry TIMESTAMP,

--     state_id INTEGER,
--     city_id INTEGER,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_admin_state
--     FOREIGN KEY (state_id)
--     REFERENCES states(id)
--     ON DELETE SET NULL,

--     CONSTRAINT fk_admin_city
--     FOREIGN KEY (city_id)
--     REFERENCES cities(id)
--     ON DELETE SET NULL,

--     CONSTRAINT role_check
--     CHECK (role IN ('admin','superadmin'))
-- );


-- — but not invite_token_expiry. Every invite insert will fail silently or crash.
--  Run this migration
-- ALTER TABLE admin 
-- ADD COLUMN IF NOT EXISTS invite_token TEXT,
-- ADD COLUMN IF NOT EXISTS invite_token_expiry TIMESTAMP,   
-- ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
-- ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
-- ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE; 

TRUNCATE TABLE admin RESTART IDENTITY CASCADE;

INSERT INTO admin (
  first_name,
  last_name,
  email,
  password_hash,
  role,
  is_active,
  is_verified,
  is_profile_complete,
  is_deleted,
  created_at
)
VALUES (
  'Saurabh',
  'Kashyap',
  'skkashyap2328@gmail.com',
  '$2b$10$UvX2PNhCRwv5GiZNHaoMe9nED.LcYXZsuWYrPYlLRot70QsCMOty',
  'superadmin',
  true,
  true,
  true,
  false,
  NOW()
);

-- bash
-- psql -U postgres -d library_db -f backend/config/alter.sql
-- psql "postgresql://neondb_owner:npg_Wl3othi5vzRg@ep-wild-cloud-a1ifuvlk.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f backend/config/alter.sql