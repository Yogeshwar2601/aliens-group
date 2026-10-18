CREATE TABLE IF NOT EXISTS projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    category VARCHAR(40) NOT NULL CHECK (
        category IN ('Residential', 'Luxury', 'Golf Villa', 'Hill Township', 'Commercial')
    ),
    location VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Ongoing'
        CHECK (status IN ('Ongoing', 'Upcoming')),
    description TEXT NOT NULL DEFAULT '',
    area_range VARCHAR(150) NOT NULL DEFAULT '',
    community_type VARCHAR(150) NOT NULL DEFAULT '',
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    unit_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    design_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    growth_axis JSONB NOT NULL DEFAULT '[]'::jsonb,
    layouts TEXT[] NOT NULL DEFAULT '{}',
    amenity_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    nearby_places JSONB NOT NULL DEFAULT '[]'::jsonb,
    map_url TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    gallery TEXT[] NOT NULL DEFAULT '{}',
    brochure_url TEXT NOT NULL DEFAULT '',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS unit_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS design_features JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS projects_category_published_idx
    ON projects (category, published);
CREATE INDEX IF NOT EXISTS projects_category_status_published_idx
    ON projects (category, status, published);
CREATE INDEX IF NOT EXISTS projects_featured_published_idx
    ON projects (featured, published);

CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    excerpt VARCHAR(600) NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    author VARCHAR(150) NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blogs_published_date_idx
    ON blogs (published, published_at DESC);
CREATE INDEX IF NOT EXISTS blogs_category_published_idx
    ON blogs (category, published);

CREATE TABLE IF NOT EXISTS construction_updates (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_slug VARCHAR(160) REFERENCES projects(slug) ON DELETE SET NULL,
    project_name VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    milestone VARCHAR(150) NOT NULL DEFAULT '',
    progress_percent SMALLINT CHECK (
        progress_percent IS NULL OR progress_percent BETWEEN 0 AND 100
    ),
    update_date DATE NOT NULL DEFAULT CURRENT_DATE,
    image_url TEXT NOT NULL DEFAULT '',
    gallery TEXT[] NOT NULL DEFAULT '{}',
    video_url TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS construction_updates_project_date_idx
    ON construction_updates (project_slug, update_date DESC);
CREATE INDEX IF NOT EXISTS construction_updates_published_date_idx
    ON construction_updates (published, update_date DESC);

CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    property_type VARCHAR(150) NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    source VARCHAR(20) NOT NULL DEFAULT 'contact'
        CHECK (source IN ('contact', 'enquire', 'site-visit', 'reach-us')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_visits (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
