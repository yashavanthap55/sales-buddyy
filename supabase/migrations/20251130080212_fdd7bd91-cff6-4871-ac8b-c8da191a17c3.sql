-- Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add missing column to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'prospect';

-- Create lead_scores table
CREATE TABLE public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  budget_score INTEGER DEFAULT 0,
  authority_score INTEGER DEFAULT 0,
  need_score INTEGER DEFAULT 0,
  timeline_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage lead scores through leads"
ON public.lead_scores FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_scores.lead_id 
    AND leads.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_scores.lead_id 
    AND leads.user_id = auth.uid()
  )
);

CREATE TRIGGER update_lead_scores_updated_at
  BEFORE UPDATE ON public.lead_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage chat messages through leads"
ON public.chat_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = chat_messages.lead_id 
    AND leads.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = chat_messages.lead_id 
    AND leads.user_id = auth.uid()
  )
);

-- Create lead_activities table
CREATE TABLE public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage lead activities through leads"
ON public.lead_activities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
);