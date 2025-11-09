-- Add DELETE policy for rooms
CREATE POLICY "Users can delete own rooms" ON rooms 
  FOR DELETE 
  USING (auth.uid() = host_id);

