# My Library

A simple library management application built with Nuxt 3 and Tailwind CSS.  
It allows users to browse books, authors, and categories, while providing an admin interface for managing content.

## Features

- Browse books, authors, and categories (publicly accessible after login)
- Admin interface for managing books, authors, and categories
- User authentication and role-based access control
- Pagination support for large datasets
- Fully responsive UI with Tailwind CSS

## Requirements

- Node.js >= 18
- npm, pnpm, or yarn
- A running API backend (default: `http://localhost:8000`)

## Setup

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>

# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Env

Create a .env file based on .env.example:

NUXT_PUBLIC_API_BASE=http://localhost:8000

## Development

Start the development server on http://localhost:3000:

# npm

npm run dev

# pnpm

pnpm dev

# yarn

yarn dev
