FROM python:3.10-slim

RUN apt-get update \
    && apt-get install cron vim tzdata -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ARG PIP_NO_CACHE_DIR=true
ARG POETRY_VERSION=1.3.2
RUN pip3 install poetry==${POETRY_VERSION}

WORKDIR /cron

COPY poetry.lock pyproject.toml ./
RUN poetry install
COPY aifa_cron .

# Copy and install crontab
COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

# entry bash script
COPY entrypoint.sh /entrypoint.sh
CMD ["bash","cron/entrypoint.sh"]
