--
-- PostgreSQL database dump
--

\restrict smUXtmgpnM0bqvCKm6rM4tmPlP62KAUDdvPQROdQP9hb5zJaBzmrPfknGfB0WOd

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_available_copies(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_available_copies() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.available_copies := NEW.total_copies;
  NEW.status := 'available';
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    first_name character varying(80) NOT NULL,
    last_name character varying(80),
    email character varying(150) NOT NULL,
    phone character varying(15),
    password_hash character varying(255),
    google_id text,
    role character varying(20) DEFAULT 'admin'::character varying NOT NULL,
    state_id integer,
    city_id integer,
    is_active boolean DEFAULT true,
    is_deleted boolean DEFAULT false,
    is_profile_complete boolean DEFAULT false,
    email_verified boolean DEFAULT false,
    invite_token text,
    invite_token_expiry timestamp without time zone,
    reset_otp character varying(10),
    reset_otp_expiry timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_online boolean DEFAULT false,
    last_seen timestamp without time zone,
    dob date,
    CONSTRAINT role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'superadmin'::character varying])::text[])))
);


--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    isbn character varying(20) NOT NULL,
    category_id integer NOT NULL,
    total_copies integer NOT NULL,
    available_copies integer DEFAULT 0 NOT NULL,
    shelf_location character varying(50),
    status character varying(20) DEFAULT 'available'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT books_check CHECK (((available_copies >= 0) AND (available_copies <= total_copies))),
    CONSTRAINT books_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'out_of_stock'::character varying, 'archived'::character varying])::text[]))),
    CONSTRAINT books_total_copies_check CHECK ((total_copies >= 0))
);


--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    state_id integer,
    name character varying(100) NOT NULL
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: contact_us; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_us (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(20) DEFAULT 'unread'::character varying NOT NULL,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT contact_us_status_check CHECK (((status)::text = ANY ((ARRAY['unread'::character varying, 'read'::character varying, 'resolved'::character varying])::text[])))
);


--
-- Name: contact_us_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_us_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_us_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_us_id_seq OWNED BY public.contact_us.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    iso2 character(2) NOT NULL,
    iso3 character(3),
    phone_code character varying(10),
    currency character varying(20),
    emoji character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    message text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    ip_address character varying(50),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issues (
    id integer NOT NULL,
    book_id integer,
    member_id integer,
    issue_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp without time zone,
    return_date timestamp without time zone,
    status character varying(20) DEFAULT 'issued'::character varying
);


--
-- Name: issues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.issues_id_seq OWNED BY public.issues.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50),
    email character varying(120) NOT NULL,
    phone character varying(15) NOT NULL,
    date_of_birth date,
    state_id integer,
    city_id integer,
    membership_start date DEFAULT CURRENT_DATE,
    membership_end date,
    max_books_allowed integer DEFAULT 3,
    status character varying(20) DEFAULT 'active'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying(255),
    google_id character varying(255),
    reset_otp character varying(6),
    reset_otp_expiry timestamp with time zone,
    email_verified boolean DEFAULT false
);


--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: otp_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_verifications (
    id integer NOT NULL,
    email character varying(255),
    otp character varying(6),
    expires_at timestamp without time zone,
    is_verified boolean DEFAULT false
);


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.otp_verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.otp_verifications_id_seq OWNED BY public.otp_verifications.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_revoked boolean DEFAULT false
);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    issue_id integer,
    return_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fine_amount numeric(10,2) DEFAULT 0
);


--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.states (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: state_member_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.state_member_counts AS
 SELECT s.name AS state_name,
    count(m.id) AS total_members
   FROM (public.members m
     JOIN public.states s ON ((m.state_id = s.id)))
  GROUP BY s.name;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    member_id integer NOT NULL,
    book_id integer NOT NULL,
    issue_date date DEFAULT CURRENT_DATE,
    due_date date NOT NULL,
    return_date date,
    fine_amount numeric(10,2) DEFAULT 0,
    status character varying(20) DEFAULT 'issued'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_status_check CHECK (((status)::text = ANY ((ARRAY['issued'::character varying, 'returned'::character varying, 'overdue'::character varying])::text[])))
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: contact_us id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_us ALTER COLUMN id SET DEFAULT nextval('public.contact_us_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: issues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues ALTER COLUMN id SET DEFAULT nextval('public.issues_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: otp_verifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verifications ALTER COLUMN id SET DEFAULT nextval('public.otp_verifications_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin (id, first_name, last_name, email, phone, password_hash, google_id, role, state_id, city_id, is_active, is_deleted, is_profile_complete, email_verified, invite_token, invite_token_expiry, reset_otp, reset_otp_expiry, created_at, updated_at, is_online, last_seen, dob) FROM stdin;
7	Saurabh	Kashyap	skkashyap2328@gmail.com	9193142041	$2b$10$97umVOyVzr2bR.s/PQPoHuSJudKERmdGEEap9r5i34j2VxEnjpVny	\N	superadmin	27	266	t	f	f	t	\N	\N	977872	2026-07-12 01:57:38.29	2026-06-19 02:45:12.663537	2026-06-19 02:45:12.663537	t	2026-07-12 01:47:32.610433	2008-06-16
6	Saurabh	Kashyap	extremehaker007@gmail.com	6399232841	$2b$10$Hy/UCLT9ZsDSO.XxJOEPG.94P1lLq084i6RvEhhrjMWshd461EjSC	\N	admin	27	266	t	f	f	t	\N	\N	\N	\N	2026-04-24 12:44:58.953363	2026-06-18 01:37:43.797348	f	2026-06-18 01:40:59.621782	2008-03-31
1	AVP	Authenticator	onlinelibrarylms@gmail.com	6399232854	$2b$10$6SZ/yj5H.J7rAu58lBob.es9hLr/Sa2J8LxrW4s6KvUm3sDiX9r5W	\N	superadmin	26	251	t	f	f	t	\N	\N	\N	\N	2026-04-16 16:17:17.127932	2026-06-18 01:33:15.10949	t	2026-06-19 02:02:50.007615	2008-04-03
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.books (id, title, author, isbn, category_id, total_copies, available_copies, shelf_location, status, is_deleted, created_at, updated_at) FROM stdin;
2	The Innovators	Walter Isaacson	9781476708706	1	4	4	T-A2	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
4	Computer Networks	Andrew S Tanenbaum	9780132126953	2	3	3	CS-B2	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
5	You Donâ€™t Know JS	Kyle Simpson	9781491904244	3	5	5	P-C1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
6	Python Crash Course	Eric Matthes	9781593279288	3	4	4	P-C2	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
10	Hands-On Machine Learning	Aurelien Geron	9781492032649	6	5	5	ML-F1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
11	Data Science from Scratch	Joel Grus	9781492041139	7	4	4	DS-G1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
12	The Web Application Hacker Handbook	Dafydd Stuttard	9781118026472	8	3	3	CY-H1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
13	Computer Networking	James Kurose	9780133594140	9	4	4	NW-I1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
14	The Mythical Man-Month	Frederick Brooks	9780201835953	10	3	3	SE-J1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
15	Eloquent JavaScript	Marijn Haverbeke	9781593279509	11	5	5	WD-K1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
16	Android Programming	Big Nerd Ranch	9780134706054	12	3	3	MB-L1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
17	Cloud Computing Basics	Rajkumar Buyya	9780133387520	13	4	4	CC-M1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
18	The Phoenix Project	Gene Kim	9780988262591	14	4	4	DO-N1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
20	Grokking Algorithms	Aditya Bhargava	9781617292231	16	5	5	AL-P1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
21	Data Structures Using C	Reema Thareja	9780198099307	17	4	4	DS-Q1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
22	Discrete Mathematics	Kenneth Rosen	9780073383095	19	5	5	MA-R1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
23	Concepts of Physics	HC Verma	9788177091878	20	6	6	PH-S1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
24	The Lean Startup	Eric Ries	9780307887894	26	4	4	BU-T1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
25	Rich Dad Poor Dad	Robert Kiyosaki	9781612680194	27	5	5	FI-U1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
26	Thinking Fast and Slow	Daniel Kahneman	9780374533557	29	4	4	PS-V1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
27	Atomic Habits	James Clear	9780735211292	30	6	6	SH-W1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
28	The Alchemist	Paulo Coelho	9780062315007	35	5	5	FC-X1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
30	Sherlock Holmes	Arthur Conan Doyle	9780451524935	38	4	4	MY-Z1	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
31	Steve Jobs	Walter Isaacson	9781451648539	41	3	3	BG-A3	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
32	The Art of Teaching	Gilbert Highet	9780674872554	43	3	3	ED-B3	available	f	2026-04-01 14:27:16.998334	2026-04-01 14:27:16.998334
29	Harry Potter	JK Rowling	9780545582889	37	10	7	FA-Y1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:19:51.935136
9	Artificial Intelligence A Modern Approach	Stuart Russell	9780136042594	5	20	4	AI-E1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:20:05.523136
8	SQL in 10 Minutes	Ben Forta	9780672336072	4	21	3	DB-D2	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:21:06.273956
1	Clean Code	Robert C Martin	9780132350884	1	5	5	T-A1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:21:33.930621
3	Introduction to Algorithms	Thomas H Cormen	9780262046305	2	15	6	CS-B1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:35:32.828272
7	Database System Concepts	Silberschatz	9780073523323	4	20	5	DB-D1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:35:47.904787
19	Operating System Concepts	Silberschatz	9781118063330	15	25	6	OS-O1	available	f	2026-04-01 14:27:16.998334	2026-04-21 13:36:06.705166
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, created_at) FROM stdin;
2	Computer Science	Core computer science concepts, theory, and computing fundamentals.	2026-04-01 13:13:37.89665
3	Programming	Coding books covering various programming languages and techniques.	2026-04-01 13:13:37.89665
4	Databases	Database design, SQL, NoSQL, and data management systems.	2026-04-01 13:13:37.89665
5	Artificial Intelligence	AI concepts including intelligent systems and automation.	2026-04-01 13:13:37.89665
6	Machine Learning	ML algorithms, models, and practical implementations.	2026-04-01 13:13:37.89665
7	Data Science	Data analysis, visualization, statistics, and big data.	2026-04-01 13:13:37.89665
8	Cyber Security	Information security, ethical hacking, and network security.	2026-04-01 13:13:37.89665
9	Networking	Computer networks, protocols, and network architecture.	2026-04-01 13:13:37.89665
10	Software Engineering	Software development lifecycle, architecture, and best practices.	2026-04-01 13:13:37.89665
11	Web Development	Frontend and backend web development technologies.	2026-04-01 13:13:37.89665
12	Mobile Development	Android, iOS, and cross-platform mobile app development.	2026-04-01 13:13:37.89665
13	Cloud Computing	Cloud platforms, distributed computing, and cloud architecture.	2026-04-01 13:13:37.89665
14	DevOps	CI/CD, automation, deployment, and infrastructure management.	2026-04-01 13:13:37.89665
15	Operating Systems	Concepts of OS like Linux, Windows, memory, and processes.	2026-04-01 13:13:37.89665
16	Algorithms	Algorithm design, analysis, and problem-solving techniques.	2026-04-01 13:13:37.89665
17	Data Structures	Data organization and structures like arrays, trees, graphs.	2026-04-01 13:13:37.89665
18	Science	General science and scientific discoveries.	2026-04-01 13:13:37.89665
19	Mathematics	Pure and applied mathematics concepts and theories.	2026-04-01 13:13:37.89665
20	Physics	Physics principles including motion, energy, and matter.	2026-04-01 13:13:37.89665
21	Chemistry	Chemical reactions, compounds, and laboratory science.	2026-04-01 13:13:37.89665
22	Biology	Study of living organisms and life sciences.	2026-04-01 13:13:37.89665
23	History	Historical events, civilizations, and world history.	2026-04-01 13:13:37.89665
24	Geography	Earth, environment, and physical geography.	2026-04-01 13:13:37.89665
25	Economics	Microeconomics, macroeconomics, and economic theory.	2026-04-01 13:13:37.89665
26	Business	Business strategy, entrepreneurship, and management.	2026-04-01 13:13:37.89665
27	Finance	Financial management, investing, and banking.	2026-04-01 13:13:37.89665
28	Marketing	Marketing strategies, branding, and advertising.	2026-04-01 13:13:37.89665
29	Psychology	Human behavior and mental processes.	2026-04-01 13:13:37.89665
30	Self Help	Personal development and self-improvement books.	2026-04-01 13:13:37.89665
31	Productivity	Time management and productivity improvement.	2026-04-01 13:13:37.89665
32	Health	General health and wellness.	2026-04-01 13:13:37.89665
33	Fitness	Exercise, workouts, and physical fitness.	2026-04-01 13:13:37.89665
34	Medicine	Medical science and healthcare.	2026-04-01 13:13:37.89665
35	Fiction	Imaginary stories and literature novels.	2026-04-01 13:13:37.89665
36	Non-Fiction	Real stories, facts, and informational books.	2026-04-01 13:13:37.89665
37	Fantasy	Fantasy stories with magical or supernatural elements.	2026-04-01 13:13:37.89665
38	Mystery	Mystery and detective stories.	2026-04-01 13:13:37.89665
41	Biography	Life stories of famous people.	2026-04-01 13:13:37.89665
42	Autobiography	Self-written life stories.	2026-04-01 13:13:37.89665
43	Education	Academic and educational books.	2026-04-01 13:13:37.89665
44	Children	Books for kids and young readers.	2026-04-01 13:13:37.89665
45	Comics	Comic books and graphic novels.	2026-04-01 13:13:37.89665
46	Travel	Travel guides and travel stories.	2026-04-01 13:13:37.89665
47	Religion	Religious and spiritual books.	2026-04-01 13:13:37.89665
49	Design	Graphic, UI/UX, and product design.	2026-04-01 13:13:37.89665
50	Photography	Photography techniques and guides.	2026-04-01 13:13:37.89665
51	Music	Music theory, instruments, and songs.	2026-04-01 13:13:37.89665
1	Technology	Books about modern technology, innovation, and technical advancements.	2026-04-01 13:13:37.89665
40	Romance		2026-04-01 13:13:37.89665
48	Art		2026-04-01 13:13:37.89665
39	Thriller		2026-04-01 13:13:37.89665
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cities (id, state_id, name) FROM stdin;
1	1	Visakhapatnam
2	1	Vijayawada
3	1	Guntur
4	1	Nellore
5	1	Kurnool
6	1	Rajahmundry
7	1	Tirupati
8	1	Anantapur
9	1	Eluru
10	1	Kadapa
11	2	Itanagar
12	2	Tawang
13	2	Ziro
14	2	Pasighat
15	2	Roing
16	2	Bomdila
17	2	Tezu
18	2	Naharlagun
19	2	Seppa
20	2	Aalo
21	3	Guwahati
22	3	Silchar
23	3	Dibrugarh
24	3	Jorhat
25	3	Nagaon
26	3	Tinsukia
27	3	Tezpur
28	3	Bongaigaon
29	3	Karimganj
30	3	Sivasagar
31	4	Patna
32	4	Gaya
33	4	Bhagalpur
34	4	Muzaffarpur
35	4	Darbhanga
36	4	Purnia
37	4	Arrah
38	4	Begusarai
39	4	Katihar
40	4	Munger
41	5	Raipur
42	5	Bhilai
43	5	Durg
44	5	Bilaspur
45	5	Korba
46	5	Rajnandgaon
47	5	Jagdalpur
48	5	Ambikapur
49	5	Raigarh
50	5	Dhamtari
51	6	Panaji
52	6	Margao
53	6	Vasco da Gama
54	6	Mapusa
55	6	Ponda
56	6	Bicholim
57	6	Curchorem
58	6	Sanquelim
59	6	Canacona
60	6	Quepem
61	7	Ahmedabad
62	7	Surat
63	7	Vadodara
64	7	Rajkot
65	7	Bhavnagar
66	7	Jamnagar
67	7	Junagadh
68	7	Gandhinagar
69	7	Anand
70	7	Navsari
71	8	Gurgaon
72	8	Faridabad
73	8	Panipat
74	8	Ambala
75	8	Karnal
76	8	Hisar
77	8	Rohtak
78	8	Sonipat
79	8	Yamunanagar
80	8	Panchkula
81	9	Shimla
82	9	Manali
83	9	Dharamshala
84	9	Solan
85	9	Mandi
86	9	Kullu
87	9	Chamba
88	9	Bilaspur
89	9	Hamirpur
90	9	Una
91	10	Ranchi
92	10	Jamshedpur
93	10	Dhanbad
94	10	Bokaro
95	10	Deoghar
96	10	Hazaribagh
97	10	Giridih
98	10	Ramgarh
99	10	Medininagar
100	10	Chatra
101	11	Bangalore
102	11	Mysore
103	11	Mangalore
104	11	Hubli
105	11	Belgaum
106	11	Davangere
107	11	Bellary
108	11	Shimoga
109	11	Tumkur
110	11	Udupi
111	12	Thiruvananthapuram
112	12	Kochi
113	12	Kozhikode
114	12	Thrissur
115	12	Kannur
116	12	Alappuzha
117	12	Kollam
118	12	Palakkad
119	12	Malappuram
120	12	Kottayam
121	13	Bhopal
122	13	Indore
123	13	Gwalior
124	13	Jabalpur
125	13	Ujjain
126	13	Sagar
127	13	Rewa
128	13	Satna
129	13	Ratlam
130	13	Dewas
131	14	Mumbai
132	14	Pune
133	14	Nagpur
134	14	Nashik
135	14	Aurangabad
136	14	Solapur
137	14	Kolhapur
138	14	Amravati
139	14	Nanded
140	14	Sangli
141	15	Imphal
142	15	Thoubal
143	15	Bishnupur
144	15	Churachandpur
145	15	Ukhrul
146	15	Senapati
147	15	Tamenglong
148	15	Kakching
149	15	Jiribam
150	15	Moreh
151	16	Shillong
152	16	Tura
153	16	Nongpoh
154	16	Jowai
155	16	Baghmara
156	16	Williamnagar
157	16	Resubelpara
158	16	Mairang
159	16	Nongstoin
160	16	Cherrapunji
161	17	Aizawl
162	17	Lunglei
163	17	Champhai
164	17	Serchhip
165	17	Kolasib
166	17	Saiha
167	17	Lawngtlai
168	17	Mamit
169	17	Saitual
170	17	Khawzawl
171	18	Kohima
172	18	Dimapur
173	18	Mokokchung
174	18	Tuensang
175	18	Wokha
176	18	Zunheboto
177	18	Phek
178	18	Mon
179	18	Longleng
180	18	Kiphire
181	19	Bhubaneswar
182	19	Cuttack
183	19	Rourkela
184	19	Puri
185	19	Sambalpur
186	19	Berhampur
187	19	Balasore
188	19	Baripada
189	19	Jharsuguda
190	19	Jeypore
191	20	Ludhiana
192	20	Amritsar
193	20	Jalandhar
194	20	Patiala
195	20	Bathinda
196	20	Mohali
197	20	Hoshiarpur
198	20	Pathankot
199	20	Moga
200	20	Abohar
201	21	Jaipur
202	21	Udaipur
203	21	Jodhpur
204	21	Kota
205	21	Bikaner
206	21	Ajmer
207	21	Alwar
208	21	Bharatpur
209	21	Sikar
210	21	Pali
211	22	Gangtok
212	22	Namchi
213	22	Gyalshing
214	22	Mangan
215	22	Rangpo
216	22	Singtam
217	22	Jorethang
218	22	Nayabazar
219	22	Ravangla
220	22	Soreng
221	23	Chennai
222	23	Coimbatore
223	23	Madurai
224	23	Salem
225	23	Tiruchirappalli
226	23	Tirunelveli
227	23	Erode
228	23	Vellore
229	23	Thoothukudi
230	23	Dindigul
231	24	Hyderabad
232	24	Warangal
233	24	Nizamabad
234	24	Karimnagar
235	24	Khammam
236	24	Ramagundam
237	24	Mahbubnagar
238	24	Adilabad
239	24	Suryapet
240	24	Miryalaguda
241	25	Agartala
242	25	Udaipur
243	25	Dharmanagar
244	25	Kailashahar
245	25	Belonia
246	25	Ambassa
247	25	Khowai
248	25	Sabroom
249	25	Sonamura
250	25	Teliamura
251	26	Lucknow
252	26	Kanpur
253	26	Varanasi
254	26	Agra
255	26	Meerut
256	26	Prayagraj
257	26	Ghaziabad
258	26	Noida
259	26	Bareilly
260	26	Aligarh
261	27	Dehradun
262	27	Haridwar
263	27	Roorkee
264	27	Haldwani
265	27	Nainital
266	27	Rudrapur
267	27	Kashipur
268	27	Rishikesh
269	27	Pithoragarh
270	27	Almora
271	28	Kolkata
272	28	Howrah
273	28	Durgapur
274	28	Asansol
275	28	Siliguri
276	28	Darjeeling
277	28	Malda
278	28	Kharagpur
279	28	Haldia
280	28	Bardhaman
\.


--
-- Data for Name: contact_us; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_us (id, name, email, subject, message, status, ip_address, user_agent, created_at, updated_at) FROM stdin;
2	Saurabh	skkashyap2328@gmail.com	Library	Can you update book pdf to explore and reserch	unread	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-16 12:48:16.435451+05:30	2026-05-16 12:48:16.435451+05:30
3	Saurabh	skkashyap2328@gmail.com	Library	esesesex xcdvdfffcsdf	unread	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:19:41.827722+05:30	2026-05-18 18:19:41.827722+05:30
4	Saurabh	onlinelibrarylms@gmail.com	Library	dafsfsfsafsafsafsasaasas	unread	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:33:44.876273+05:30	2026-05-18 18:33:44.876273+05:30
5	Saurabh	skkashyap2328@gmail.com	Library	kuwefjfvw sdku ker k errgeroy wewe	unread	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:37:21.245099+05:30	2026-05-18 18:37:21.245099+05:30
6	Saurabh	saurabhoffice0@gmail.com	Essue Page When Comming...	So fixed it immdiatly\nbook essue or return probelm	unread	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-18 01:42:55.126312+05:30	2026-06-18 01:42:55.126312+05:30
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.countries (id, name, iso2, iso3, phone_code, currency, emoji, created_at) FROM stdin;
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feedback (id, name, email, message, status, ip_address, user_agent, created_at, updated_at) FROM stdin;
7	Saurabh	skkashyap2328@gmail.com	There is the lots of resources	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.120.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36	2026-05-14 19:55:34.737897	2026-05-14 19:55:34.737897
8	Kashyap	onlinelibrarylms@gmail.com	g,jhgherkuweajetuqwktqewtqwt	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-15 19:06:14.723208	2026-05-15 19:06:14.723208
9	Saurabh	skkashyap2328@gmail.com	wkjfhwikwbgewuewsviherv3elvihdier	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:31:21.383749	2026-05-18 18:31:21.383749
10	Saurabh	onlinelibrarylms@gmail.com	wkjfhwikwbgewuewsviherv3elvihdier	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:32:18.315589	2026-05-18 18:32:18.315589
11	Saurabh	onlinelibrarylms@gmail.com	wkjfhwikwbgewuewsviherv3elvihdier	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:32:26.050057	2026-05-18 18:32:26.050057
13	Saurabh	skkashyap2328@gmail.com	werkuewfewk 89ye wewr	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-18 18:38:42.893164	2026-05-18 18:38:42.893164
14	Saurabh	skkashyap2328@gmail.com	werkuewfewk 89ye wewr	new	::1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-18 18:38:58.737036	2026-05-18 18:38:58.737036
2	Saurabh	skkashyap2328@gmail.com	There is lots of technologies books of resources	new	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-07 12:12:15.316242	2026-05-13 12:23:43.522931
1	Saurabh	skkashyap2328@gmail.com	hii there is the lot of sorces of info	reviewed	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-07 11:36:07.943757	2026-05-13 12:23:46.583581
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.issues (id, book_id, member_id, issue_date, due_date, return_date, status) FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, first_name, last_name, email, phone, date_of_birth, state_id, city_id, membership_start, membership_end, max_books_allowed, status, is_deleted, created_at, updated_at, password, google_id, reset_otp, reset_otp_expiry, email_verified) FROM stdin;
3	Amit	Kumar	amit.kumar007@example.com	9876543212	1992-11-05	2	3	2026-04-20	2026-08-01	4	inactive	f	2026-04-20 12:19:04.889379	2026-04-20 12:19:04.889379	\N	\N	\N	\N	f
4	Neha	Singh	neha.singh007@example.com	9876543213	2000-01-25	2	4	2026-04-20	2027-01-01	2	active	f	2026-04-20 12:19:04.889379	2026-04-20 12:19:04.889379	\N	\N	\N	\N	f
5	Rohit	Mehta	rohit.mehta007@example.com	9876543214	1994-09-10	3	5	2026-04-20	2026-09-30	3	active	f	2026-04-20 12:19:04.889379	2026-04-20 12:19:04.889379	\N	\N	\N	\N	f
1	Rahul	Sharma	rahul.sharma007@example.com	9876543210	1995-06-15	1	1	2026-04-20	2026-12-29	5	active	f	2026-04-20 12:19:04.889379	2026-04-20 12:25:57.288393	\N	\N	\N	\N	f
2	Priya	Verma	priya.verma007@example.com	9876543211	1998-02-20	1	2	2026-04-20	2026-10-13	3	active	f	2026-04-20 12:19:04.889379	2026-04-20 12:27:13.142527	\N	\N	\N	\N	f
\.


--
-- Data for Name: otp_verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_verifications (id, email, otp, expires_at, is_verified) FROM stdin;
1	onlinelibrarylms@gmail.com	314496	2026-04-16 15:37:20.388	f
2	onlinelibrarylms@gmail.com	655409	2026-04-16 15:37:25.866	f
3	onlinelibrarylms@gmail.com	819691	2026-04-16 15:37:28.824	f
4	onlinelibrarylms@gmail.com	484075	2026-04-16 15:37:29.891	f
5	onlinelibrarylms@gmail.com	313912	2026-04-16 15:37:30.061	f
6	onlinelibrarylms@gmail.com	906656	2026-04-16 15:37:30.278	f
7	onlinelibrarylms@gmail.com	504333	2026-04-16 15:37:32.281	f
8	onlinelibrarylms@gmail.com	624192	2026-04-16 15:37:38.922	f
9	onlinelibrarylms@gmail.com	247198	2026-04-16 15:38:49.429	f
10	onlinelibrarylms@gmail.com	141157	2026-04-16 15:58:52.339	f
11	onlinelibrarylms@gmail.com	100530	2026-04-16 16:17:52.597	t
12	extremehaker007@gmail.com	109706	2026-04-17 17:57:07.532	t
13	defenderplayer555@gmail.com	993659	2026-04-17 19:09:41.406	t
14	skkashyap2328@gmail.com	909108	2026-04-22 00:30:05.165	t
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, user_id, token, expires_at, created_at, is_revoked) FROM stdin;
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns (id, issue_id, return_date, fine_amount) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.states (id, name) FROM stdin;
1	Andhra Pradesh
2	Arunachal Pradesh
3	Assam
4	Bihar
5	Chhattisgarh
6	Goa
7	Gujarat
8	Haryana
9	Himachal Pradesh
10	Jharkhand
11	Karnataka
12	Kerala
13	Madhya Pradesh
14	Maharashtra
15	Manipur
16	Meghalaya
17	Mizoram
18	Nagaland
19	Odisha
20	Punjab
21	Rajasthan
22	Sikkim
23	Tamil Nadu
24	Telangana
25	Tripura
26	Uttar Pradesh
27	Uttarakhand
28	West Bengal
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, member_id, book_id, issue_date, due_date, return_date, fine_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_id_seq', 7, true);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.books_id_seq', 32, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 51, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cities_id_seq', 280, true);


--
-- Name: contact_us_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_us_id_seq', 6, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, false);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.feedback_id_seq', 14, true);


--
-- Name: issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.issues_id_seq', 1, false);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.members_id_seq', 5, true);


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.otp_verifications_id_seq', 14, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, false);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_google_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_google_id_key UNIQUE (google_id);


--
-- Name: admin admin_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_phone_key UNIQUE (phone);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: contact_us contact_us_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_us
    ADD CONSTRAINT contact_us_pkey PRIMARY KEY (id);


--
-- Name: countries countries_iso2_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_iso2_key UNIQUE (iso2);


--
-- Name: countries countries_iso3_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_iso3_key UNIQUE (iso3);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: issues issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (id);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_phone_key UNIQUE (phone);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: otp_verifications otp_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verifications
    ADD CONSTRAINT otp_verifications_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: categories unique_category_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category_name UNIQUE (name);


--
-- Name: idx_contact_us_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_us_created ON public.contact_us USING btree (created_at DESC);


--
-- Name: idx_contact_us_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_us_status ON public.contact_us USING btree (status);


--
-- Name: idx_countries_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_countries_name ON public.countries USING btree (name);


--
-- Name: books trigger_set_available; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_available BEFORE INSERT ON public.books FOR EACH ROW EXECUTE FUNCTION public.set_available_copies();


--
-- Name: admin fk_admin_city; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT fk_admin_city FOREIGN KEY (city_id) REFERENCES public.cities(id) ON DELETE SET NULL;


--
-- Name: admin fk_admin_state; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT fk_admin_state FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE SET NULL;


--
-- Name: books fk_book_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: transactions fk_transaction_book; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transaction_book FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE RESTRICT;


--
-- Name: issues issues_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: issues issues_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id);


--
-- Name: members members_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: returns returns_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id);


--
-- PostgreSQL database dump complete
--

\unrestrict smUXtmgpnM0bqvCKm6rM4tmPlP62KAUDdvPQROdQP9hb5zJaBzmrPfknGfB0WOd

