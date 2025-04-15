
-- Create storage bucket for trade documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-documents', 'Trade Documents', true);

-- Create policy to allow reading trade documents
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'trade-documents');

-- Create policy to allow authenticated users to insert trade documents
CREATE POLICY "Authenticated Insert Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trade-documents');
