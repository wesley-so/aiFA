# aiFA Backend Server

A Backend API server built with [FastAPI](https://fastapi.tiangolo.com/).

## Prerequisite

- [Python](https://www.python.org/downloads/) 3.10
- [Poetry](https://python-poetry.org/docs/#installation)
- [GNU Make](https://www.gnu.org/software/make/)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) 5

## Development quick start

### Docker Compose way (Recommended)

Please refer to [project quick start guide](../README.md).

### Native way

1. Install dependency packages:

   ```bash
   make setup
   ```

2. Start a MongoDB instance.

3. Export environment variables listed in `.env.sample`.

4. Start the server:

   ```bash
   make start

   # Or, auto server reload when file changes
   make dev
   ```

## Production build

Only Docker image build is supported currently.

```bash
docker build -t aifa-server:latest .

## build with NVIDIA GPU support
docker build -f Dockerfile.gpu -t afia-server:gpu-latest .
```