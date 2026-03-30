# Déploiement Render

Service: `main` — Runtime: `Docker`
Branch: `cleanup-templates` (ou `main` selon config)

## Variables d'environnement requises

```
APP_BASE_URL=https://colorscustom.ch
JAVA_OPTS=-Xms256m -Xmx512m
```

## Health check

Path: `/actuator/health`

## Custom domains

- `colorscustom.ch`
- `www.colorscustom.ch`

## DNS (Cloudflare)

| Nom | Type | Valeur |
|-----|------|--------|
| `colorscustom.ch` | A | `216.24.57.1` |
| `www` | CNAME | `main-k02x.onrender.com` |

Proxy Cloudflare: **désactivé** (nuage gris) pour les deux.

## Deploy

Render → Manual Deploy → Deploy latest commit
