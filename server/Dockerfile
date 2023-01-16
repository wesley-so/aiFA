FROM python:3.10-slim

ARG BUILD_NO_CACHE=1

# Pre-install script
RUN apt-get update \ 
    && apt-get upgrade -y \
    && apt-get install make curl -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ARG PIP_NO_CACHE_DIR=true
ARG POETRY_HOME=/opt/poetry
ARG POETRY_VERSION=1.3.2
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s $POETRY_HOME/bin/poetry /usr/local/bin/poetry

WORKDIR /aifa
COPY Makefile poetry.lock pyproject.toml ./
RUN make setup
COPY . .

CMD ["make","start"]
