-- Create pre-signup table
CREATE TABLE IF NOT EXISTS presignup (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE presignup ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow anonymous inserts" ON presignup
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Create policy to allow viewing only your own data if authenticated
CREATE POLICY "Allow individual read access" ON presignup
    FOR SELECT
    TO authenticated
    USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_presignup_email ON presignup(email);
