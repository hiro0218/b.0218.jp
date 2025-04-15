# System Patterns

## System Architecture
- The project follows a modular architecture to ensure scalability and maintainability.
- Blog posts are stored in a submodule (`_article`) and processed into JSON format for static site generation.
- Next.js is used as the primary framework for building and rendering the site.

## Key Technical Decisions
- Use of TypeScript for type safety and better developer experience.
- Adoption of Panda CSS for styling to ensure consistency and maintainability.
- Static Site Generation (SSG) for optimal performance and SEO.

## Design Patterns in Use
- Component-based architecture for React components.
- Separation of concerns: scripts for data processing are isolated in `src/build`.
- Reusable and small components to enhance code reusability.

## Component Relationships
- Data flow: Markdown files → JSON conversion → Static pages.
- Components interact through well-defined props and state management.
