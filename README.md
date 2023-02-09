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

### Backend server

1. Copy neccessary files and fill up the environment variables:

   ```bash
   # Copy sample backend environment
   cp server/.env.sample server/.env

   # Copy sample frontend environment
   cp web/.env.sample web/.env

   # Edit "server/.env" and "web/.env" and fill up environment variables
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
- `/docs`: Detail documentation of system archictecture and design
- `/mongo`: MongoDB configuration
- `/server`: Backend server
- `/web`: Frontend website

## Documentation

Please refer to [Documentation](docs/README.md).
