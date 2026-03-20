# Luxe Estate

Welcome to **Luxe Estate**, a premium real estate application designed for showcasing and selling luxury properties.

## Business Overview
Luxe Estate is a modern web platform for high-end real estate listings. Our application provides an intuitive and luxurious experience for prospective buyers to:
- Discover curated featured properties.
- Search and filter properties based on specific criteria (e.g., bedrooms, bathrooms).
- View rich property details with image galleries and an interactive map.
- Browse the application in multiple languages (English, Spanish, and French).

## Technology Stack
This platform has been built utilizing modern web technologies:
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI & Layouts**: React 19
- **Maps**: [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/) for interactive property locations
- **Database Interface**: [Supabase](https://supabase.com/) for data and asset management
- **Internationalization (i18n)**: Support for English, Spanish, and French

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js (v18 or higher) and a package manager installed (npm, yarn, pnpm, or bun).

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url>
   cd luxe-estate
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Copy the provided `.env.template` to a new `.env.local` file:
   ```bash
   cp .env.template .env.local
   ```
   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to explore the application.

## Project Structure Overview
- `app/`: Next.js App Router structure, including i18n routing directories (`/[lang]/...`).
- `public/`: Static assets like images and fonts.
- `scripts/`: Helper scripts (e.g., database interactions/seeding).
- `antigravity/`: Documentation and project guidelines (e.g., real estate best practices).

## Contributing
Contributions, issues, and feature requests are welcome!

---
*Powered by Next.js and Supabase*
