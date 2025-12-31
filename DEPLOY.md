# Deployment Guide

## Quick Deploy

```bash
# 1. Sign into 1Password
eval $(op signin)

# 2. Deploy
bin/kamal deploy
```

## Sync Database (optional)

If you have new scraped data locally:

```bash
bin/rails db:sync:push
```

## Useful Commands

```bash
bin/kamal logs          # View logs
bin/kamal console       # Rails console
bin/kamal app restart   # Restart app
```

## First Time Setup

See main README for initial server setup and Cloudflare tunnel configuration.

