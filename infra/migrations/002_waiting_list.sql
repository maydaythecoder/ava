-- Waiting List Table
-- SECURITY: Public insert access for pre-launch email collection

CREATE TABLE public.waiting_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_waiting_list_email ON public.waiting_list(email);
CREATE INDEX idx_waiting_list_created ON public.waiting_list(created_at DESC);

-- Enable RLS
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- SECURITY: Allow anonymous users to insert (waitlist signup)
CREATE POLICY "Allow public insert to waiting list" ON public.waiting_list
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- SECURITY: Only authenticated admins can read waiting list
CREATE POLICY "Admins can read waiting list" ON public.waiting_list
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

