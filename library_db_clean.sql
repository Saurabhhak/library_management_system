--
-- PostgreSQL database dump
--

\restrict mUVeAX7k4om8XNer13IoSmXUtLIfI9rGLeSz9DZMFJXbxqEZpNBTrD5MYTd7aNy

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
    password_hash character varying(255) NOT NULL,
    phone character varying(12),
    state_id integer,
    city_id integer,
    role character varying(50) DEFAULT 'admin'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reset_otp character varying(10),
    otp_expiry timestamp without time zone,
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
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    state_id integer,
    name character varying(100) NOT NULL
);


--
-- Name: states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.states (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: admin_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.admin_view AS
 SELECT a.id,
    a.first_name,
    a.last_name,
    a.email,
    a.phone,
    s.name AS state_name,
    c.name AS city_name,
    a.role,
    a.is_active,
    a.created_at,
    a.reset_otp,
    a.otp_expiry
   FROM ((public.admin a
     LEFT JOIN public.states s ON ((a.state_id = s.id)))
     LEFT JOIN public.cities c ON ((a.city_id = c.id)));


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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
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
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id integer NOT NULL,
    member_code character varying(20) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    email character varying(150),
    phone character varying(15) NOT NULL,
    date_of_birth date,
    state_id integer NOT NULL,
    city_id integer NOT NULL,
    membership_start date DEFAULT CURRENT_DATE,
    membership_end date,
    max_books_allowed integer DEFAULT 3,
    status character varying(20) DEFAULT 'active'::character varying,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT members_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'blocked'::character varying])::text[])))
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
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


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
-- Name: members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin (id, first_name, last_name, email, password_hash, phone, state_id, city_id, role, is_active, created_at, reset_otp, otp_expiry) FROM stdin;
13	Admin8	User8	admin8@example.com	Admin@123	9000000008	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
14	Admin9	User9	admin9@example.com	Admin@123	9000000009	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
15	Admin10	User10	admin10@example.com	Admin@123	9000000010	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
16	Admin11	User11	admin11@example.com	Admin@123	9000000011	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
17	Admin12	User12	admin12@example.com	Admin@123	9000000012	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
18	Admin13	User13	admin13@example.com	Admin@123	9000000013	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
19	Admin14	User14	admin14@example.com	Admin@123	9000000014	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
20	Admin15	User15	admin15@example.com	Admin@123	9000000015	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
21	Admin16	User16	admin16@example.com	Admin@123	9000000016	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
22	Admin17	User17	admin17@example.com	Admin@123	9000000017	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
23	Admin18	User18	admin18@example.com	Admin@123	9000000018	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
24	Admin19	User19	admin19@example.com	Admin@123	9000000019	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
25	Admin20	User20	admin20@example.com	Admin@123	9000000020	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
26	Admin21	User21	admin21@example.com	Admin@123	9000000021	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
27	Admin22	User22	admin22@example.com	Admin@123	9000000022	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
28	Admin23	User23	admin23@example.com	Admin@123	9000000023	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
29	Admin24	User24	admin24@example.com	Admin@123	9000000024	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
30	Admin25	User25	admin25@example.com	Admin@123	9000000025	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
31	Admin26	User26	admin26@example.com	Admin@123	9000000026	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
32	Admin27	User27	admin27@example.com	Admin@123	9000000027	1	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
33	Admin28	User28	admin28@example.com	Admin@123	9000000028	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
34	Admin29	User29	admin29@example.com	Admin@123	9000000029	6	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
35	Admin30	User30	admin30@example.com	Admin@123	9000000030	3	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
36	Admin31	User31	admin31@example.com	Admin@123	9000000031	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
37	Admin32	User32	admin32@example.com	Admin@123	9000000032	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
38	Admin33	User33	admin33@example.com	Admin@123	9000000033	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
39	Admin34	User34	admin34@example.com	Admin@123	9000000034	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
40	Admin35	User35	admin35@example.com	Admin@123	9000000035	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
41	Admin36	User36	admin36@example.com	Admin@123	9000000036	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
42	Admin37	User37	admin37@example.com	Admin@123	9000000037	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
43	Admin38	User38	admin38@example.com	Admin@123	9000000038	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
44	Admin39	User39	admin39@example.com	Admin@123	9000000039	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
45	Admin40	User40	admin40@example.com	Admin@123	9000000040	1	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
46	Admin41	User41	admin41@example.com	Admin@123	9000000041	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
47	Admin42	User42	admin42@example.com	Admin@123	9000000042	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
48	Admin43	User43	admin43@example.com	Admin@123	9000000043	1	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
49	Admin44	User44	admin44@example.com	Admin@123	9000000044	1	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
50	Admin45	User45	admin45@example.com	Admin@123	9000000045	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
51	Admin46	User46	admin46@example.com	Admin@123	9000000046	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
52	Admin47	User47	admin47@example.com	Admin@123	9000000047	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
53	Admin48	User48	admin48@example.com	Admin@123	9000000048	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
54	Admin49	User49	admin49@example.com	Admin@123	9000000049	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
55	Admin50	User50	admin50@example.com	Admin@123	9000000050	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
56	Admin51	User51	admin51@example.com	Admin@123	9000000051	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
57	Admin52	User52	admin52@example.com	Admin@123	9000000052	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
58	Admin53	User53	admin53@example.com	Admin@123	9000000053	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
59	Admin54	User54	admin54@example.com	Admin@123	9000000054	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
60	Admin55	User55	admin55@example.com	Admin@123	9000000055	1	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
61	Admin56	User56	admin56@example.com	Admin@123	9000000056	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
62	Admin57	User57	admin57@example.com	Admin@123	9000000057	1	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
63	Admin58	User58	admin58@example.com	Admin@123	9000000058	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
64	Admin59	User59	admin59@example.com	Admin@123	9000000059	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
65	Admin60	User60	admin60@example.com	Admin@123	9000000060	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
66	Admin61	User61	admin61@example.com	Admin@123	9000000061	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
67	Admin62	User62	admin62@example.com	Admin@123	9000000062	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
68	Admin63	User63	admin63@example.com	Admin@123	9000000063	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
8	Admin	User	admin3@example.com	$2b$10$mFG6cUDWgMHCQPH936.Q2OkP8mUYPqWYZ1J35wrC0IbFpgmFpJPem	1212112121	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
10	Admin5	User5	admin5@example.com	Admin@123	9000000005	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
7	Admin7	User7	admin7@gmail.com	Admin@123	09193142045	26	251	admin	t	2026-03-02 15:27:17.295288	\N	\N
69	Admin64	User64	admin64@example.com	Admin@123	9000000064	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
70	Admin65	User65	admin65@example.com	Admin@123	9000000065	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
71	Admin66	User66	admin66@example.com	Admin@123	9000000066	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
72	Admin67	User67	admin67@example.com	Admin@123	9000000067	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
73	Admin68	User68	admin68@example.com	Admin@123	9000000068	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
74	Admin69	User69	admin69@example.com	Admin@123	9000000069	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
75	Admin70	User70	admin70@example.com	Admin@123	9000000070	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
76	Admin71	User71	admin71@example.com	Admin@123	9000000071	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
77	Admin72	User72	admin72@example.com	Admin@123	9000000072	2	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
78	Admin73	User73	admin73@example.com	Admin@123	9000000073	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
79	Admin74	User74	admin74@example.com	Admin@123	9000000074	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
80	Admin75	User75	admin75@example.com	Admin@123	9000000075	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
81	Admin76	User76	admin76@example.com	Admin@123	9000000076	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
82	Admin77	User77	admin77@example.com	Admin@123	9000000077	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
83	Admin78	User78	admin78@example.com	Admin@123	9000000078	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
84	Admin79	User79	admin79@example.com	Admin@123	9000000079	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
85	Admin80	User80	admin80@example.com	Admin@123	9000000080	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
86	Admin81	User81	admin81@example.com	Admin@123	9000000081	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
87	Admin82	User82	admin82@example.com	Admin@123	9000000082	6	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
88	Admin83	User83	admin83@example.com	Admin@123	9000000083	1	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
89	Admin84	User84	admin84@example.com	Admin@123	9000000084	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
90	Admin85	User85	admin85@example.com	Admin@123	9000000085	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
91	Admin86	User86	admin86@example.com	Admin@123	9000000086	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
92	Admin87	User87	admin87@example.com	Admin@123	9000000087	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
93	Admin88	User88	admin88@example.com	Admin@123	9000000088	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
94	Admin89	User89	admin89@example.com	Admin@123	9000000089	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
95	Admin90	User90	admin90@example.com	Admin@123	9000000090	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
96	Admin91	User91	admin91@example.com	Admin@123	9000000091	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
97	Admin92	User92	admin92@example.com	Admin@123	9000000092	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
98	Admin93	User93	admin93@example.com	Admin@123	9000000093	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
99	Admin94	User94	admin94@example.com	Admin@123	9000000094	1	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
100	Admin95	User95	admin95@example.com	Admin@123	9000000095	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
101	Admin96	User96	admin96@example.com	Admin@123	9000000096	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
102	Admin97	User97	admin97@example.com	Admin@123	9000000097	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
103	Admin98	User98	admin98@example.com	Admin@123	9000000098	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
104	Admin99	User99	admin99@example.com	Admin@123	9000000099	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
105	Admin100	User100	admin100@example.com	Admin@123	9000000100	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
106	Admin101	User101	admin101@example.com	Admin@123	9000000101	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
107	Admin102	User102	admin102@example.com	Admin@123	9000000102	6	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
108	Admin103	User103	admin103@example.com	Admin@123	9000000103	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
109	Admin104	User104	admin104@example.com	Admin@123	9000000104	6	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
110	Admin105	User105	admin105@example.com	Admin@123	9000000105	3	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
111	Admin106	User106	admin106@example.com	Admin@123	9000000106	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
112	Admin107	User107	admin107@example.com	Admin@123	9000000107	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
113	Admin108	User108	admin108@example.com	Admin@123	9000000108	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
114	Admin109	User109	admin109@example.com	Admin@123	9000000109	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
115	Admin110	User110	admin110@example.com	Admin@123	9000000110	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
116	Admin111	User111	admin111@example.com	Admin@123	9000000111	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
117	Admin112	User112	admin112@example.com	Admin@123	9000000112	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
118	Admin113	User113	admin113@example.com	Admin@123	9000000113	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
119	Admin114	User114	admin114@example.com	Admin@123	9000000114	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
120	Admin115	User115	admin115@example.com	Admin@123	9000000115	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
121	Admin116	User116	admin116@example.com	Admin@123	9000000116	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
122	Admin117	User117	admin117@example.com	Admin@123	9000000117	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
123	Admin118	User118	admin118@example.com	Admin@123	9000000118	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
124	Admin119	User119	admin119@example.com	Admin@123	9000000119	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
125	Admin120	User120	admin120@example.com	Admin@123	9000000120	5	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
126	Admin121	User121	admin121@example.com	Admin@123	9000000121	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
127	Admin122	User122	admin122@example.com	Admin@123	9000000122	6	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
128	Admin123	User123	admin123@example.com	Admin@123	9000000123	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
129	Admin124	User124	admin124@example.com	Admin@123	9000000124	1	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
130	Admin125	User125	admin125@example.com	Admin@123	9000000125	1	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
131	Admin126	User126	admin126@example.com	Admin@123	9000000126	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
132	Admin127	User127	admin127@example.com	Admin@123	9000000127	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
133	Admin128	User128	admin128@example.com	Admin@123	9000000128	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
134	Admin129	User129	admin129@example.com	Admin@123	9000000129	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
135	Admin130	User130	admin130@example.com	Admin@123	9000000130	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
136	Admin131	User131	admin131@example.com	Admin@123	9000000131	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
137	Admin132	User132	admin132@example.com	Admin@123	9000000132	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
138	Admin133	User133	admin133@example.com	Admin@123	9000000133	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
139	Admin134	User134	admin134@example.com	Admin@123	9000000134	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
140	Admin135	User135	admin135@example.com	Admin@123	9000000135	5	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
141	Admin136	User136	admin136@example.com	Admin@123	9000000136	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
142	Admin137	User137	admin137@example.com	Admin@123	9000000137	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
143	Admin138	User138	admin138@example.com	Admin@123	9000000138	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
144	Admin139	User139	admin139@example.com	Admin@123	9000000139	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
145	Admin140	User140	admin140@example.com	Admin@123	9000000140	1	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
146	Admin141	User141	admin141@example.com	Admin@123	9000000141	1	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
147	Admin142	User142	admin142@example.com	Admin@123	9000000142	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
148	Admin143	User143	admin143@example.com	Admin@123	9000000143	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
149	Admin144	User144	admin144@example.com	Admin@123	9000000144	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
150	Admin145	User145	admin145@example.com	Admin@123	9000000145	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
151	Admin146	User146	admin146@example.com	Admin@123	9000000146	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
152	Admin147	User147	admin147@example.com	Admin@123	9000000147	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
153	Admin148	User148	admin148@example.com	Admin@123	9000000148	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
154	Admin149	User149	admin149@example.com	Admin@123	9000000149	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
155	Admin150	User150	admin150@example.com	Admin@123	9000000150	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
156	Admin151	User151	admin151@example.com	Admin@123	9000000151	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
157	Admin152	User152	admin152@example.com	Admin@123	9000000152	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
158	Admin153	User153	admin153@example.com	Admin@123	9000000153	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
159	Admin154	User154	admin154@example.com	Admin@123	9000000154	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
160	Admin155	User155	admin155@example.com	Admin@123	9000000155	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
161	Admin156	User156	admin156@example.com	Admin@123	9000000156	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
162	Admin157	User157	admin157@example.com	Admin@123	9000000157	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
163	Admin158	User158	admin158@example.com	Admin@123	9000000158	1	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
164	Admin159	User159	admin159@example.com	Admin@123	9000000159	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
165	Admin160	User160	admin160@example.com	Admin@123	9000000160	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
166	Admin161	User161	admin161@example.com	Admin@123	9000000161	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
167	Admin162	User162	admin162@example.com	Admin@123	9000000162	3	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
168	Admin163	User163	admin163@example.com	Admin@123	9000000163	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
169	Admin164	User164	admin164@example.com	Admin@123	9000000164	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
170	Admin165	User165	admin165@example.com	Admin@123	9000000165	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
171	Admin166	User166	admin166@example.com	Admin@123	9000000166	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
172	Admin167	User167	admin167@example.com	Admin@123	9000000167	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
173	Admin168	User168	admin168@example.com	Admin@123	9000000168	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
174	Admin169	User169	admin169@example.com	Admin@123	9000000169	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
175	Admin170	User170	admin170@example.com	Admin@123	9000000170	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
176	Admin171	User171	admin171@example.com	Admin@123	9000000171	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
177	Admin172	User172	admin172@example.com	Admin@123	9000000172	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
178	Admin173	User173	admin173@example.com	Admin@123	9000000173	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
179	Admin174	User174	admin174@example.com	Admin@123	9000000174	5	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
180	Admin175	User175	admin175@example.com	Admin@123	9000000175	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
181	Admin176	User176	admin176@example.com	Admin@123	9000000176	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
182	Admin177	User177	admin177@example.com	Admin@123	9000000177	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
183	Admin178	User178	admin178@example.com	Admin@123	9000000178	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
184	Admin179	User179	admin179@example.com	Admin@123	9000000179	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
185	Admin180	User180	admin180@example.com	Admin@123	9000000180	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
186	Admin181	User181	admin181@example.com	Admin@123	9000000181	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
187	Admin182	User182	admin182@example.com	Admin@123	9000000182	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
188	Admin183	User183	admin183@example.com	Admin@123	9000000183	1	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
189	Admin184	User184	admin184@example.com	Admin@123	9000000184	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
190	Admin185	User185	admin185@example.com	Admin@123	9000000185	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
191	Admin186	User186	admin186@example.com	Admin@123	9000000186	6	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
192	Admin187	User187	admin187@example.com	Admin@123	9000000187	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
193	Admin188	User188	admin188@example.com	Admin@123	9000000188	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
194	Admin189	User189	admin189@example.com	Admin@123	9000000189	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
195	Admin190	User190	admin190@example.com	Admin@123	9000000190	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
196	Admin191	User191	admin191@example.com	Admin@123	9000000191	2	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
197	Admin192	User192	admin192@example.com	Admin@123	9000000192	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
198	Admin193	User193	admin193@example.com	Admin@123	9000000193	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
199	Admin194	User194	admin194@example.com	Admin@123	9000000194	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
200	Admin195	User195	admin195@example.com	Admin@123	9000000195	6	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
201	Admin196	User196	admin196@example.com	Admin@123	9000000196	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
202	Admin197	User197	admin197@example.com	Admin@123	9000000197	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
203	Admin198	User198	admin198@example.com	Admin@123	9000000198	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
204	Admin199	User199	admin199@example.com	Admin@123	9000000199	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
205	Admin200	User200	admin200@example.com	Admin@123	9000000200	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
206	Admin201	User201	admin201@example.com	Admin@123	9000000201	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
207	Admin202	User202	admin202@example.com	Admin@123	9000000202	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
208	Admin203	User203	admin203@example.com	Admin@123	9000000203	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
209	Admin204	User204	admin204@example.com	Admin@123	9000000204	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
210	Admin205	User205	admin205@example.com	Admin@123	9000000205	5	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
211	Admin206	User206	admin206@example.com	Admin@123	9000000206	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
212	Admin207	User207	admin207@example.com	Admin@123	9000000207	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
213	Admin208	User208	admin208@example.com	Admin@123	9000000208	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
214	Admin209	User209	admin209@example.com	Admin@123	9000000209	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
215	Admin210	User210	admin210@example.com	Admin@123	9000000210	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
216	Admin211	User211	admin211@example.com	Admin@123	9000000211	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
217	Admin212	User212	admin212@example.com	Admin@123	9000000212	2	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
218	Admin213	User213	admin213@example.com	Admin@123	9000000213	6	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
219	Admin214	User214	admin214@example.com	Admin@123	9000000214	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
220	Admin215	User215	admin215@example.com	Admin@123	9000000215	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
221	Admin216	User216	admin216@example.com	Admin@123	9000000216	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
222	Admin217	User217	admin217@example.com	Admin@123	9000000217	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
223	Admin218	User218	admin218@example.com	Admin@123	9000000218	6	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
224	Admin219	User219	admin219@example.com	Admin@123	9000000219	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
225	Admin220	User220	admin220@example.com	Admin@123	9000000220	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
226	Admin221	User221	admin221@example.com	Admin@123	9000000221	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
227	Admin222	User222	admin222@example.com	Admin@123	9000000222	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
228	Admin223	User223	admin223@example.com	Admin@123	9000000223	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
229	Admin224	User224	admin224@example.com	Admin@123	9000000224	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
230	Admin225	User225	admin225@example.com	Admin@123	9000000225	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
231	Admin226	User226	admin226@example.com	Admin@123	9000000226	1	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
232	Admin227	User227	admin227@example.com	Admin@123	9000000227	3	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
233	Admin228	User228	admin228@example.com	Admin@123	9000000228	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
234	Admin229	User229	admin229@example.com	Admin@123	9000000229	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
235	Admin230	User230	admin230@example.com	Admin@123	9000000230	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
236	Admin231	User231	admin231@example.com	Admin@123	9000000231	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
237	Admin232	User232	admin232@example.com	Admin@123	9000000232	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
238	Admin233	User233	admin233@example.com	Admin@123	9000000233	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
239	Admin234	User234	admin234@example.com	Admin@123	9000000234	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
240	Admin235	User235	admin235@example.com	Admin@123	9000000235	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
241	Admin236	User236	admin236@example.com	Admin@123	9000000236	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
242	Admin237	User237	admin237@example.com	Admin@123	9000000237	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
243	Admin238	User238	admin238@example.com	Admin@123	9000000238	6	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
244	Admin239	User239	admin239@example.com	Admin@123	9000000239	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
245	Admin240	User240	admin240@example.com	Admin@123	9000000240	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
246	Admin241	User241	admin241@example.com	Admin@123	9000000241	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
247	Admin242	User242	admin242@example.com	Admin@123	9000000242	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
248	Admin243	User243	admin243@example.com	Admin@123	9000000243	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
249	Admin244	User244	admin244@example.com	Admin@123	9000000244	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
250	Admin245	User245	admin245@example.com	Admin@123	9000000245	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
251	Admin246	User246	admin246@example.com	Admin@123	9000000246	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
252	Admin247	User247	admin247@example.com	Admin@123	9000000247	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
253	Admin248	User248	admin248@example.com	Admin@123	9000000248	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
254	Admin249	User249	admin249@example.com	Admin@123	9000000249	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
255	Admin250	User250	admin250@example.com	Admin@123	9000000250	6	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
256	Admin251	User251	admin251@example.com	Admin@123	9000000251	6	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
257	Admin252	User252	admin252@example.com	Admin@123	9000000252	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
258	Admin253	User253	admin253@example.com	Admin@123	9000000253	1	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
259	Admin254	User254	admin254@example.com	Admin@123	9000000254	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
260	Admin255	User255	admin255@example.com	Admin@123	9000000255	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
261	Admin256	User256	admin256@example.com	Admin@123	9000000256	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
262	Admin257	User257	admin257@example.com	Admin@123	9000000257	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
263	Admin258	User258	admin258@example.com	Admin@123	9000000258	3	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
264	Admin259	User259	admin259@example.com	Admin@123	9000000259	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
265	Admin260	User260	admin260@example.com	Admin@123	9000000260	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
266	Admin261	User261	admin261@example.com	Admin@123	9000000261	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
267	Admin262	User262	admin262@example.com	Admin@123	9000000262	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
268	Admin263	User263	admin263@example.com	Admin@123	9000000263	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
269	Admin264	User264	admin264@example.com	Admin@123	9000000264	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
270	Admin265	User265	admin265@example.com	Admin@123	9000000265	6	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
271	Admin266	User266	admin266@example.com	Admin@123	9000000266	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
272	Admin267	User267	admin267@example.com	Admin@123	9000000267	6	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
273	Admin268	User268	admin268@example.com	Admin@123	9000000268	1	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
274	Admin269	User269	admin269@example.com	Admin@123	9000000269	6	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
275	Admin270	User270	admin270@example.com	Admin@123	9000000270	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
276	Admin271	User271	admin271@example.com	Admin@123	9000000271	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
277	Admin272	User272	admin272@example.com	Admin@123	9000000272	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
278	Admin273	User273	admin273@example.com	Admin@123	9000000273	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
279	Admin274	User274	admin274@example.com	Admin@123	9000000274	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
280	Admin275	User275	admin275@example.com	Admin@123	9000000275	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
281	Admin276	User276	admin276@example.com	Admin@123	9000000276	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
282	Admin277	User277	admin277@example.com	Admin@123	9000000277	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
283	Admin278	User278	admin278@example.com	Admin@123	9000000278	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
284	Admin279	User279	admin279@example.com	Admin@123	9000000279	1	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
285	Admin280	User280	admin280@example.com	Admin@123	9000000280	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
286	Admin281	User281	admin281@example.com	Admin@123	9000000281	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
287	Admin282	User282	admin282@example.com	Admin@123	9000000282	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
288	Admin283	User283	admin283@example.com	Admin@123	9000000283	3	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
289	Admin284	User284	admin284@example.com	Admin@123	9000000284	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
290	Admin285	User285	admin285@example.com	Admin@123	9000000285	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
291	Admin286	User286	admin286@example.com	Admin@123	9000000286	6	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
292	Admin287	User287	admin287@example.com	Admin@123	9000000287	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
293	Admin288	User288	admin288@example.com	Admin@123	9000000288	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
294	Admin289	User289	admin289@example.com	Admin@123	9000000289	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
295	Admin290	User290	admin290@example.com	Admin@123	9000000290	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
296	Admin291	User291	admin291@example.com	Admin@123	9000000291	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
297	Admin292	User292	admin292@example.com	Admin@123	9000000292	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
298	Admin293	User293	admin293@example.com	Admin@123	9000000293	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
299	Admin294	User294	admin294@example.com	Admin@123	9000000294	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
300	Admin295	User295	admin295@example.com	Admin@123	9000000295	1	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
301	Admin296	User296	admin296@example.com	Admin@123	9000000296	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
302	Admin297	User297	admin297@example.com	Admin@123	9000000297	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
303	Admin298	User298	admin298@example.com	Admin@123	9000000298	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
304	Admin299	User299	admin299@example.com	Admin@123	9000000299	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
305	Admin300	User300	admin300@example.com	Admin@123	9000000300	5	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
306	Admin301	User301	admin301@example.com	Admin@123	9000000301	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
307	Admin302	User302	admin302@example.com	Admin@123	9000000302	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
308	Admin303	User303	admin303@example.com	Admin@123	9000000303	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
309	Admin304	User304	admin304@example.com	Admin@123	9000000304	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
310	Admin305	User305	admin305@example.com	Admin@123	9000000305	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
311	Admin306	User306	admin306@example.com	Admin@123	9000000306	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
312	Admin307	User307	admin307@example.com	Admin@123	9000000307	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
313	Admin308	User308	admin308@example.com	Admin@123	9000000308	1	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
314	Admin309	User309	admin309@example.com	Admin@123	9000000309	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
315	Admin310	User310	admin310@example.com	Admin@123	9000000310	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
316	Admin311	User311	admin311@example.com	Admin@123	9000000311	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
317	Admin312	User312	admin312@example.com	Admin@123	9000000312	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
318	Admin313	User313	admin313@example.com	Admin@123	9000000313	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
319	Admin314	User314	admin314@example.com	Admin@123	9000000314	2	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
320	Admin315	User315	admin315@example.com	Admin@123	9000000315	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
321	Admin316	User316	admin316@example.com	Admin@123	9000000316	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
322	Admin317	User317	admin317@example.com	Admin@123	9000000317	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
323	Admin318	User318	admin318@example.com	Admin@123	9000000318	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
324	Admin319	User319	admin319@example.com	Admin@123	9000000319	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
325	Admin320	User320	admin320@example.com	Admin@123	9000000320	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
326	Admin321	User321	admin321@example.com	Admin@123	9000000321	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
327	Admin322	User322	admin322@example.com	Admin@123	9000000322	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
328	Admin323	User323	admin323@example.com	Admin@123	9000000323	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
329	Admin324	User324	admin324@example.com	Admin@123	9000000324	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
330	Admin325	User325	admin325@example.com	Admin@123	9000000325	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
331	Admin326	User326	admin326@example.com	Admin@123	9000000326	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
332	Admin327	User327	admin327@example.com	Admin@123	9000000327	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
333	Admin328	User328	admin328@example.com	Admin@123	9000000328	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
334	Admin329	User329	admin329@example.com	Admin@123	9000000329	5	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
335	Admin330	User330	admin330@example.com	Admin@123	9000000330	3	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
336	Admin331	User331	admin331@example.com	Admin@123	9000000331	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
337	Admin332	User332	admin332@example.com	Admin@123	9000000332	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
338	Admin333	User333	admin333@example.com	Admin@123	9000000333	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
339	Admin334	User334	admin334@example.com	Admin@123	9000000334	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
340	Admin335	User335	admin335@example.com	Admin@123	9000000335	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
341	Admin336	User336	admin336@example.com	Admin@123	9000000336	1	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
342	Admin337	User337	admin337@example.com	Admin@123	9000000337	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
343	Admin338	User338	admin338@example.com	Admin@123	9000000338	4	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
344	Admin339	User339	admin339@example.com	Admin@123	9000000339	5	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
345	Admin340	User340	admin340@example.com	Admin@123	9000000340	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
346	Admin341	User341	admin341@example.com	Admin@123	9000000341	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
347	Admin342	User342	admin342@example.com	Admin@123	9000000342	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
348	Admin343	User343	admin343@example.com	Admin@123	9000000343	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
349	Admin344	User344	admin344@example.com	Admin@123	9000000344	6	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
350	Admin345	User345	admin345@example.com	Admin@123	9000000345	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
351	Admin346	User346	admin346@example.com	Admin@123	9000000346	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
352	Admin347	User347	admin347@example.com	Admin@123	9000000347	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
353	Admin348	User348	admin348@example.com	Admin@123	9000000348	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
354	Admin349	User349	admin349@example.com	Admin@123	9000000349	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
355	Admin350	User350	admin350@example.com	Admin@123	9000000350	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
356	Admin351	User351	admin351@example.com	Admin@123	9000000351	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
357	Admin352	User352	admin352@example.com	Admin@123	9000000352	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
358	Admin353	User353	admin353@example.com	Admin@123	9000000353	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
359	Admin354	User354	admin354@example.com	Admin@123	9000000354	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
360	Admin355	User355	admin355@example.com	Admin@123	9000000355	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
361	Admin356	User356	admin356@example.com	Admin@123	9000000356	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
362	Admin357	User357	admin357@example.com	Admin@123	9000000357	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
363	Admin358	User358	admin358@example.com	Admin@123	9000000358	2	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
364	Admin359	User359	admin359@example.com	Admin@123	9000000359	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
365	Admin360	User360	admin360@example.com	Admin@123	9000000360	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
366	Admin361	User361	admin361@example.com	Admin@123	9000000361	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
367	Admin362	User362	admin362@example.com	Admin@123	9000000362	5	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
368	Admin363	User363	admin363@example.com	Admin@123	9000000363	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
369	Admin364	User364	admin364@example.com	Admin@123	9000000364	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
370	Admin365	User365	admin365@example.com	Admin@123	9000000365	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
371	Admin366	User366	admin366@example.com	Admin@123	9000000366	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
372	Admin367	User367	admin367@example.com	Admin@123	9000000367	2	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
373	Admin368	User368	admin368@example.com	Admin@123	9000000368	5	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
374	Admin369	User369	admin369@example.com	Admin@123	9000000369	6	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
375	Admin370	User370	admin370@example.com	Admin@123	9000000370	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
376	Admin371	User371	admin371@example.com	Admin@123	9000000371	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
377	Admin372	User372	admin372@example.com	Admin@123	9000000372	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
378	Admin373	User373	admin373@example.com	Admin@123	9000000373	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
379	Admin374	User374	admin374@example.com	Admin@123	9000000374	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
380	Admin375	User375	admin375@example.com	Admin@123	9000000375	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
381	Admin376	User376	admin376@example.com	Admin@123	9000000376	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
382	Admin377	User377	admin377@example.com	Admin@123	9000000377	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
383	Admin378	User378	admin378@example.com	Admin@123	9000000378	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
384	Admin379	User379	admin379@example.com	Admin@123	9000000379	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
385	Admin380	User380	admin380@example.com	Admin@123	9000000380	5	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
386	Admin381	User381	admin381@example.com	Admin@123	9000000381	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
387	Admin382	User382	admin382@example.com	Admin@123	9000000382	5	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
388	Admin383	User383	admin383@example.com	Admin@123	9000000383	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
389	Admin384	User384	admin384@example.com	Admin@123	9000000384	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
390	Admin385	User385	admin385@example.com	Admin@123	9000000385	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
391	Admin386	User386	admin386@example.com	Admin@123	9000000386	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
392	Admin387	User387	admin387@example.com	Admin@123	9000000387	4	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
393	Admin388	User388	admin388@example.com	Admin@123	9000000388	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
394	Admin389	User389	admin389@example.com	Admin@123	9000000389	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
395	Admin390	User390	admin390@example.com	Admin@123	9000000390	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
396	Admin391	User391	admin391@example.com	Admin@123	9000000391	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
397	Admin392	User392	admin392@example.com	Admin@123	9000000392	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
398	Admin393	User393	admin393@example.com	Admin@123	9000000393	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
399	Admin394	User394	admin394@example.com	Admin@123	9000000394	5	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
400	Admin395	User395	admin395@example.com	Admin@123	9000000395	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
401	Admin396	User396	admin396@example.com	Admin@123	9000000396	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
402	Admin397	User397	admin397@example.com	Admin@123	9000000397	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
403	Admin398	User398	admin398@example.com	Admin@123	9000000398	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
404	Admin399	User399	admin399@example.com	Admin@123	9000000399	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
405	Admin400	User400	admin400@example.com	Admin@123	9000000400	1	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
406	Admin401	User401	admin401@example.com	Admin@123	9000000401	5	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
407	Admin402	User402	admin402@example.com	Admin@123	9000000402	5	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
408	Admin403	User403	admin403@example.com	Admin@123	9000000403	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
409	Admin404	User404	admin404@example.com	Admin@123	9000000404	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
410	Admin405	User405	admin405@example.com	Admin@123	9000000405	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
411	Admin406	User406	admin406@example.com	Admin@123	9000000406	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
412	Admin407	User407	admin407@example.com	Admin@123	9000000407	2	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
413	Admin408	User408	admin408@example.com	Admin@123	9000000408	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
414	Admin409	User409	admin409@example.com	Admin@123	9000000409	5	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
415	Admin410	User410	admin410@example.com	Admin@123	9000000410	1	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
416	Admin411	User411	admin411@example.com	Admin@123	9000000411	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
417	Admin412	User412	admin412@example.com	Admin@123	9000000412	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
418	Admin413	User413	admin413@example.com	Admin@123	9000000413	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
419	Admin414	User414	admin414@example.com	Admin@123	9000000414	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
420	Admin415	User415	admin415@example.com	Admin@123	9000000415	4	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
421	Admin416	User416	admin416@example.com	Admin@123	9000000416	2	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
422	Admin417	User417	admin417@example.com	Admin@123	9000000417	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
423	Admin418	User418	admin418@example.com	Admin@123	9000000418	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
424	Admin419	User419	admin419@example.com	Admin@123	9000000419	5	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
425	Admin420	User420	admin420@example.com	Admin@123	9000000420	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
426	Admin421	User421	admin421@example.com	Admin@123	9000000421	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
427	Admin422	User422	admin422@example.com	Admin@123	9000000422	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
428	Admin423	User423	admin423@example.com	Admin@123	9000000423	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
429	Admin424	User424	admin424@example.com	Admin@123	9000000424	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
430	Admin425	User425	admin425@example.com	Admin@123	9000000425	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
431	Admin426	User426	admin426@example.com	Admin@123	9000000426	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
432	Admin427	User427	admin427@example.com	Admin@123	9000000427	3	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
433	Admin428	User428	admin428@example.com	Admin@123	9000000428	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
434	Admin429	User429	admin429@example.com	Admin@123	9000000429	4	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
435	Admin430	User430	admin430@example.com	Admin@123	9000000430	1	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
436	Admin431	User431	admin431@example.com	Admin@123	9000000431	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
437	Admin432	User432	admin432@example.com	Admin@123	9000000432	1	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
438	Admin433	User433	admin433@example.com	Admin@123	9000000433	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
439	Admin434	User434	admin434@example.com	Admin@123	9000000434	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
440	Admin435	User435	admin435@example.com	Admin@123	9000000435	1	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
441	Admin436	User436	admin436@example.com	Admin@123	9000000436	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
442	Admin437	User437	admin437@example.com	Admin@123	9000000437	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
443	Admin438	User438	admin438@example.com	Admin@123	9000000438	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
444	Admin439	User439	admin439@example.com	Admin@123	9000000439	3	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
445	Admin440	User440	admin440@example.com	Admin@123	9000000440	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
446	Admin441	User441	admin441@example.com	Admin@123	9000000441	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
447	Admin442	User442	admin442@example.com	Admin@123	9000000442	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
448	Admin443	User443	admin443@example.com	Admin@123	9000000443	2	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
449	Admin444	User444	admin444@example.com	Admin@123	9000000444	1	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
450	Admin445	User445	admin445@example.com	Admin@123	9000000445	5	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
451	Admin446	User446	admin446@example.com	Admin@123	9000000446	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
452	Admin447	User447	admin447@example.com	Admin@123	9000000447	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
453	Admin448	User448	admin448@example.com	Admin@123	9000000448	4	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
454	Admin449	User449	admin449@example.com	Admin@123	9000000449	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
455	Admin450	User450	admin450@example.com	Admin@123	9000000450	1	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
456	Admin451	User451	admin451@example.com	Admin@123	9000000451	3	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
457	Admin452	User452	admin452@example.com	Admin@123	9000000452	1	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
458	Admin453	User453	admin453@example.com	Admin@123	9000000453	3	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
459	Admin454	User454	admin454@example.com	Admin@123	9000000454	5	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
460	Admin455	User455	admin455@example.com	Admin@123	9000000455	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
461	Admin456	User456	admin456@example.com	Admin@123	9000000456	6	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
462	Admin457	User457	admin457@example.com	Admin@123	9000000457	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
463	Admin458	User458	admin458@example.com	Admin@123	9000000458	2	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
464	Admin459	User459	admin459@example.com	Admin@123	9000000459	4	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
465	Admin460	User460	admin460@example.com	Admin@123	9000000460	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
466	Admin461	User461	admin461@example.com	Admin@123	9000000461	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
467	Admin462	User462	admin462@example.com	Admin@123	9000000462	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
468	Admin463	User463	admin463@example.com	Admin@123	9000000463	3	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
469	Admin464	User464	admin464@example.com	Admin@123	9000000464	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
470	Admin465	User465	admin465@example.com	Admin@123	9000000465	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
471	Admin466	User466	admin466@example.com	Admin@123	9000000466	5	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
472	Admin467	User467	admin467@example.com	Admin@123	9000000467	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
473	Admin468	User468	admin468@example.com	Admin@123	9000000468	4	5	admin	t	2026-03-02 15:27:17.295288	\N	\N
474	Admin469	User469	admin469@example.com	Admin@123	9000000469	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
475	Admin470	User470	admin470@example.com	Admin@123	9000000470	6	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
476	Admin471	User471	admin471@example.com	Admin@123	9000000471	6	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
478	Admin473	User473	admin473@example.com	Admin@123	9000000473	5	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
479	Admin474	User474	admin474@example.com	Admin@123	9000000474	3	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
480	Admin475	User475	admin475@example.com	Admin@123	9000000475	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
481	Admin476	User476	admin476@example.com	Admin@123	9000000476	6	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
482	Admin477	User477	admin477@example.com	Admin@123	9000000477	3	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
483	Admin478	User478	admin478@example.com	Admin@123	9000000478	6	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
484	Admin479	User479	admin479@example.com	Admin@123	9000000479	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
485	Admin480	User480	admin480@example.com	Admin@123	9000000480	2	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
486	Admin481	User481	admin481@example.com	Admin@123	9000000481	3	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
487	Admin482	User482	admin482@example.com	Admin@123	9000000482	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
488	Admin483	User483	admin483@example.com	Admin@123	9000000483	6	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
489	Admin484	User484	admin484@example.com	Admin@123	9000000484	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
490	Admin485	User485	admin485@example.com	Admin@123	9000000485	2	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
491	Admin486	User486	admin486@example.com	Admin@123	9000000486	6	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
492	Admin487	User487	admin487@example.com	Admin@123	9000000487	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
493	Admin488	User488	admin488@example.com	Admin@123	9000000488	4	2	admin	t	2026-03-02 15:27:17.295288	\N	\N
494	Admin489	User489	admin489@example.com	Admin@123	9000000489	5	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
495	Admin490	User490	admin490@example.com	Admin@123	9000000490	4	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
496	Admin491	User491	admin491@example.com	Admin@123	9000000491	2	9	admin	t	2026-03-02 15:27:17.295288	\N	\N
497	Admin492	User492	admin492@example.com	Admin@123	9000000492	2	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
498	Admin493	User493	admin493@example.com	Admin@123	9000000493	2	4	admin	t	2026-03-02 15:27:17.295288	\N	\N
499	Admin494	User494	admin494@example.com	Admin@123	9000000494	3	7	admin	t	2026-03-02 15:27:17.295288	\N	\N
500	Admin495	User495	admin495@example.com	Admin@123	9000000495	4	11	admin	t	2026-03-02 15:27:17.295288	\N	\N
501	Admin496	User496	admin496@example.com	Admin@123	9000000496	5	3	admin	t	2026-03-02 15:27:17.295288	\N	\N
502	Admin497	User497	admin497@example.com	Admin@123	9000000497	3	1	admin	t	2026-03-02 15:27:17.295288	\N	\N
503	Admin498	User498	admin498@example.com	Admin@123	9000000498	2	8	admin	t	2026-03-02 15:27:17.295288	\N	\N
504	Admin499	User499	admin499@example.com	Admin@123	9000000499	2	10	admin	t	2026-03-02 15:27:17.295288	\N	\N
521	Saurabh1	Saurabh1	skkashyap1@gmail.com	$2b$10$lV8jt9rpQDM8vkfhkfmZU.pJfg4uobOaTH7jhRPKONzn.GQEffRyS	91931420411	27	264	admin	t	2026-03-09 13:36:41.734399	\N	\N
513	Neha	Gupta	neha	$2b$10$cuSIB7MB2YcbsFpIF1AzB.HELPNdvBakTEzC8cTjwT8SCpikCKP1O	919371475578	8	74	admin	t	2026-03-06 18:55:03.48207	\N	\N
514	Ajay	Kashyap	ajay@gmail.com	$2b$10$z7EwxdgXaO4P9tBdQ1rKHu44InY5Zx.YX.E/vVV4.A5ATLSrCp.H2	09193142867	27	264	admin	t	2026-03-07 18:04:28.298297	\N	\N
516	Ajay	Kashyap	ajay67@gmail.com	$2b$10$oOn0JHzRuzkv1Sdz9eU8JuJQl49p1iWj6tjifMq08f/os654BYp86	09193142867	27	264	admin	t	2026-03-07 18:07:07.620206	\N	\N
12	Admin7	User7	admin7@example.com	Admin@123	9000000007	4	6	admin	t	2026-03-02 15:27:17.295288	\N	\N
522	Saurabh007	Saurabh007	rohit007@gmail.com	$2b$10$xN6TxP5fQ/fAvsyBbDlFjO6.Ko6fuUbOowEJ5QtTcpuipFNo5rQ/m	21931420412	26	255	admin	t	2026-03-09 13:57:05.160533	\N	\N
523	Saurabh007	Saurabh007	Saurabh007@gmail.com	$2b$10$YjhGFktdzuLFeiUPYYnxG.YJqY/sR7QQ5oHJl.y8C75Cz2Ehx7NhC	9193142007	27	264	admin	t	2026-03-09 14:03:12.763855	\N	\N
519	Shivram	Kumar	ShivRam@gmail.com	$2b$10$5ODJI2B6hQKBQzJe2Tv/lOrdB5HBTtUag.25tMiMKHXtSpNBzCtHW	55555555	26	252	admin	t	2026-03-09 12:41:43.638741	\N	\N
532	Extreme	Hacker	extremehaker007@gmail.com	$2b$10$Yf0I0xEr9qekZZ2cYTxXB.UjM4RGm8C8l59gQIEgstOnvzU5NAegi	6399232854	27	264	admin	t	2026-03-12 16:52:44.279781	135913	2026-03-12 17:02:13.924
524	Saurabh	Rohit	rohitSaurabh@gmail.com	$2b$10$QUNCljbeOHKjr8R/IyxhROYqMMdQ7jMzdkJ2ga0BI1oG1hdMPmcgu	9193142045	26	251	admin	t	2026-03-09 15:02:27.772274	\N	\N
1	Saurabh	Kashyap	skkashyap2328@gmail.com	$2b$10$5qAUM4R1oJrLRXeonUprmuURkhH8Gn6n2IqY5CFYcet.K1soVXdM2	9193142041	27	264	superadmin	t	2026-03-02 11:03:37.80613	399879	2026-03-12 12:00:15.776
530	Saurabh	Saurabh	skkashyap1222328@gmail.com	$2b$10$t9F1ru8sNbXPtd68dxq2JO5huzaCFhrh8HJqAJiv1izX5MsKtyLLO	09193142041	27	264	admin	t	2026-03-12 13:17:46.975678	\N	\N
527	Saurabh	Kashyap	skkashyap23283@gmail.com	$2b$10$qKprUPf2KoQhWbG15YO2J.2gHDNI.0lJ27JBUnm1QHAqE/AJoGJIe	9143442041	20	196	admin	t	2026-03-09 15:57:28.162106	\N	\N
528	Saurabh	Saurabh	skkashyap23328@gmail.com	$2b$10$RPPp02I.ZzvwrO.bxdXscubchbTMh/byRGrA9nZhRwq3pAskq.yVC	091931320413	28	275	admin	t	2026-03-09 15:59:18.674903	\N	\N
531	Saurabh	Saurabh	skkashyap2323338@gmail.com	$2b$10$gmYPYHApYEmihI6Pjrj/teQ0OBTwe1np.nU9wt/gXcr3fAt3HIGbm	09193142041	27	264	admin	t	2026-03-12 13:18:24.139016	\N	\N
529	Saurabh	Saurabh	skkashyap234428@gmail.com	$2b$10$4YHJPoPbJzdPmZCb2vyTwOjUiq2IbRD4i8zIOu2afqEYPgAZU3BfS	09193142041	27	261	admin	t	2026-03-10 17:07:30.875211	\N	\N
526	Saurabh	Saurabh	skkashyap22328@gmail.com	$2b$10$sfD1nIkR4l3duEPU6wz.WeQuBKSFz6FipiTHG4QYodE1zv.GHZrlu	09193142041	27	267	admin	t	2026-03-09 15:29:29.165034	\N	\N
9	Admin	NINE	admin1111@example.com	$2b$10$Gl9WLSvVhwTT7Pg9k0p2fOKssD2RSpcHxRL1kKsEFdaeX7yAGm2Zm	9000000222	6	58	superadmin	t	2026-03-02 15:27:17.295288	\N	\N
520	Manish	Yadav	manish@gmail.com	$2b$10$PlBRPkiXKeEyj/MZAm5Ry.zAerJotI.Ot5PJecodNa6IJq4Wibh3O	9193142034	27	264	admin	t	2026-03-09 13:07:50.695468	\N	\N
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.books (id, title, author, isbn, category_id, total_copies, available_copies, shelf_location, status, is_deleted, created_at, updated_at) FROM stdin;
3	Physics Fundamentals	Albert Newton	ISBN0002	2	8	8	B1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
4	Mastering React	Code Guru	ISBN0003	3	12	12	C1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
5	World War II	Historian Max	ISBN0004	4	5	5	D1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
6	Advanced Calculus	Dr. Math	ISBN0005	5	7	7	E1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
7	Meditations	Marcus Aurelius	ISBN0006	6	6	6	F1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
8	Microeconomics 101	Adam Smith Jr	ISBN0007	7	9	9	G1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
9	Human Behavior	Sigmund Lee	ISBN0008	8	4	4	H1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
10	Shakespeare Complete	William Shakespeare	ISBN0009	9	15	15	I1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
11	Atomic Habits	James Clear	ISBN0010	10	20	20	J1	available	f	2026-03-02 18:10:21.901299	2026-03-02 18:10:21.901299
14	NodeJS	Saurabh	ISBN04040	2	3	3	N1	available	f	2026-03-02 19:20:20.223063	2026-03-02 19:20:20.223063
16	S	waqw	ISBN00130	14	3	3	N1	available	f	2026-03-12 12:57:53.864916	2026-03-12 12:57:53.864916
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, created_at) FROM stdin;
3	Fiction	Novels and imaginative stories	2026-03-02 18:09:43.972203
4	Science	Physics, Chemistry, Biology books	2026-03-02 18:09:43.972203
6	History	Historical events and biographies	2026-03-02 18:09:43.972203
7	Mathematics	Pure and Applied Mathematics books	2026-03-02 18:09:43.972203
8	Philosophy	Philosophical theories and thinkers	2026-03-02 18:09:43.972203
9	Economics	Finance and economic studies	2026-03-02 18:09:43.972203
10	Psychology	Human behavior and mind	2026-03-02 18:09:43.972203
11	Literature	Classic and modern literature	2026-03-02 18:09:43.972203
12	Self Help	Motivational and personal development books	2026-03-02 18:09:43.972203
2	Computers	Learn Scripting Language\n	2026-03-02 18:04:02.182307
5	Technologies	Programming and IT related books	2026-03-02 18:09:43.972203
14	Languages	React.js,Node.js	2026-03-12 12:57:03.241543
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cities (id, state_id, name) FROM stdin;
1	1	Visakhapatnam
2	1	Vijayawada
3	1	Guntur
4	1	Tirupati
5	1	Nellore
6	1	Kurnool
7	1	Rajahmundry
8	1	Kadapa
9	1	Anantapur
10	1	Eluru
11	2	Itanagar
12	2	Tawang
13	2	Ziro
14	2	Pasighat
15	2	Bomdila
16	2	Naharlagun
17	2	Roing
18	2	Tezu
19	2	Along
20	2	Khonsa
21	3	Guwahati
22	3	Silchar
23	3	Dibrugarh
24	3	Jorhat
25	3	Nagaon
26	3	Tinsukia
27	3	Tezpur
28	3	Bongaigaon
29	3	Goalpara
30	3	Dhubri
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
43	5	Bilaspur
44	5	Korba
45	5	Durg
46	5	Rajnandgaon
47	5	Jagdalpur
48	5	Raigarh
49	5	Ambikapur
50	5	Mahasamund
51	6	Panaji
52	6	Margao
53	6	Vasco da Gama
54	6	Mapusa
55	6	Ponda
56	6	Bicholim
57	6	Curchorem
58	6	Sanquelim
59	6	Quepem
60	6	Canacona
61	7	Ahmedabad
62	7	Surat
63	7	Vadodara
64	7	Rajkot
65	7	Bhavnagar
66	7	Jamnagar
67	7	Gandhinagar
68	7	Junagadh
69	7	Anand
70	7	Morbi
71	8	Gurgaon
72	8	Faridabad
73	8	Panipat
74	8	Ambala
75	8	Karnal
76	8	Hisar
77	8	Rohtak
78	8	Sonipat
79	8	Yamunanagar
80	8	Bhiwani
81	9	Shimla
82	9	Manali
83	9	Dharamshala
84	9	Solan
85	9	Mandi
86	9	Kullu
87	9	Bilaspur
88	9	Chamba
89	9	Una
90	9	Hamirpur
91	10	Ranchi
92	10	Jamshedpur
93	10	Dhanbad
94	10	Bokaro
95	10	Hazaribagh
96	10	Deoghar
97	10	Giridih
98	10	Ramgarh
99	10	Chaibasa
100	10	Medininagar
101	11	Bengaluru
102	11	Mysore
103	11	Mangalore
104	11	Hubli
105	11	Belgaum
106	11	Davangere
107	11	Ballari
108	11	Udupi
109	11	Shimoga
110	11	Tumkur
111	12	Kochi
112	12	Thiruvananthapuram
113	12	Kozhikode
114	12	Thrissur
115	12	Kollam
116	12	Alappuzha
117	12	Palakkad
118	12	Kannur
119	12	Kottayam
120	12	Malappuram
121	13	Bhopal
122	13	Indore
123	13	Jabalpur
124	13	Gwalior
125	13	Ujjain
126	13	Sagar
127	13	Satna
128	13	Ratlam
129	13	Rewa
130	13	Singrauli
131	14	Mumbai
132	14	Pune
133	14	Nagpur
134	14	Nashik
135	14	Thane
136	14	Aurangabad
137	14	Solapur
138	14	Kolhapur
139	14	Amravati
140	14	Nanded
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
159	16	Cherrapunji
160	16	Khliehriat
161	17	Aizawl
162	17	Lunglei
163	17	Champhai
164	17	Serchhip
165	17	Kolasib
166	17	Saiha
167	17	Lawngtlai
168	17	Mamit
169	17	Saitual
170	17	Hnahthial
171	18	Kohima
172	18	Dimapur
173	18	Mokokchung
174	18	Tuensang
175	18	Wokha
176	18	Mon
177	18	Phek
178	18	Zunheboto
179	18	Kiphire
180	18	Longleng
181	19	Bhubaneswar
182	19	Cuttack
183	19	Rourkela
184	19	Puri
185	19	Sambalpur
186	19	Balasore
187	19	Berhampur
188	19	Bhadrak
189	19	Jharsuguda
190	19	Baripada
191	20	Ludhiana
192	20	Amritsar
193	20	Jalandhar
194	20	Patiala
195	20	Bathinda
196	20	Mohali
197	20	Hoshiarpur
198	20	Pathankot
199	20	Moga
200	20	Firozpur
201	21	Jaipur
202	21	Jodhpur
203	21	Udaipur
204	21	Kota
205	21	Ajmer
206	21	Bikaner
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
227	23	Vellore
228	23	Erode
229	23	Thoothukudi
230	23	Dindigul
231	24	Hyderabad
232	24	Warangal
233	24	Karimnagar
234	24	Nizamabad
235	24	Khammam
236	24	Ramagundam
237	24	Mahbubnagar
238	24	Adilabad
239	24	Siddipet
240	24	Suryapet
241	25	Agartala
242	25	Udaipur
243	25	Dharmanagar
244	25	Kailashahar
245	25	Belonia
246	25	Khowai
247	25	Ambassa
248	25	Sonamura
249	25	Sabroom
250	25	Kamalpur
251	26	Lucknow
252	26	Kanpur
253	26	Noida
254	26	Ghaziabad
255	26	Varanasi
256	26	Agra
257	26	Prayagraj
258	26	Meerut
259	26	Aligarh
260	26	Bareilly
261	27	Dehradun
262	27	Haridwar
263	27	Haldwani
264	27	Rudrapur
265	27	Kashipur
266	27	Roorkee
267	27	Rishikesh
268	27	Nainital
269	27	Almora
270	27	Pithoragarh
271	28	Kolkata
272	28	Howrah
273	28	Durgapur
274	28	Asansol
275	28	Siliguri
276	28	Darjeeling
277	28	Kharagpur
278	28	Malda
279	28	Bardhaman
280	28	Haldia
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, member_code, first_name, last_name, email, phone, date_of_birth, state_id, city_id, membership_start, membership_end, max_books_allowed, status, is_deleted, created_at, updated_at) FROM stdin;
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

SELECT pg_catalog.setval('public.admin_id_seq', 532, true);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.books_id_seq', 16, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 14, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cities_id_seq', 280, true);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.members_id_seq', 1, false);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.states_id_seq', 28, true);


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
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_member_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_member_code_key UNIQUE (member_code);


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
-- Name: states states_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_name_key UNIQUE (name);


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
-- Name: admin admin_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: admin admin_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: cities cities_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE CASCADE;


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
-- Name: transactions fk_transaction_member; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transaction_member FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict mUVeAX7k4om8XNer13IoSmXUtLIfI9rGLeSz9DZMFJXbxqEZpNBTrD5MYTd7aNy

