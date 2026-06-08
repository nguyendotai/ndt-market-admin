# Tech Stack By Feature

Tai lieu nay dung de theo doi cong nghe duoc su dung theo tung chuc nang cua Admin Dashboard.

Khi them moi hoac thay doi cong nghe cho bat ky chuc nang nao, hay cap nhat bang ben duoi trong cung PR/commit voi code thay doi.

## Quy Uoc Cap Nhat

- Ghi ro ten chuc nang hoac module.
- Ghi ro thu vien/framework/cong nghe duoc dung.
- Ghi ro file/folder lien quan de nguoi sau de truy vet.
- Neu thay the cong nghe cu, ghi ly do ngan gon trong cot ghi chu.
- Neu chuc nang co API, ghi ro endpoint group hoac RTK Query slice lien quan.

## Bang Theo Doi

| Chuc nang | Cong nghe su dung | File/folder lien quan | Ghi chu |
| --- | --- | --- | --- |
| App shell | Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Lucide React | `src/app`, `src/components/layout`, `src/components/ui` | Khung dashboard admin ban dau |
| Theme | next-themes, Tailwind dark mode, shadcn CSS variables | `src/app/providers`, `src/components/theme`, `src/app/globals.css` | Dark mode dung class strategy |
| Toast | Sonner | `src/app/providers/app-provider.tsx` | Toaster dat o root provider |
| State management | Redux Toolkit, React Redux | `src/lib/store` | Store typed voi `RootState`, `AppDispatch` |
| API client | RTK Query, `NEXT_PUBLIC_API_URL` | `src/lib/api/base-api.ts`, `.env.example` | Base API dung `fetchBaseQuery` |
| Form validation | React Hook Form, Zod, `@hookform/resolvers` | `src/lib/validations` | Schema mau cho product form |
| Dashboard overview | React Server Components, TailwindCSS, Lucide React | `src/features/dashboard` | Du lieu hien tai dang la mock UI |

## Template Cho Chuc Nang Moi

| Chuc nang | Cong nghe su dung | File/folder lien quan | Ghi chu |
| --- | --- | --- | --- |
| Ten chuc nang | Thu vien/cong nghe | `path/to/files` | Ly do/endpoint/state/form neu co |

