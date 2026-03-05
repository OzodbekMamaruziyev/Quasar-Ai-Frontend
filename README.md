# AI Builder — Loyha Hujjati (Uzbek)

AI Builder — Next.js asosidagi veb-ilova bo‘lib, foydalanuvchi soddalashtirilgan matn yordamida yuqori sifatli React Native tajribalarini tez yaratishi, ko‘rishi va boshqarishi mumkin.

## Texnologiyalar

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS v4 (globals.css), framer-motion (animatsiyalar)
- lucide-react (ikonlar), three (vizual effektlar), Sandpack (kod preview)
- ESLint (code style, lint)

## Skriptlar

- `npm run dev` — lokal dev server ([http://localhost:3000](http://localhost:3000))
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — lint tekshiruvi

## Tuzilma (asosiy)

- `src/app/page.tsx` — landing sahifa
- `src/components/landing/*` — Hero, Navbar, Features, Showcase, Pricing, Footer
- `src/app/builder/page.tsx` — Builder (Chat + Preview)
  - `src/components/builder/Chat.tsx` — AI bilan suhbat simulyatori
  - `src/components/builder/Preview.tsx` — Sandpack asosida live preview (phone/tablet/desktop)
  - `src/components/builder/Sidebar.tsx` — versiya/history, project selector
- `src/app/login/page.tsx`, `src/app/signup/page.tsx` — autentifikatsiya sahifalari (UI)
- `src/app/dashboard/*` — Dashboard, Projects, Billing, Settings
  - `src/components/dashboard/*` — navigatsiya, kartalar, skeletonlar
- `src/components/visuals/GalaxyBackground.tsx` — fon uchun 3D/visual effektlar
- `src/lib/mock-data.ts` — demo ma’lumotlar

## Marshrutlar

- `/` — Asosiy landing
- `/builder` — Matndan UI/kod generatsiya simulyatori (Chat + Preview)
- `/login`, `/signup` — Kirish/Ro‘yxatdan o‘tish (UI)
- `/dashboard` — Statistika, tezkor amallar
- `/dashboard/projects` — Loyhalar ro‘yxati, filter va ko‘rish rejimlari
- `/dashboard/billing` — Rejalar, to‘lovlar (mock)
- `/dashboard/settings` — Profil, bildirishnomalar, xavfsizlik (UI)

## Muhim xususiyatlar

- Hero sarlavha typing effekti 8 sekundda qayta yoziladi
- CTA, social proof, gradient/neon aksentlar bilan zamonaviy UI
- Builder: Sandpack orqali kodni ko‘rish/preview, qurilma o‘lchamlari
- Projects: grid/list ko‘rinish, qidiruv va status filtrlari
- Billing/Settings: interaktiv UI, mock ma’lumotlar bilan ko‘rsatmalar

## Ishga tushirish

1. `npm install`
2. `npm run dev`
3. Brauzerda `http://localhost:3000` oching

## Lint va sifat nazorati

- `npm run lint` — ESLint tekshiruvi
- Typescript strict rejim — tsconfig.json’da sozlangan

## Deploy

- Production build: `npm run build`, keyin `npm run start`
- Vercel yoki boshqa hosting platformalarida Next.js deploy qo‘llab-quvvatlanadi

## Moslashtirish

- Tailwind klasslari va komponentlar orqali UI oson sozlanadi
- Marketing copy va animatsiyalar `src/components/landing/Hero.tsx` ichida
- Previewdagi dastlabki kod `src/components/builder/Preview.tsx` da

## Cheklovlar va kelgusi ishlar

- Backend integratsiya yo‘q, ma’lumotlar mock holatda
- Publish/Export tugmalari “coming soon” tarzida ko‘rsatilgan
- Auth funksiyasi UI darajasida (navigatsiya), real backend talab qilinadi

## Mualliflik va litsenziya

- Litsenziya ko‘rsatilmagan; zarurat bo‘lsa LICENSE qo‘shish tavsiya etiladi
