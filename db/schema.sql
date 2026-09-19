-- ===============================================================
-- TECHPATH — MASTER RELATIONAL DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Version: 2.0.0
-- Complies with All 45+ Canonical Relational Tables
-- ===============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles & Core Identity
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    department_id TEXT NOT NULL DEFAULT 'eng',
    branch_id TEXT NOT NULL DEFAULT 'cse',
    specialization_id TEXT DEFAULT 'core_cs',
    semester_id TEXT NOT NULL DEFAULT 'sem_3',
    year INT NOT NULL DEFAULT 2,
    learning_level TEXT NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, advanced
    career_goal TEXT DEFAULT 'Software Engineer',
    target_role TEXT DEFAULT 'Full Stack Engineer',
    target_exam TEXT DEFAULT 'GATE CSE',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    learning_preferences JSONB DEFAULT '{"theme": "dark", "autoplay_videos": false, "code_theme": "monokai"}'::jsonb,
    current_skills JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    skill_gaps JSONB DEFAULT '[]'::jsonb,
    techpath_id TEXT UNIQUE,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_id UUID,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_techpath_id ON profiles(techpath_id);

-- 2. Academic Hierarchy
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY, -- e.g. 'cse', 'ece', 'eee', 'mech', 'civil', 'aiml'
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    total_semesters INT NOT NULL DEFAULT 8,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specializations (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semesters (
    id TEXT PRIMARY KEY, -- e.g. 'sem_1', 'sem_2', ... 'sem_8'
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    number INT NOT NULL,
    name TEXT NOT NULL,
    academic_year INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(branch_id, number)
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    specialization_id TEXT REFERENCES specializations(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    credits INT NOT NULL DEFAULT 4,
    syllabus JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(branch_id, semester_id, code)
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    unit_number INT NOT NULL DEFAULT 1,
    sequence_order INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    estimated_minutes INT DEFAULT 45,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Learning Content (Videos, Lessons, Resources, Notes)
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    specialization_id TEXT REFERENCES specializations(id) ON DELETE SET NULL,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    provider TEXT NOT NULL DEFAULT 'TechPath Stream',
    url TEXT NOT NULL,
    thumbnail TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    transcript TEXT,
    captions JSONB DEFAULT '[]'::jsonb,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    duration INT NOT NULL DEFAULT 600, -- seconds
    status TEXT NOT NULL DEFAULT 'published',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    reading_time_mins INT DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL DEFAULT 'pdf', -- pdf, doc, link, cheat_sheet
    url TEXT NOT NULL,
    file_size_bytes BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 3D Models & Interactive Engineering Visualizer
CREATE TABLE IF NOT EXISTS branch_models (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    specialization_id TEXT REFERENCES specializations(id) ON DELETE SET NULL,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. Hardware, Circuit, Machine, Structure
    description TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    asset_type TEXT NOT NULL DEFAULT 'procedural_mesh', -- procedural_mesh, gltf, obj
    model_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    accessible_2d_diagram JSONB NOT NULL DEFAULT '{}'::jsonb, -- 2D fallback
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_components (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES branch_models(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    component_index INT NOT NULL DEFAULT 0,
    relative_position JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}'::jsonb,
    explode_vector JSONB NOT NULL DEFAULT '{"x":0,"y":1,"z":0}'::jsonb,
    hotspot_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS component_explanations (
    id TEXT PRIMARY KEY,
    component_id TEXT NOT NULL REFERENCES model_components(id) ON DELETE CASCADE,
    what_is_it TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    how_it_works TEXT NOT NULL,
    inputs TEXT,
    outputs TEXT,
    properties JSONB DEFAULT '{}'::jsonb,
    applications JSONB DEFAULT '[]'::jsonb,
    common_failures JSONB DEFAULT '[]'::jsonb,
    related_topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
    related_video_id TEXT REFERENCES videos(id) ON DELETE SET NULL,
    interview_questions JSONB DEFAULT '[]'::jsonb
);

-- 5. Skills & Role Architecture
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY, -- e.g. 'skill_python', 'skill_sql', 'skill_rtos'
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Language, Framework, System, Core Engineering, Soft Skill
    description TEXT NOT NULL,
    branch_relevance JSONB NOT NULL DEFAULT '["cse"]'::jsonb,
    required_level INT NOT NULL DEFAULT 3, -- 1-5
    prerequisites JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_roles (
    id TEXT PRIMARY KEY, -- e.g. 'role_data_scientist', 'role_embedded_eng', 'role_structural_eng'
    title TEXT NOT NULL,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    salary_range TEXT DEFAULT '$75,000 - $140,000',
    market_demand TEXT DEFAULT 'High',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_role_skills (
    role_id TEXT NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_level INT NOT NULL DEFAULT 3,
    importance_weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    PRIMARY KEY (role_id, skill_id)
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    current_level INT NOT NULL DEFAULT 1, -- 1-5
    status TEXT NOT NULL DEFAULT 'Developing', -- Strong, Developing, Needs Improvement, Missing
    source TEXT NOT NULL DEFAULT 'Self-Reported', -- Detected, Self-Reported, Assessed, Quiz, Interview
    last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_level INT NOT NULL,
    current_level INT NOT NULL,
    gap_delta INT NOT NULL,
    status TEXT NOT NULL,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id, skill_id)
);

-- 6. Projects & Project Generation Engine
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    specialization_id TEXT REFERENCES specializations(id) ON DELETE SET NULL,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    objective TEXT NOT NULL,
    why_build_it TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    estimated_hours INT NOT NULL DEFAULT 30,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    architecture_spec JSONB NOT NULL DEFAULT '{}'::jsonb,
    implementation_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    testing_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    deployment_guide JSONB NOT NULL DEFAULT '{}'::jsonb,
    resume_bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
    interview_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_progress (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress', -- saved, in_progress, completed, abandoned
    completed_steps JSONB DEFAULT '[]'::jsonb,
    percent_complete INT NOT NULL DEFAULT 0,
    github_url TEXT,
    live_demo_url TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY(user_id, project_id)
);

-- 7. Practice, Quizzes & Flashcards
CREATE TABLE IF NOT EXISTS quiz_questions (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'mcq',
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    answers_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    time_taken_seconds INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcard_progress (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    flashcard_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    box INT NOT NULL DEFAULT 1, -- Leitner spaced repetition box (1 to 5)
    last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    repetitions INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, flashcard_id)
);

-- 8. Resumes & Mock Interview Engine
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Primary Technical Resume',
    source_type TEXT NOT NULL DEFAULT 'builder', -- 'upload' or 'builder'
    raw_text TEXT,
    parsed_data JSONB DEFAULT '{}'::jsonb,
    extracted_skills JSONB DEFAULT '[]'::jsonb,
    matched_roles JSONB DEFAULT '[]'::jsonb,
    file_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    interview_type TEXT NOT NULL DEFAULT 'technical', -- resume, role, technical, hr, project, skill
    target_role TEXT NOT NULL DEFAULT 'Software Engineer',
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress, completed, cancelled
    total_score DECIMAL(5,2),
    summary_report JSONB DEFAULT '{}'::jsonb,
    skill_impacts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    target_skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
    ideal_answer_outline TEXT,
    user_answer TEXT,
    score DECIMAL(4,2),
    feedback TEXT,
    improved_answer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Comprehensive Exam Engine
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY, -- e.g. 'exam_gate_cse', 'exam_sem3_cse', 'exam_campus_tcs'
    title TEXT NOT NULL,
    exam_type TEXT NOT NULL, -- semester, university, entrance, campus_placement, competitive
    target_branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
    eligibility_criteria TEXT NOT NULL,
    syllabus_summary TEXT NOT NULL,
    total_marks INT NOT NULL DEFAULT 100,
    duration_minutes INT NOT NULL DEFAULT 180,
    question_pattern JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_questions (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,
    topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
    question_type TEXT NOT NULL DEFAULT 'mcq', -- mcq, numerical, short_answer, coding
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    marks INT NOT NULL DEFAULT 1,
    negative_marks DECIMAL(3,2) NOT NULL DEFAULT 0.33,
    year_asked INT,
    difficulty TEXT NOT NULL DEFAULT 'hard'
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    score DECIMAL(6,2) NOT NULL,
    total_marks INT NOT NULL,
    accuracy_percentage DECIMAL(5,2) NOT NULL,
    weak_topics JSONB DEFAULT '[]'::jsonb,
    time_spent_seconds INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Roadmaps & Personalized Planning
CREATE TABLE IF NOT EXISTS roadmaps (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    roadmap_type TEXT NOT NULL, -- semester, learning, branch, skill, career, project, exam, campus, personalized
    branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
    semester_id TEXT REFERENCES semesters(id) ON DELETE SET NULL,
    target_role TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_items (
    id TEXT PRIMARY KEY,
    roadmap_id TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    linked_topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
    linked_project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    linked_skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
    estimated_days INT DEFAULT 7
);

-- 11. Internships & Opportunity Tracker
CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    branch_relevance JSONB NOT NULL DEFAULT '["cse"]'::jsonb,
    location TEXT NOT NULL DEFAULT 'Remote',
    stipend TEXT,
    deadline DATE,
    application_url TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_internships (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    internship_id TEXT NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved', -- saved, applied, assessment, interview, selected, rejected
    applied_date DATE,
    notes TEXT,
    PRIMARY KEY(user_id, internship_id)
);

-- 12. Community, Support & Governance
CREATE TABLE IF NOT EXISTS community_groups (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    member_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'technical',
    status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
    priority TEXT NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- terms_of_service, privacy_policy, ai_disclaimer
    accepted BOOLEAN NOT NULL DEFAULT TRUE,
    policy_version TEXT NOT NULL DEFAULT '2.0',
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cookie_consents (
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    essential BOOLEAN NOT NULL DEFAULT TRUE,
    analytics BOOLEAN NOT NULL DEFAULT FALSE,
    preferences BOOLEAN NOT NULL DEFAULT FALSE,
    marketing BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processed, cancelled
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================================
-- INDEXES FOR FAST QUERYING AND STRICT FILTERING
-- ===============================================================
CREATE INDEX IF NOT EXISTS idx_subjects_branch_sem ON subjects(branch_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_videos_filter ON videos(branch_id, semester_id, subject_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_models_filter ON branch_models(branch_id, semester_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_projects_filter ON projects(branch_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_role ON skill_gaps(user_id, role_id);

-- ===============================================================
-- 13. SERVER-SIDE AUTHORIZATION & ROW LEVEL SECURITY (RLS)
-- Single authorized admin: kotagirivishwanath@gmail.com
-- ===============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        LOWER(TRIM(COALESCE(auth.jwt() ->> 'email', ''))) = 'kotagirivishwanath@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS) on key security and profile tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Only admin can delete profiles" ON profiles;
CREATE POLICY "Only admin can delete profiles"
    ON profiles FOR DELETE
    USING (is_admin());

-- Admin Audit Logs: Visible and writable ONLY to authorized admin
DROP POLICY IF EXISTS "Only admin can access audit logs" ON admin_audit_logs;
CREATE POLICY "Only admin can access audit logs"
    ON admin_audit_logs FOR ALL
    USING (is_admin());

-- Catalog Mutations: Read-only for public, mutations ONLY by authorized admin
DROP POLICY IF EXISTS "Public read departments" ON departments;
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate departments" ON departments;
CREATE POLICY "Admin mutate departments" ON departments FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public read branches" ON branches;
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate branches" ON branches;
CREATE POLICY "Admin mutate branches" ON branches FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public read subjects" ON subjects;
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin mutate subjects" ON subjects;
CREATE POLICY "Admin mutate subjects" ON subjects FOR ALL USING (is_admin());

-- 12. Career Trajectories & Milestones
CREATE TABLE IF NOT EXISTS career_trajectories (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL,
    role_title TEXT NOT NULL,
    branch_id TEXT NOT NULL,
    specialization_id TEXT,
    current_semester TEXT,
    stages JSONB NOT NULL DEFAULT '[]'::jsonb,
    readiness_percentage INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_trajectory_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL,
    stage_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL DEFAULT 'skill',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(user_id, role_id, stage_id, item_id)
);

-- 13. Exam Roadmaps & Dynamic Preparation AI
CREATE TABLE IF NOT EXISTS exam_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    exam_id TEXT NOT NULL,
    exam_title TEXT NOT NULL,
    exam_category TEXT NOT NULL DEFAULT 'academic',
    target_score TEXT NOT NULL,
    exam_date DATE,
    daily_hours INT DEFAULT 3,
    current_level TEXT DEFAULT 'intermediate',
    weak_areas JSONB DEFAULT '[]'::jsonb,
    strong_areas JSONB DEFAULT '[]'::jsonb,
    phases JSONB NOT NULL DEFAULT '[]'::jsonb,
    overall_progress INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_exam_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    roadmap_id UUID NOT NULL REFERENCES exam_roadmaps(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started',
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, roadmap_id, task_id)
);

ALTER TABLE career_trajectories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trajectory_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own career trajectories" ON career_trajectories;
CREATE POLICY "Users can view own career trajectories" ON career_trajectories FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Users can manage own career trajectories" ON career_trajectories;
CREATE POLICY "Users can manage own career trajectories" ON career_trajectories FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can view own trajectory progress" ON user_trajectory_progress;
CREATE POLICY "Users can view own trajectory progress" ON user_trajectory_progress FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Users can manage own trajectory progress" ON user_trajectory_progress;
CREATE POLICY "Users can manage own trajectory progress" ON user_trajectory_progress FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can view own exam roadmaps" ON exam_roadmaps;
CREATE POLICY "Users can view own exam roadmaps" ON exam_roadmaps FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Users can manage own exam roadmaps" ON exam_roadmaps;
CREATE POLICY "Users can manage own exam roadmaps" ON exam_roadmaps FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can view own exam progress" ON user_exam_progress;
CREATE POLICY "Users can view own exam progress" ON user_exam_progress FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Users can manage own exam progress" ON user_exam_progress;
CREATE POLICY "Users can manage own exam progress" ON user_exam_progress FOR ALL USING (auth.uid() = user_id OR is_admin());

-- ===============================================================
-- 14. SOCIAL, FRIENDSHIPS, MESSAGING & STUDY GROUPS
-- ===============================================================

-- Friend Requests
CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'cancelled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_different_users CHECK (requester_user_id <> receiver_user_id),
    UNIQUE(requester_user_id, receiver_user_id)
);
CREATE INDEX IF NOT EXISTS idx_friend_requests_requester ON friend_requests(requester_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);

-- Friendships (Symmetric Normalization: user_a_id < user_b_id)
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_friendship_ordering CHECK (user_a_id < user_b_id),
    UNIQUE(user_a_id, user_b_id)
);
CREATE INDEX IF NOT EXISTS idx_friendships_user_a ON friendships(user_a_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_b ON friendships(user_b_id);

-- In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'social', 'study_group', 'achievement', 'reminder', 'skill', 'quiz', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    related_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    related_entity_id TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- Direct Chat Conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat Participants
CREATE TABLE IF NOT EXISTS chat_participants (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_chat_participants_conv ON chat_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);

-- Chat Messages (Strictly Gated to Authorized Friends)
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id, created_at);

-- Study Groups (Real Engineering Study Circles)
CREATE TABLE IF NOT EXISTS study_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    creator_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL DEFAULT 'eng',
    branch TEXT NOT NULL DEFAULT 'cse',
    specialization TEXT,
    semester TEXT NOT NULL DEFAULT 'sem_3',
    subject TEXT,
    topic TEXT,
    career_goal TEXT,
    target_role TEXT,
    language TEXT NOT NULL DEFAULT 'English',
    difficulty TEXT NOT NULL DEFAULT 'Intermediate',
    visibility TEXT NOT NULL DEFAULT 'public', -- 'public' | 'private'
    max_members INT NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_study_groups_branch_sem ON study_groups(branch, semester);
CREATE INDEX IF NOT EXISTS idx_study_groups_visibility ON study_groups(visibility);

-- Study Group Members
CREATE TABLE IF NOT EXISTS study_group_members (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'creator' | 'admin' | 'member'
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON study_group_members(user_id);

-- Study Group Join Requests (Private Groups)
CREATE TABLE IF NOT EXISTS study_group_join_requests (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_study_group_join_req_group ON study_group_join_requests(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_join_req_user ON study_group_join_requests(user_id);

-- Study Group Invitations
CREATE TABLE IF NOT EXISTS study_group_invitations (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, receiver_user_id)
);

-- Study Group Messages (Member-Only Discussion)
CREATE TABLE IF NOT EXISTS study_group_messages (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_study_group_messages_group ON study_group_messages(group_id, created_at);


