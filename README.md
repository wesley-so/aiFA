# aiFA

aiFA (Artificial Intelligent Finacial Advisor), the financial advisor with
artificial intelligence (AI) system to predict 20 NASDAQ stock price.

## Prerequisite

- [Docker](https://docs.docker.com/get-docker/) (Docker Engine 19.03.0 or higher)
- [Docker Compose v2](https://docs.docker.com/compose/install/)

### Extra requirement for Nvidia GPU support in Docker container

- (Optional) [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [NVIDIA GPU driver](https://www.nvidia.com/download/index.aspx)

## Quick start

### Cronjob

1. Copy necessary files and fill up the environment variables:

   ```bash
   # Copy sample cronjob environment
   cp cron/.env.sample cron/.env

   # Copy sample object storage environment
   cp minio/.env.sample minio/.env

   # Edit "cron/.env" and "minio/.env" and fill up environment variables
   ```

   2. If you have a NVIDIA CUDA capable GPU, uncomment the lines in
   `docker-compose.yaml` to enable GPU support in Docker container.

   3. Build docker images:

   ```bash
   docker compose build
   ```

   4. Start the backend server with MongoDB:

   ```bash
   docker compose up
   ```

For detail setup, please refer to [backend guide](cron/README.md).

### Backend server

1. Copy necessary files and fill up the environment variables:

   ```bash
   # Copy sample backend environment
   cp server/.env.sample server/.env

   # Copy sample frontend environment
   cp web/.env.sample web/.env

   # Copy sample object storage environment
   cp minio/.env.sample minio/.env

   # Edit "server/.env", "web/.env" and "minio/.env" and fill up environment variables
   ```

2. If you have a NVIDIA CUDA capable GPU, uncomment the lines in
   `docker-compose.yaml` to enable GPU support in Docker container.

3. Build docker images:

   ```bash
   docker compose build
   ```

4. Start the backend server with MongoDB:

   ```bash
   docker compose up
   ```

For detail setup, please refer to [backend guide](server/README.md).

### Frontend website

Please refer to [frontend guide](web/README.md).

## Project Directory

- `.gitlab-ci.yml`: GitLab CI/CD pipeline configuration
- `docker-compose.yaml`: Docker Compose configuration for backend server and MongoDB
- `README.md`: This project setup instructions
- `/.gitlab`: GitLab related configuration
- `/cron`: Cronjob server
- `/docs`: Detail documentation of system archictecture and design
- `/minio`: MinIO configuration
- `/mongo`: MongoDB configuration
- `/server`: Backend server
- `/web`: Frontend website

## Documentation

Please refer to [Documentation](docs/README.md).
