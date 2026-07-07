# Skillistan Website PRD

## 1. Overview

Skillistan needs a new official website for `skillistan.org`.

The website should be built from scratch as a clean, modern, trustworthy public website for an organization focused on youth empowerment, skills, sustainability, events, stories, and volunteer participation.

This first phase should stay minimal. The goal is to launch a strong, useful website without building a large platform too early. The site should explain Skillistan clearly, show its work, collect basic inquiries, and allow the team to manage essential dynamic content.

Skillistan Technologies will be handled later as a separate phase at `tech.skillistan.org`. It should share the broader Skillistan identity, but it is not part of this phase.

## 2. Product Goals

- Create a new official website for Skillistan.
- Present Skillistan clearly to students, volunteers, partners, donors, and general visitors.
- Make the organization feel credible, active, and easy to understand.
- Keep the first version simple and maintainable.
- Allow visitors to contact the team, apply as volunteers, subscribe to updates, and register for events.
- Allow admins to manage only the most important dynamic content at launch.
- Use a REST API architecture with Supabase PostgreSQL as the database.

## 3. Phase 1 Scope

Phase 1 should include only the essentials needed for a proper public launch.

### Public Website

The website should include:

- Home page.
- About page.
- Work or Programs page.
- Events page.
- Stories or Blog page.
- Volunteer page.
- Contact page.

### Forms

The website should support:

- Contact form.
- Volunteer application form.
- Event registration form.
- Newsletter signup.

### Admin Dashboard

The admin dashboard should support:

- Admin login and logout.
- Event management.
- Story or blog post management.
- Viewing contact messages.
- Viewing volunteer applications.
- Viewing event registrations.
- Viewing newsletter subscribers.

Keep the admin dashboard simple. It does not need advanced analytics, user roles, complex workflows, or a full CMS in phase 1.

## 4. Phase 1 Non-Goals

Do not include these in the first launch unless explicitly requested later:

- Skillistan Technologies website.
- Donation/payment system.
- Advanced CMS.
- Multi-role admin permissions.
- Email automation.
- Student accounts.
- Volunteer accounts.
- Course platform.
- Certificates.
- Complex search.
- Public user dashboards.
- Case study system.
- Partner portal.
- Mobile app.

These can be considered later once the main website is stable.

## 5. Target Audience

### Students And Young Professionals

They should understand what Skillistan offers and how they can join events, programs, or volunteer activities.

### Volunteers

They should quickly understand how to apply and what kind of work they may be joining.

### Partners And Donors

They should see enough credibility, clarity, and impact to feel comfortable contacting Skillistan.

### General Visitors

They should be able to understand the mission, recent activity, and contact options without needing prior context.

### Admin Team

They should be able to update events and stories without editing code.

## 6. Site Structure

### 6.1 Home Page

Purpose:

The home page should quickly explain Skillistan and guide visitors toward the most important actions.

Suggested sections:

- Hero introduction.
- Short mission statement.
- Key impact highlights.
- Core areas of work.
- Featured or upcoming events.
- Recent stories.
- Volunteer call to action.
- Contact or partner call to action.

Primary actions:

- Explore programs.
- View events.
- Become a volunteer.
- Contact Skillistan.

### 6.2 About Page

Purpose:

Explain who Skillistan is, why it exists, and what it is trying to achieve.

Suggested sections:

- Who we are.
- Mission.
- Vision.
- What we believe.
- Short impact summary.
- Team or leadership section, only if content is available.
- Partners or collaborators, only if content is available.

### 6.3 Work Or Programs Page

Purpose:

Explain the main areas where Skillistan works.

Suggested areas:

- Youth skills development.
- Digital literacy.
- Sustainability and climate action.
- Youth leadership.
- Workshops and community programs.

This page should stay simple. It does not need individual program detail pages in phase 1 unless content is ready.

### 6.4 Events Page

Purpose:

Show upcoming and past Skillistan events.

Requirements:

- List events with title, date, short description, image, and status.
- Clearly show whether registration is open or closed.
- Allow visitors to register for open events.
- Show a useful empty state if no events are available.

Optional for phase 1:

- Event detail page.

If implementation time is limited, event cards with registration are enough for the first launch.

### 6.5 Stories Or Blog Page

Purpose:

Share updates, stories, announcements, event recaps, and thought pieces.

Requirements:

- Listing page.
- Detail page.
- Title, image, publish date, excerpt, and article content.
- Published and draft states in admin.

Keep the system simple. A basic article editor is enough for phase 1.

### 6.6 Volunteer Page

Purpose:

Encourage people to volunteer and collect applications.

Suggested sections:

- Why volunteer with Skillistan.
- What volunteers may help with.
- Basic expectations.
- Application form.

Form fields:

- First name.
- Last name.
- Email.
- Mobile number.
- Message or area of interest.

### 6.7 Contact Page

Purpose:

Give visitors a clear way to reach Skillistan.

Suggested sections:

- Contact form.
- Email address.
- Phone number.
- Location, if confirmed.
- Social links, if confirmed.

Form fields:

- First name.
- Last name.
- Email.
- Mobile number.
- Message.

## 7. Admin Dashboard Requirements

The admin dashboard should be functional, simple, and easy to maintain.

### 7.1 Authentication

Admins should be able to:

- Log in securely.
- Log out.
- Access protected dashboard routes only after login.

Passwords must be stored securely. Do not use weak hashing or plain text passwords.

### 7.2 Dashboard Home

The dashboard home can show simple counts:

- Total events.
- Total stories.
- Contact messages.
- Volunteer applications.
- Event registrations.
- Newsletter subscribers.

This is enough for phase 1.

### 7.3 Events

Admins should be able to:

- Create events.
- Edit events.
- Delete or archive events.
- Upload event image.
- Set event date.
- Enable or disable registration.
- View registrations.

### 7.4 Stories

Admins should be able to:

- Create stories or blog posts.
- Edit stories.
- Delete or archive stories.
- Upload featured image.
- Set title, slug, excerpt, body, and publish status.

### 7.5 Submissions

Admins should be able to view:

- Contact messages.
- Volunteer applications.
- Event registrations.
- Newsletter subscribers.

For phase 1, viewing and deleting records is enough.

## 8. REST API Requirements

Use REST APIs for dynamic operations.

Suggested API groups:

- Auth.
- Events.
- Event registrations.
- Stories.
- Contact messages.
- Volunteer applications.
- Newsletter subscribers.
- Uploads.

General requirements:

- Validate request bodies.
- Return consistent JSON responses.
- Use proper HTTP status codes.
- Protect admin-only routes.
- Store data in Supabase PostgreSQL.
- Keep server-side errors private.
- Keep API structure simple and predictable.

## 9. Suggested Data Model

This is a starting point. The implementation can adjust field names if needed.

### Admin User

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

### Event

- `id`
- `title`
- `slug`
- `description`
- `event_date`
- `image_url`
- `registration_enabled`
- `status`
- `created_at`
- `updated_at`

### Event Registration

- `id`
- `event_id`
- `first_name`
- `last_name`
- `email`
- `mobile`
- `message`
- `created_at`

### Story

- `id`
- `title`
- `slug`
- `excerpt`
- `content`
- `featured_image_url`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### Contact Message

- `id`
- `first_name`
- `last_name`
- `email`
- `mobile`
- `message`
- `created_at`

### Volunteer Application

- `id`
- `first_name`
- `last_name`
- `email`
- `mobile`
- `message`
- `created_at`

### Newsletter Subscriber

- `id`
- `email`
- `created_at`

## 10. Content And Media

The agent should assume that media assets will be provided separately.

The website should be built so images can be added easily to:

- Hero sections.
- Program sections.
- Event cards.
- Story cards.
- Volunteer page.
- About page.

Some text content may be finalized later. The first build may use clean placeholder copy where necessary, but placeholder copy should sound realistic and should be easy to replace.

Do not overload the first version with too many sections. Each page should include enough content to feel complete, but not so much that the site becomes difficult to launch.

## 11. SEO Requirements

The website should include:

- Unique page titles.
- Meta descriptions.
- Open Graph metadata.
- Clean page URLs.
- Sitemap.
- Robots file.
- Proper heading structure.

Stories should have individual SEO metadata where possible.

## 12. Accessibility Requirements

The website should follow basic accessibility standards.

Requirements:

- Semantic HTML.
- Proper form labels.
- Keyboard accessible navigation.
- Clear focus states.
- Useful alt text for images.
- Readable text contrast.
- Clear form error messages.

## 13. Performance Requirements

The first launch should be lightweight.

Requirements:

- Optimize images.
- Avoid unnecessary client-side JavaScript.
- Load public pages quickly.
- Keep admin code separate from public pages.
- Use server-rendered or static pages where appropriate.

## 14. Security Requirements

Requirements:

- Secure admin authentication.
- Server-side validation for all forms.
- Safe database access.
- Protected admin APIs.
- Environment variables for secrets.
- Upload validation for images.
- Basic spam protection for public forms.

## 15. Recommended Build Order

1. Set up the project structure.
2. Set up Supabase PostgreSQL connection.
3. Create the base public layout.
4. Build the public pages with initial content.
5. Create the database schema.
6. Build REST APIs for forms, events, and stories.
7. Build public forms.
8. Build admin authentication.
9. Build admin dashboard.
10. Connect admin events and stories.
11. Connect admin submission views.
12. Add SEO, accessibility, and performance cleanup.
13. Final test on desktop and mobile.

## 16. Phase 1 Acceptance Criteria

The phase 1 site is complete when:

- The public website can be visited at the planned Skillistan domain.
- Visitors can understand what Skillistan does within a few seconds.
- Visitors can view events.
- Visitors can register for open events.
- Visitors can read stories.
- Visitors can apply as volunteers.
- Visitors can send contact messages.
- Visitors can subscribe to the newsletter.
- Admins can log in.
- Admins can manage events.
- Admins can manage stories.
- Admins can view form submissions.
- The site works well on mobile and desktop.
- The site has basic SEO metadata.
- The implementation is simple enough for future developers to maintain.

## 17. Phase 2 Note

Skillistan Technologies should be planned later as a separate website at `tech.skillistan.org`.

It should share the broader Skillistan identity, but it should have its own content, goals, and site structure. Nothing in phase 1 should block that future expansion.