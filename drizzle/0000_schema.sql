-- Create sessions table for Replit Auth
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" VARCHAR(255) PRIMARY KEY,
  "sess" JSONB NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR(255) PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "profile_image_url" VARCHAR(255),
  "created_at" TIMESTAMP(6) DEFAULT now(),
  "updated_at" TIMESTAMP(6) DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS "documents" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "content" TEXT NOT NULL,
  "xml" TEXT NOT NULL,
  "current_version" TEXT NOT NULL DEFAULT '1.0',
  "created_by" VARCHAR(255) NOT NULL REFERENCES "users"("id"),
  "updated_by" VARCHAR(255) NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now()
);

-- Create document_versions table
CREATE TABLE IF NOT EXISTS "document_versions" (
  "id" SERIAL PRIMARY KEY,
  "document_id" INTEGER NOT NULL REFERENCES "documents"("id"),
  "version" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "xml" TEXT NOT NULL,
  "created_by" VARCHAR(255) NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "description" TEXT,
  "is_current" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create activities table
CREATE TABLE IF NOT EXISTS "activities" (
  "id" SERIAL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "user_id" VARCHAR(255) NOT NULL REFERENCES "users"("id"),
  "document_id" INTEGER REFERENCES "documents"("id"),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now()
);

-- Create verification_issues table
CREATE TABLE IF NOT EXISTS "verification_issues" (
  "id" SERIAL PRIMARY KEY,
  "document_id" INTEGER NOT NULL REFERENCES "documents"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "location" TEXT NOT NULL,
  "conflicting_reference_id" TEXT,
  "conflicting_reference_title" TEXT,
  "conflicting_reference_content" TEXT,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now()
);

-- Create related_legislation table
CREATE TABLE IF NOT EXISTS "related_legislation" (
  "id" SERIAL PRIMARY KEY,
  "document_id" INTEGER NOT NULL REFERENCES "documents"("id"),
  "title" TEXT NOT NULL,
  "relevance" INTEGER NOT NULL,
  "external_id" TEXT
);

-- Create knowledge_graph_nodes table
CREATE TABLE IF NOT EXISTS "knowledge_graph_nodes" (
  "id" VARCHAR(100) PRIMARY KEY,
  "label" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "properties" JSONB
);

-- Create knowledge_graph_edges table
CREATE TABLE IF NOT EXISTS "knowledge_graph_edges" (
  "id" VARCHAR(100) PRIMARY KEY,
  "source" VARCHAR(100) NOT NULL REFERENCES "knowledge_graph_nodes"("id"),
  "target" VARCHAR(100) NOT NULL REFERENCES "knowledge_graph_nodes"("id"),
  "label" TEXT NOT NULL,
  "properties" JSONB
);

-- Create legal_terms table
CREATE TABLE IF NOT EXISTS "legal_terms" (
  "id" SERIAL PRIMARY KEY,
  "term" TEXT NOT NULL UNIQUE,
  "definition" TEXT NOT NULL,
  "source" TEXT,
  "category" TEXT,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now()
);