
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  phone TEXT,
  website TEXT,
  lead_type TEXT CHECK (lead_type IN ('b2b', 'b2c')) DEFAULT 'b2b',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_scores table for BANT scoring
CREATE TABLE public.lead_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  budget_score INTEGER DEFAULT 0 CHECK (budget_score >= 0 AND budget_score <= 100),
  authority_score INTEGER DEFAULT 0 CHECK (authority_score >= 0 AND authority_score <= 100),
  need_score INTEGER DEFAULT 0 CHECK (need_score >= 0 AND need_score <= 100),
  timeline_score INTEGER DEFAULT 0 CHECK (timeline_score >= 0 AND timeline_score <= 100),
  total_score INTEGER GENERATED ALWAYS AS ((budget_score + authority_score + need_score + timeline_score) / 4) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lead_id)
);

-- Create chat_messages table for lead conversations
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'lead')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'notification')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_activities table for tracking interactions
CREATE TABLE public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for leads
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for lead_scores
CREATE POLICY "Users can view own lead scores" ON public.lead_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_scores.lead_id AND leads.user_id = auth.uid())
);
CREATE POLICY "Users can create own lead scores" ON public.lead_scores FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_scores.lead_id AND leads.user_id = auth.uid())
);
CREATE POLICY "Users can update own lead scores" ON public.lead_scores FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_scores.lead_id AND leads.user_id = auth.uid())
);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own lead chats" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = chat_messages.lead_id AND leads.user_id = auth.uid())
);
CREATE POLICY "Users can create own lead chats" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = chat_messages.lead_id AND leads.user_id = auth.uid())
);

-- RLS Policies for lead_activities
CREATE POLICY "Users can view own lead activities" ON public.lead_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_activities.lead_id AND leads.user_id = auth.uid())
);
CREATE POLICY "Users can create own lead activities" ON public.lead_activities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_activities.lead_id AND leads.user_id = auth.uid())
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
