# ROGB Finance

A church finance management system built with Next.js, TypeScript, and shadcn/ui. This application allows church members and staff to submit reimbursement forms, budget proposals, and event audits.

## Features

- **Reimbursement Forms**: Submit expense reimbursement requests for church-related activities
- **Budget Proposals**: Submit budget proposals for upcoming church events and programs
- **Event Audits**: Submit audit reports for completed church events

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect the Next.js configuration and deploy

## Project Structure

```
rogb-finance/
├── src/
│   ├── app/
│   │   ├── audit/          # Event audit page
│   │   ├── budget/         # Budget proposal page
│   │   ├── reimbursement/  # Reimbursement form page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   ├── navigation.tsx  # Navigation component
│   │   └── ui/             # shadcn/ui components
│   └── lib/
│       └── utils.ts        # Utility functions
├── public/                 # Static assets
└── package.json
```

## Customization

### Adding New Form Fields

Edit the respective page files in `src/app/` to add or modify form fields:
- `reimbursement/page.tsx` - Reimbursement form
- `budget/page.tsx` - Budget proposal form
- `audit/page.tsx` - Event audit form

### Styling

The application uses TailwindCSS for styling. Customize the theme in `tailwind.config.ts` and global styles in `src/app/globals.css`.

## License

This project is licensed under the MIT License.
