.PHONY: setup start

ifeq ($(BUILD_NO_CACHE),1)
POETRY_INSTALL_ARGS = --no-cache
endif

all: setup

setup:
	poetry install $(POETRY_INSTALL_ARGS)

setup-production:
	poetry install --without dev $(POETRY_INSTALL_ARGS)

lint:
	poetry run flake8 aifa_cron

ci-lint:
	poetry run flake8 --format gl-codeclimate --output-file gl-codequality.json aifa_cron

format:
	poetry run black aifa_cron
	poetry run isort aifa_cron

format-check:
	poetry run black aifa_cron --check
	poetry run isort aifa_cron --check-only
