FROM python:3.10-slim

ARG POETRY_HOME=/opt/poetry
ARG BUILD_NO_CACHE=1
ARG PIP_NO_CACHE_DIR=true

# Pre-install script
RUN apt-get update \ 
    && apt-get upgrade -y \
    && apt-get install make curl -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN ln -s $POETRY_HOME/bin/poetry /usr/local/bin/poetry

WORKDIR /aifa

COPY . .
RUN make setup

CMD ["make","start"]