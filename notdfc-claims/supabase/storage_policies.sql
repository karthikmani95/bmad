-- Storage Policies for claim-attachments bucket
-- Run these in Supabase Dashboard > Storage > claim-attachments > Policies

-- Policy 1: Users can upload files for their own claims
CREATE POLICY "Users can upload claim attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'claim-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view their own attachments
CREATE POLICY "Users can view own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'claim-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can delete their own attachments
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'claim-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
