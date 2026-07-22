# QuizBattle — AWS Deployment & CI/CD Guide

This guide details how to deploy **QuizBattle** on an AWS EC2 instance using Docker & Docker Compose, and how to configure a robust CI/CD pipeline using GitHub Actions for automated testing and deployment.

---

## Part 1: Deploying to AWS EC2 with Docker

We will set up a single Ubuntu EC2 instance running both the MySQL database and the Node.js/React application inside Docker containers.

```
Internet (Port 80/443) 
       │
       ▼
  EC2 Instance
┌──────────────────────────────────────┐
│  Docker Compose                      │
│  ┌────────────────────────────────┐  │
│  │ app (Node + React Static)      │  │
│  │ port 5000                      │  │
│  └───────────────┬────────────────┘  │
│                  │ (Internal Network)│
│                  ▼                   │
│  ┌────────────────────────────────┐  │
│  │ mysql                          │  │
│  │ port 3306                      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 1. Launching the EC2 Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2** and click **Launch Instance**.
3. Choose **Ubuntu Server 24.04 LTS** (or 22.04 LTS) as the AMI.
4. Select instance size (e.g., `t3.micro` or `t3.small` depending on expected player traffic).
5. Generate or choose an existing key pair (`.pem` file) for SSH access.
6. Under **Network Settings**, configure the Security Group:
   - Allow **SSH** (Port `22`) from your IP.
   - Allow **HTTP** (Port `80`) from Anywhere.
   - Allow **HTTPS** (Port `443`) from Anywhere.
   - Allow Port **5000** (optional, if you want to bypass Nginx proxies during testing).

### 2. Installing Docker on EC2
SSH into your instance:
```bash
ssh -i /path/to/key.pem ubuntu@your-ec2-public-ip
```

Run the following script to install Docker & Docker Compose:
```bash
# Update package database
sudo apt-get update -y
sudo apt-get upgrade -y

# Install prerequisite packages
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Allow run docker commands without sudo
sudo usermod -aG docker ubuntu
```
*Note: Log out and log back in for the user group changes to take effect.*

### 3. Deploying the Application
On the EC2 instance, clone your repository:
```bash
git clone https://github.com/mahe15/quiz.git
cd quiz
```

Create a production `.env` file (if you have custom settings, otherwise the `docker-compose.yml` defaults are preconfigured for internal connection):
```bash
# Verify environment variables in docker-compose.yml match your needs
```

Launch the stack in detached mode:
```bash
docker compose up -d --build
```

Verify that the containers are healthy:
```bash
docker compose ps
```

---

## Part 2: Production-Ready Nginx & SSL (Optional but Recommended)

For HTTPS and custom domain mapping, you can set up Nginx directly on the EC2 host to act as a reverse proxy for your Docker container.

### 1. Install Nginx and Certbot on EC2:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Create an Nginx server block:
```bash
sudo nano /etc/nginx/sites-available/quizbattle
```

Insert the following configuration (replace `quiz.yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name quiz.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Enable configuration & reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/quizbattle /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # Remove default site
sudo nginx -t # Test syntax
sudo systemctl restart nginx
```

### 4. Secure with free SSL certificate:
```bash
sudo certbot --nginx -d quiz.yourdomain.com
```

---

## Part 3: Setting Up CI/CD with GitHub Actions

Automate your workflow so that pushing code to the `main` branch builds the Docker image and deploys it automatically to your EC2 instance.

### 1. GitHub Secrets Configuration
In your GitHub repository, go to **Settings > Secrets and variables > Actions** and create the following Secrets:

| Secret Name | Description | Example Value |
|---|---|---|
| `HOST` | Public IP address of EC2 | `54.210.32.115` |
| `USERNAME` | Default user name for EC2 | `ubuntu` |
| `SSH_PRIVATE_KEY` | Private SSH Key used to log into EC2 | Contents of your `.pem` key file |
| `DOCKER_USERNAME` | Your Docker Hub Username | `my_docker_user` |
| `DOCKER_PASSWORD` | Docker Hub Access Token/Password | `dckr_pat_...` |

### 2. Create the Workflow File
Create the folder structure `.github/workflows/` and add `deploy.yml`.

#### [NEW] `.github/workflows/deploy.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  # ── CI Job: Build and Lint ──────────────────────────────────
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Frontend Deps & Build Test
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Install Backend Deps
        run: |
          cd backend
          npm ci

  # ── CD Job: Deploy to AWS EC2 ───────────────────────────────
  deploy:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      # SSH into EC2 and run pull/redeploy script
      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd quiz
            git pull origin main
            docker compose up -d --build
            docker image prune -f
```

### 3. Deploy Workflow Process
With the workflow saved:
1. Pushing to `main` starts the pipeline.
2. The code is tested & verified.
3. The Docker image is compiled and pushed to your Docker Hub repository.
4. GitHub Actions connects to the EC2 server via SSH, pulls the latest changes from Git, pulls the latest built container images, runs `docker compose up -d --build`, and safely cleans up old unused container images (`docker image prune -f`).
hi