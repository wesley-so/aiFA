FROM python:3.10-slim

RUN apt-get update && apt-get install cron -y
ARG PIP_NO_CACHE_DIR=true
ARG POETRY_VERSION=1.3.2
RUN pip3 install poetry==${POETRY_VERSION}

WORKDIR /cron

COPY poetry.lock pyproject.toml ./
RUN poetry install
COPY . .
COPY /aifa_cron/jobs /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN cd cron/ && ./bin/cron
RUN /usr/bin/crontab /etc/cron.d/crontab
CMD ["cron","-f"]