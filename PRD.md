# Product Requirement Document (PRD) — Skillistan Management System

## 1. Overview & Vision
Skillistan requires a dynamic, database-backed web application and content management system (CMS) for `skillistan.org`. 

Transitioning from a static prototype to a fully dynamic portal, the platform will empower a single Super Admin to manage and update critical organizational records (team members/internees, programs, events, blog stories) in real-time. Public visitors will be able to access fresh content, apply to volunteer, send inquiries, and register for open events with data stored instantly in a secure database.

---

## 2. Product Goals
* **Dynamic Site Content**: Replace static layouts with database queries so that about details, programs, events, and stories are live and easily modifiable.
* **Super Admin Panel**: A single, password-protected administrative interface allowing the team to manage almost every aspect of the site without touching code.
* **Streamlined Registrations**: Capture and view public submissions (event registrations, volunteer applications, inquiries, newsletter subscribers) in real-time.
* **Self-Contained Security**: Implement robust, lightweight session cookie-based authorization to protect admin features without complex external dependencies.
* **Scale-Ready Design**: Build clean, modern database models using Prisma ORM connected to Supabase (PostgreSQL), allowing for easy extensions in future phases.

---

## 3. Technology Stack & Database
* **Framework**: Next.js 16 (App Router, React 19)
* **Styling**: Tailwind CSS & Shadcn UI (using modern aesthetics like dark mode accents, sleek transitions, and custom typography)
* **Database**: Supabase PostgreSQL
* **ORM**: Prisma ORM
* **Authentication**: Lightweight Custom Session JWT/Cookies with Edge Middleware route-guarding
* **Media Storage**: Supabase Storage buckets for event images, story featured images, and team headshots

---

## 4. Database Schema Requirements (Prisma)
The database structure must support the following entities:

1. **AdminUser**
   * Fields: `id` (UUID), `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
   * Purpose: Credential repository for the single super admin.

2. **TeamMember**
   * Fields: `id` (UUID), `name`, `role`, `category` (Enum/String: `leadership` | `employee` | `intern` | `volunteer`), `bio` (optional), `imageUrl` (optional), `order` (integer default 0 for custom display sorting), `createdAt`, `updatedAt`
   * Purpose: Dynamic about page management (employees, internees, board members).

3. **Program**
   * Fields: `id` (UUID), `number` (e.g. "01"), `title`, `description`, `createdAt`, `updatedAt`
   * Purpose: Displays Skillistan's core pillars of work.

4. **Event**
   * Fields: `id` (UUID), `title`, `slug` (unique), `description`, `eventDate`, `location`, `imageUrl` (optional), `registrationEnabled` (boolean), `status` (Enum/String: `draft` | `published` | `archived`), `createdAt`, `updatedAt`
   * Purpose: Manages workshops, bootcamps, and climate sessions.

5. **EventRegistration**
   * Fields: `id` (UUID), `eventId` (FK to Event), `firstName`, `lastName`, `email`, `mobile`, `message` (optional), `createdAt`
   * Constraints: Unique combination of `eventId` + `email` to prevent double registrations.
   * Purpose: Lists registrants for specific active events.

6. **Story**
   * Fields: `id` (UUID), `title`, `slug` (unique), `excerpt`, `content` (string/paragraphs), `featuredImageUrl` (optional), `status` (Enum/String: `draft` | `published` | `archived`), `publishedAt` (optional), `createdAt`, `updatedAt`
   * Purpose: Blog posts, news updates, and campaign recaps.

7. **ContactMessage**
   * Fields: `id` (UUID), `firstName`, `lastName`, `email`, `mobile`, `message`, `createdAt`
   * Purpose: Customer relationship/inquiry inbox.

8. **VolunteerApplication**
   * Fields: `id` (UUID), `firstName`, `lastName`, `email`, `mobile`, `message` (optional), `createdAt`
   * Purpose: Application details for young volunteers.

9. **NewsletterSubscriber**
   * Fields: `id` (UUID), `email` (unique), `createdAt`
   * Purpose: Audience mailing list storage.

---

## 5. System Features & Specifications

### 5.1 Public Site Updates
* **About Page**: Query and render team members dynamically from the database. Group and sort members by their defined `category` and `order` properties.
* **Programs Page**: Render the core program modules from database records.
* **Events Page**: Query upcoming events (status = `published`) and past events (status = `archived`). Event cards must display event dates, location details, status labels, and "Register" buttons if registration is active.
* **Stories Page**: Dynamically display published blog posts with custom routes (`/stories/[slug]`).
* **Forms Integration**: Connect all public inputs (Contact, Volunteer application, Event registration, and Newsletter) to backend API handlers that insert records into PostgreSQL via Prisma. Include client-side validation, loading spinners, and success/error message states.

### 5.2 Super Admin Panel (`/admin`)
* **Route Guarding**: Next.js Edge middleware will intercept all requests matching `/admin/*` (except `/admin/login` and auth routes) and require a valid cryptographically signed session cookie. Unauthenticated hits will be redirected to the login page.
* **Admin Auth**: Login page featuring clean, modern form layout. Secure verification via a backend route utilizing Node crypto/jose to check password hashes and sign JWT session tokens.
* **Dashboard Overview**: Summary analytics cards displaying active counts of events, stories, volunteer applications, contact inquiries, and newsletter signups.
* **Event Management**:
   * CRUD views for events.
   * Integrated **Registrations Tab** under each event item displaying a table of registered users.
   * **CSV Export**: An action button to download the event's registration list as a `.csv` file.
* **Story Management**: Editor workspace supporting markdown fields, slug generator helpers, featured image upload selectors, and status controls (draft, publish, archive).
* **Team Management**: Interface to add, modify, and delete employees, leadership, and internees. Sort them using numeric priority input.
* **Programs Management**: Form interfaces to update dynamic title and description fields for core program offerings.
* **Submissions Panel**: Organized tables for Contact Messages, Volunteer Applications, and Newsletter Subscribers. Each entry must support viewing details, deleting records, and a global "Download CSV" export for lists.
* **Image Uploads**: Form components must support image file uploads. Images are pushed directly to a public Supabase Storage bucket, returning public URLs which are saved to database records.

---

## 6. Non-Goals
* Public student/volunteer profiles and portal logins.
* Payment processing or donation gateways.
* Multi-tenant or multi-role permission schemes (there is only one Super Admin).
* Automatic newsletter broadcasting or email trigger clients (data is collected, exports are manual).

---

## 7. Quality & Security Requirements
* **Secure Hashes**: Password verification must use high-entropy hashing (e.g. `bcryptjs`). Passwords are never stored in raw text.
* **API Validation**: Backend API handlers/Server Actions must validate body inputs (e.g. email formats, required string fields) to guard against injection.
* **Supabase Security**: Row-level Security (RLS) or direct database access via Prisma must run using secure server-side credentials stored in environment variables, preventing client leaks.
* **File Controls**: Upload APIs must validate files (restricting types to images like `.png`, `.jpg`, `.jpeg`, `.webp` and limiting sizes to a maximum of 5MB).
* **SEO Best Practices**: Ensure dynamic sitemaps and unique page metadata are generated for events and stories to maintain good search index visibility.