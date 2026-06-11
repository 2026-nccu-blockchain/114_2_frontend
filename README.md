# SSS Platform Frontend

SSS Platform 是一個以 React、TypeScript、Vite 建置的多角色平台前端，支援買家、賣家、司機與管理員流程。base URL 為 `/api/v2`。

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS / CSS modules by page
- `react-hot-toast`
- `lucide-react`

## Project Structure

```txt
platform/
├── src/
│   ├── components/       # common/layout components
│   ├── constants/        # navigation and shared constants
│   ├── hooks/            # feature hooks, API flow hooks
│   ├── mock/             # temporary mock data
│   ├── pages/            # route pages by role
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── buyer/
│   │   ├── driver/
│   │   ├── seller/
│   │   └── shared/
│   ├── services/         # API request helpers and services
│   ├── store/            # Zustand stores
│   ├── styles/           # page-level styles
│   └── types/            # shared TypeScript types
├── .env.example
├── .env.production
└── package.json
```

## Getting Started

```bash
cd platform
npm install
npm run dev
```

Development server:

```txt
http://127.0.0.1:5173
```

Quality checks:

```bash
npm run type-check
npm run lint
npm run build
```


## Routes

Public routes:

- `/login` buyer login
- `/admin` admin login
- `/seller` seller login
- `/driver` driver login
- `/register` buyer register
- `/admin/register` admin register
- `/forgot-password` forget password flow
- `/products/:pid` product detail

Authenticated routes:

- `/profile`
- buyer: `/cart`, `/checkout`, `/orders`, `/orders/:id`
- seller: `/products`, `/products/:productId/edit`, `/add-product`, `/orders`, `/orders/:orderId`
- driver: `/tasks/:taskId`, `/active`, `/completed`
- admin: `/users`, `/add-seller`, `/add-driver`

## API Coverage

Current branch:

| Area | Status | Notes |
| --- | --- | --- |
| Auth login | Done | buyer / seller / driver / admin login |
| Auth register | Done | buyer / admin register, admin creates seller / driver |
| Forget password | Done | `POST /auth/password/forget` |
| Reset password | Done | `POST /auth/password/reset/me` from profile |
| Profile | Done | admin / buyer / seller / driver `GET` and `PUT /me` |
| Admin users | Done | list buyers, sellers, drivers |
| Upload | Done | image upload with form-data |
| Product | Done | seller add/edit/delete product and type, product detail, my products |
| Cart | Completed on another branch | Merge cart branch before final integration |
| Order | Completed on another branch | Merge order branch before final integration |
| Driver tasks | Partial/current UI exists | API branch may need to include `GET /driver/look` and `POST /driver/take/{OrderId}` if not already merged |

## API Services

- `src/services/api.ts`: shared `fetch` wrapper and URL normalization
- `src/services/authService.ts`: login/register/password APIs
- `src/services/adminService.ts`: admin user listing APIs
- `src/services/userService.ts`: profile APIs
- `src/services/productService.ts`: product APIs
- `src/services/uploadService.ts`: upload API

Cart and order services are expected to come from their completed branches.

## Auth And Password Rules

Passwords follow the API spec strength rule:

- at least 8 characters
- includes uppercase
- includes lowercase
- includes a number

Auth token and role are stored in the Zustand auth store and cookies. Protected pages are wrapped by `AuthGuard`.

## Branch / Merge Notes

- Cart and order work is completed on separate branches, so this branch may still show local/mock stores for those areas until the branches are merged.
- Before final submission, merge cart and order branches, then run:

```bash
cd platform
npm run type-check
npm run lint
npm run build
```

## Commit Message Ideas

```txt
docs: update project README with API coverage and setup
```
