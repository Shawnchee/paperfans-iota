-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_affiliation VARCHAR(255) NOT NULL,
    author_image VARCHAR(500),
    image_url VARCHAR(500),
    funding_goal DECIMAL(15,2) NOT NULL,
    current_funding DECIMAL(15,2) DEFAULT 0,
    backer_count INTEGER DEFAULT 0,
    days_left INTEGER NOT NULL,
    technical_approach TEXT,
    timeline JSONB,
    recent_activity JSONB,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create funding_tiers table
CREATE TABLE IF NOT EXISTS funding_tiers (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    benefits TEXT[] NOT NULL,
    backer_count INTEGER DEFAULT 0,
    max_backers INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create funding_contributions table
CREATE TABLE IF NOT EXISTS funding_contributions (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    contributor_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    wallet_address VARCHAR(255),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funding_tiers_project_id ON funding_tiers(project_id);
CREATE INDEX IF NOT EXISTS idx_funding_contributions_project_id ON funding_contributions(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to funding tiers" ON funding_tiers
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to funding contributions" ON funding_contributions
    FOR SELECT USING (true);

-- Create policies for authenticated users to create projects
CREATE POLICY "Allow authenticated users to create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for authenticated users to update projects
CREATE POLICY "Allow authenticated users to update projects" ON projects
    FOR UPDATE USING (auth.uid() = author_id);

-- Create policies for authenticated users to create funding contributions
CREATE POLICY "Allow authenticated users to create funding contributions" ON funding_contributions
    FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users to create funding tiers
CREATE POLICY "Allow authenticated users to create funding tiers" ON funding_tiers
    FOR INSERT WITH CHECK (true);

-- Insert some sample data
INSERT INTO projects (
    title, 
    abstract, 
    category, 
    author_name, 
    author_affiliation, 
    funding_goal, 
    days_left, 
    technical_approach,
    timeline,
    recent_activity
) VALUES 
(
    'Decentralized Content Platform',
    'A revolutionary platform for content creators to monetize their work using IOTA technology.',
    'Crypto',
    'PaperFans Team',
    'PaperFans IOTA',
    50000.00,
    25.00,
    'This project leverages IOTA''s feeless and scalable distributed ledger technology to create a seamless content monetization platform. We use smart contracts to handle revenue sharing and implement a reputation system for content quality.',
    '[{"phase": "Research & Design", "duration": "2 months", "description": "Market research and platform architecture design", "status": "completed"}, {"phase": "Development", "duration": "4 months", "description": "Core platform development and testing", "status": "active"}, {"phase": "Launch", "duration": "1 month", "description": "Platform launch and user onboarding", "status": "pending"}]',
    '[{"type": "funding", "user": "Alice", "amount": 1000, "description": "Funded the project", "time": "2 hours ago"}, {"type": "milestone", "description": "Completed research phase", "time": "1 day ago"}]'
),
(
    'Community Governance Tool',
    'A tool for decentralized communities to make collective decisions and manage resources.',
    'Crypto',
    'DAO Collective',
    'DAO Research Lab',
    25000.00,
    18.00,
    'Built on blockchain technology, this governance tool enables transparent voting, proposal management, and resource allocation for decentralized communities.',
    '[{"phase": "Conceptualization", "duration": "1 month", "description": "Requirements gathering and design", "status": "completed"}, {"phase": "Prototype", "duration": "3 months", "description": "Building MVP and testing", "status": "active"}]',
    '[{"type": "funding", "user": "Bob", "amount": 500, "description": "Funded the project", "time": "5 hours ago"}]'
),
(
    'AI-Powered Research Assistant',
    'An intelligent assistant that helps researchers discover, analyze, and synthesize scientific literature.',
    'AI/ML',
    'Dr. Sarah Chen',
    'Stanford University',
    75000.00,
    30.00,
    'This AI assistant uses advanced natural language processing and machine learning algorithms to help researchers efficiently navigate and analyze scientific literature.',
    '[{"phase": "Data Collection", "duration": "3 months", "description": "Gathering scientific papers and training data", "status": "completed"}, {"phase": "Model Development", "duration": "6 months", "description": "Building and training AI models", "status": "active"}]',
    '[{"type": "funding", "user": "Charlie", "amount": 2000, "description": "Funded the project", "time": "1 day ago"}]'
);

-- Insert sample funding tiers
INSERT INTO funding_tiers (project_id, name, description, amount, benefits, backer_count) VALUES
(1, 'Early Supporter', 'Get early access and exclusive updates', 100.00, ARRAY['Early access', 'Exclusive updates', 'Community access'], 45),
(1, 'Major Contributor', 'Significant contribution with premium benefits', 1000.00, ARRAY['All early supporter benefits', 'Direct consultation', 'Revenue sharing'], 12),
(2, 'Community Member', 'Basic access to governance features', 50.00, ARRAY['Voting rights', 'Community access'], 23),
(2, 'Governance Expert', 'Advanced governance features and consultation', 500.00, ARRAY['All community member benefits', 'Expert consultation', 'Priority support'], 8),
(3, 'Research Supporter', 'Support AI research development', 200.00, ARRAY['Early access to AI tools', 'Research updates'], 67),
(3, 'Research Partner', 'Direct partnership in AI development', 2000.00, ARRAY['All research supporter benefits', 'Direct consultation', 'Co-authorship opportunities'], 15);

-- Insert sample funding contributions
INSERT INTO funding_contributions (project_id, contributor_name, amount, wallet_address, transaction_id) VALUES
(1, 'Alice', 1000.00, '0x1234567890abcdef', 'tx_001_alice'),
(1, 'Bob', 500.00, '0xabcdef1234567890', 'tx_002_bob'),
(2, 'Charlie', 500.00, '0x7890abcdef123456', 'tx_003_charlie'),
(3, 'David', 2000.00, '0x4567890abcdef123', 'tx_004_david'),
(3, 'Eve', 1500.00, '0xdef1234567890abc', 'tx_005_eve');

-- Update project funding totals
UPDATE projects SET 
    current_funding = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM funding_contributions 
        WHERE project_id = projects.id
    ),
    backer_count = (
        SELECT COUNT(*) 
        FROM funding_contributions 
        WHERE project_id = projects.id
    ); 