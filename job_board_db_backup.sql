--
-- PostgreSQL database dump
--



-- Dumped from database version 17.7 (Debian 17.7-3.pgdg12+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    job_id integer,
    seeker_id integer,
    seeker_name character varying(255) NOT NULL,
    seeker_email character varying(255) NOT NULL,
    resume_url character varying(500) NOT NULL,
    cover_letter text,
    status character varying(20) DEFAULT 'New'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT applications_status_check CHECK (((status)::text = ANY ((ARRAY['New'::character varying, 'Reviewing'::character varying, 'Shortlisted'::character varying, 'Rejected'::character varying, 'Accepted'::character varying])::text[])))
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    employer_id integer,
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    job_type character varying(50) NOT NULL,
    description text NOT NULL,
    requirements text,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT jobs_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'jobseeker'::character varying, 'employer'::character varying, 'seeker'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, job_id, seeker_id, seeker_name, seeker_email, resume_url, cover_letter, status, created_at) FROM stdin;
1	1	20	Job Seeker Test	seeker@postman.com	https://res.cloudinary.com/dyjgxzbgt/raw/upload/v1767386880/job-board/resumes/resume-1767386873243-459874685	I am very interested in this position. With my 6 years of experience in full-stack development, I believe I would be a great fit for your team.	Reviewing	2026-01-02 21:47:56.355688
2	1	21	sun peace	ah@gmail.com	https://res.cloudinary.com/dyjgxzbgt/raw/upload/v1767389263/job-board/resumes/resume-1767389254684-376265494	\N	New	2026-01-02 22:27:38.71527
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, employer_id, title, company, location, job_type, description, requirements, status, created_at, updated_at) FROM stdin;
1	14	Senior Full-Stack Developer	Tech Innovations Inc.	San Francisco, CA	Full-time	We are looking for an experienced full-stack developer to join our dynamic team. You will work on cutting-edge projects using modern technologies.	- 5+ years of experience with React and Node.js\n- Strong knowledge of PostgreSQL\n- Experience with cloud services (AWS/Azure)\n- Excellent communication skills	active	2026-01-02 20:45:25.575197	2026-01-02 20:56:12.336861
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
14	Employer Test	employer@postman.com	$2b$10$VHapo8bY1xCPLndYUxlgLeeUL6Z1J9kuN.vlWsk9LzGO5OU2RroQ.	employer	2026-01-02 20:15:29.458825
16	Employer Test	employer1@postman.com	$2b$10$xgdy6NqrwTlRvWFXq2sj1.SpZyiJodXKVO0TJPXntUxm79Y8hwlB6	employer	2026-01-02 20:20:12.270331
18	Employer Test	employer_@postman.com	$2b$10$xZzJG0ZWZKUnUKOL6eoTzOg6XAsgb9WB7DW.wK85zX40nJ3jpxRr.	employer	2026-01-02 20:22:12.648147
20	Job Seeker Test	seeker@postman.com	$2b$10$yfIhjrvE/bZ0W76aaWh3KunTZ8H/FOmkBnW51GjhzfE0fsLHC17NC	seeker	2026-01-02 20:29:39.729838
21	sun peace	ah@gmail.com	$2b$10$jYO/vCEf1z2./sUY8gCWA.fcbg0vXcqVl8gINAuM6Jv27vVA7Spgi	seeker	2026-01-02 22:23:52.562095
22	Ulrich Billa	Billa@gmail.com	$2b$10$RlZtaW/ZHNV46C7t/RZY/.CsDc6Y5OEykzSpd/uN7vyw37u.v98Ye	employer	2026-01-02 22:32:57.697526
23	Merveille	merv@gmail.com	$2b$10$GhmdJznXq9x43JMTSHIswertHCbyTU8KuuuZjjo5ZMugV4w.weghe	employer	2026-01-03 12:34:48.030002
24	sasfdhgc	as@gmail.com	$2b$10$Hy2E.UtZ6bpAN7y/5bs2d.Nh33ovOXnBZsQSoFpIH1pHOigIl4FjK	employer	2026-01-03 21:51:37.767088
25	lindah	lindah.ngeywo@aims-cameroon.org	$2b$10$U5tlZXhdWlmjmfgOrShBwOBmSDlqJa7tHQLyD9RkV/lL2JuZJrIKa	seeker	2026-01-03 22:04:26.145665
26	Aimee	aimee@gmail.com	$2b$10$2TwijSIXDOZOypLee/R3yeU0FtDnVT1aOFHHtllgFJgLqD.2crGAC	employer	2026-01-03 22:37:27.282559
27	wqw	qeq@gmail.com	$2b$10$5hHLQFEvN/z6MTyVWD6oPeTfJPQ9MxeqTxEIV43GKcgPR./nSTnN.	seeker	2026-01-03 23:06:59.476753
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 2, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 27, true);


--
-- Name: applications applications_job_id_seeker_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_seeker_id_key UNIQUE (job_id, seeker_id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_applications_job; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_job ON public.applications USING btree (job_id);


--
-- Name: idx_applications_seeker; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_seeker ON public.applications USING btree (seeker_id);


--
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status ON public.applications USING btree (status);


--
-- Name: idx_jobs_employer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_employer ON public.jobs USING btree (employer_id);


--
-- Name: idx_jobs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_jobs_status ON public.jobs USING btree (status);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: applications applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: applications applications_seeker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_seeker_id_fkey FOREIGN KEY (seeker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: jobs jobs_employer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--



