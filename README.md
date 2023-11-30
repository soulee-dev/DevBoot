# DevBoot

DevBoot enable users eaily setup dev enviornments during Sprint

## Pre-Installation

### Generate Portianer password

```
sudo apt install apache2-utils

htpasswd -nbB admin {Your password} | cut -d ":" -f 2 | sed 's/\$/\$\$/g'

```

## Installation

Based on Ubuntu 22.04 LTS

```sh
# Install docker
curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh get-docker.sh

# Set-up Docker daemon in rootless mode
sudo apt-get install -y uidmap

dockerd-rootless-setuptool.sh install

# Clone repository
git clone https://github.com/soulee-dev/DevBoot.git

cd DevBoot
docker compose up --build  -d
```

## Ports

```
coder:7080
backend:8080
frontend:3000
portainer:9443
grafana:4000
```

## .env

```
# Coder
CODER_PG_CONNECTION_URL=postgresql://{username}:{password}@database/{database}?sslmode=disable
CODER_HTTP_ADDRESS=0.0.0.0:7080
CODER_PROMETHEUS_ENABLE=true
CODER_ACCESS_URL=http://54.180.1.105:7080

# database
POSTGRES_USER={username}
POSTGRES_PASSWORD={password}
POSTGRES_DB={database}

# Backend
SECRET_KEY=
SQLALCHEMY_DATABASE_URL=postgresql://{username}:{password}@database/{database}
ALLOWED_HOSTS=
CODER_TOKEN=
CODER_API_URL=
DISCORD_WEBHOOK_URL=

# Frontend
NEXT_PUBLIC_API_URL=

# Grafana
GF_SECURITY_ADMIN_USER=
GF_SECURITY_ADMIN_PASSWORD=

# Portainer
PORTAINER_CREDENTAIL=
```
