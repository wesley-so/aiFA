FROM python:3.10-slim

ARG PIP_NO_CACHE_DIR=true
ARG POETRY_VERSION=1.3.2
RUN pip3 install poetry==${POETRY_VERSION}

WORKDIR /cron

COPY poetry.lock pyproject.toml ./
RUN poetry install
COPY . .
CMD ["poetry", "run", "python3", "-m", "aifa_cron.jobs.grab_daily_stock"]