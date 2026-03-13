# Env при деплое на Vercel

Переменные `NEXT_PUBLIC_*` подставляются **во время сборки**. Сайт деплоит **Vercel**, значит их нужно задать там.

## Где задать переменные

**Vercel:** проект → **Settings → Environment Variables**

Добавь (для Production, Preview, Development — по необходимости):

| Name | Пример значения |
|------|------------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.booka.life/api/v1` |
| `NEXT_PUBLIC_BUSINESS_ID` | `9369c165-4672-4ca7-90d7-d3efdafccbd6` |
| `NEXT_PUBLIC_SIGNALR_HUB_URL` | `https://api.booka.life/hubs/psychologist-match` |
| `NEXT_PUBLIC_BOOKING_BASE_URL` | `https://booka.life` |
| `NEXT_PUBLIC_IMAGE_HOST` | `img.booka.life` |
| `NEXT_PUBLIC_USE_REST_ONLY` | `false` (опционально) |

После сохранения сделай **Redeploy** последнего деплоя (Deployments → ⋮ → Redeploy), чтобы сборка прошла уже с новыми переменными.

---

Workflow `deploy.yml` в этом репо только проверяет, что сборка проходит (CI); деплой выполняет Vercel со своими env.
