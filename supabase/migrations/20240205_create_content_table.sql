-- Create content table
CREATE TABLE IF NOT EXISTS content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    page_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add RLS (Row Level Security) policies
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own content
CREATE POLICY "Users can view their own content"
ON content FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own content
CREATE POLICY "Users can insert their own content"
ON content FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own content
CREATE POLICY "Users can update their own content"
ON content FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own content
CREATE POLICY "Users can delete their own content"
ON content FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX content_document_id_idx ON content(document_id);
CREATE INDEX content_user_id_idx ON content(user_id);
