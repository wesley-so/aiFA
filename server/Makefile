.PHONY: setup start

AIFA_SERVER_HOST ?= 0.0.0.0
AIFA_SERVER_PORT ?= 8000

ifeq ($(BUILD_NO_CACHE),1)
POETRY_INSTALL_ARGS = --no-cache
endif

all: setup

setup:
	poetry install $(POETRY_INSTALL_ARGS)

setup-production:
	poetry install --without dev $(POETRY_INSTALL_ARGS)

start:
	poetry run uvicorn aifa.app:app --host "$(AIFA_SERVER_HOST)" --port "$(AIFA_SERVER_PORT)"

dev:
	poetry run uvicorn aifa.app:app --host "$(AIFA_SERVER_HOST)" --port "$(AIFA_SERVER_PORT)" --reload

lint:
	poetry run flake8 aifa

ci-lint:
	poetry run flake8 --format gl-codeclimate --output-file gl-codequality.json aifa

format:
	poetry run black aifa
	poetry run isort aifa

format-check:
	poetry run black aifa --check
	poetry run isort aifa --check-only
