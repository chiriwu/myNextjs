This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Next.js App Router 的文件约定
API 路由：route.ts
在 app 目录下，route.ts 用于创建 API 
```javascript
src/app/api/test-db/route.ts  →  /api/test-db
src/app/api/users/route.ts    →  /api/users
src/app/api/poetry/route.ts   →  /api/poetry
```
route.ts的使用规则
```javascript
// ✅ 正确
export async function GET() { ... }
export async function POST() { ... }

export async function GET() { ... }      // GET 请求
export async function POST() { ... }     // POST 请求
export async function PUT() { ... }      // PUT 请求
export async function DELETE() { ... }   // DELETE 请求
export async function PATCH() { ... }    // PATCH 请求

// ❌ 错误
export default function handler() { ... }
```
页面路由：page.tsx
用于创建页面：
```javascript
src/app/page.tsx              →  /
src/app/about/page.tsx        →  /about
src/app/poetry/page.tsx       →  /poetry
```
布局：layout.tsx
用于定义布局：
```javascript
src/app/layout.tsx            →  根布局
src/app/dashboard/layout.tsx  →  /dashboard 的布局
```
其他约定文件
loading.tsx - 加载状态 UI
error.tsx - 错误边界
not-found.tsx - 404 页面
template.tsx - 模板组件