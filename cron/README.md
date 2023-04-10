# aiFA Linux Cronjob

A Linux cronjob built inside Linux WSL2 system

## Prerequisite

- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) Linux v22.04
- [Python](https://www.python.org/downloads/) 3.10
- [Poetry](https://python-poetry.org/docs/#installation)

## Development quick start

### Docker Compose way (Recommended)

Please refer to [project quick start guide](../README.md).

### Native way

1. Install dependency packages:
    
    ```bash
   make setup
   ```

2. 2. Start a MongoDB instance.

3. Export environment variables listed in `.env.sample`.

4. cronjob self started

## Production build

Only Docker image build is supported currently.

```bash
docker build -t aifa-cron:latest .

## build with NVIDIA GPU support
docker build -f Dockerfile.gpu -t afia-cron:gpu-latest .