# Deployment Guide

## Automatic Deployment (CI/CD)

Pushing to `main` automatically deploys via GitHub Actions using Cloudflare Tunnel.

### First Time CI Setup

1. **Add SSH to your Cloudflare Tunnel** (on Raspberry Pi):
   
   Edit your tunnel config to add:
   ```yaml
   ingress:
     - hostname: ssh.tabsbase.com
       service: ssh://localhost:22
     # ... existing rules
   ```
   
   Then add `ssh.tabsbase.com` CNAME in Cloudflare DNS pointing to your tunnel.

2. **Generate SSH key for CI**:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
   ssh-copy-id -i ~/.ssh/github_deploy.pub guilpejon@raspberrypi.local
   ```

3. **Add secrets** in GitHub → Settings → Secrets → Actions:

   | Secret | Value |
   |--------|-------|
   | `SSH_PRIVATE_KEY` | `cat ~/.ssh/github_deploy` |
   | `KAMAL_REGISTRY_PASSWORD` | Docker Hub access token |
   | `RAILS_MASTER_KEY` | `cat config/master.key` |
   | `TABSBASE_DATABASE_PASSWORD` | PostgreSQL password |

## Manual Deploy

```bash
# 1. Sign into 1Password
eval $(op signin)

# 2. Deploy
bin/kamal deploy
```

## Sync Database

If you have new scraped data locally:

```bash
bin/rails db:sync:push
```

## Useful Commands

```bash
bin/kamal logs          # View logs
bin/kamal console       # Rails console
bin/kamal shell         # Bash shell in container
bin/kamal dbc           # Database console
bin/kamal app restart   # Restart app
bin/kamal app exec "command"  # Execute any command
```

## Debugging on Raspberry Pi

SSH directly to the Pi for low-level debugging:

```bash
ssh guilpejon@raspberrypi.local

# Access container directly
docker exec -it tabsbase-web-<hash> bash
docker logs -f tabsbase-web-<hash>
```

