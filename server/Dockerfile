FROM python:3.10-slim

# Pre-install script
RUN apt-get update \ 
    && apt-get upgrade -y \
    && apt-get install make curl -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ARG PIP_NO_CACHE_DIR=true
ARG POETRY_VERSION=1.3.2
RUN pip3 install poetry==${POETRY_VERSION}

WORKDIR /aifa
ARG BUILD_NO_CACHE=1

COPY Makefile poetry.lock pyproject.toml ./
RUN make setup-production
COPY . .

CMD ["make","start"]
