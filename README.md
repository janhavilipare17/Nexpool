# NexPool

A smart hostel contribution platform that simplifies the collection and management of shared expenses among roommates.

Live Demo: [nexpool.vercel.app](https://nexpool.vercel.app)

---

## Overview

NexPool removes the friction from managing group finances in hostel settings. Whether it is mess fees, security deposits, farewell collections, or any shared expense, NexPool keeps every transaction transparent, trackable, and settled — without the awkward follow-ups.

---

## Features

- **Room-wise Pool Tracking** — Organize contributions by room so every member knows exactly where things stand.
- **Instant UPI Payments** — Accept payments directly through UPI for a frictionless collection experience.
- **Payment Status Dashboard** — See at a glance who has paid and who still owes.
- **Razorpay Escrow Security** — All funds are handled through Razorpay's escrow infrastructure for safe and verified transactions.
- **Authentication** — Secure login and signup to keep pool data private to authorized members.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Linting | ESLint |
| Deployment | Vercel |
| Payments | Razorpay |

---

## Project Structure

```
Nexpool/
├── app/          # Next.js App Router pages and layouts
├── lib/          # Utility functions and shared logic
├── public/       # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/janhavilipare17/Nexpool.git
cd Nexpool
npm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm start
```

---

## Deployment

This project is deployed on [Vercel](https://vercel.com). To deploy your own instance:

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure the required environment variables (Razorpay keys, etc.).
4. Vercel will handle the build and deployment automatically.

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for further details.

---

## Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Spjtege8D88kns
RAZORPAY_KEY_SECRET=SD1TuWIPrnj37DyXmT3WEme8
```

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

---

## License

This project is currently unlicensed. Please contact the repository owner for usage permissions.

---

## Author

**Janhavi Lipare**
[github.com/janhavilipare17](https://github.com/janhavilipare17)
