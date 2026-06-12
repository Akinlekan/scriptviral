-- ScriptViral initial schema
-- Run this in your Supabase SQL Editor

-- User profiles (no Stripe columns)
CREATE TABLE IF NOT EXISTS users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage tracking (analytics only — no limits enforced)
CREATE TABLE IF NOT EXISTS usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL,
    count INT NOT NULL DEFAULT 0,
    UNIQUE(user_id, month_year)
);

-- Saved scripts
CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Script',
    genre TEXT NOT NULL,
    platform TEXT NOT NULL,
    tone TEXT NOT NULL,
    hook TEXT NOT NULL DEFAULT '',
    script TEXT NOT NULL DEFAULT '',
    scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
    titles TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users_profiles (id, plan)
    VALUES (NEW.id, 'free');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- users_profiles policies
CREATE POLICY "Users can view own profile"
    ON users_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users_profiles FOR UPDATE
    USING (auth.uid() = id);

-- usage policies
CREATE POLICY "Users can view own usage"
    ON usage FOR SELECT
    USING (auth.uid() = user_id);

-- scripts policies
CREATE POLICY "Users can view own scripts"
    ON scripts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
    ON scripts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
    ON scripts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
    ON scripts FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_scripts_user ON scripts(user_id, created_at DESC);
