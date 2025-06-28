# ---------- builder ----------
FROM python:3.12-slim-bookworm AS builder

ARG POETRY_VERSION=2.1.3
RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app
COPY pyproject.toml poetry.lock ./
# Install to a temp virtualenv under /opt (no dev deps)
RUN poetry export --without-hashes | pip install --prefix /opt/venv -r /dev/stdin

# ---------- runtime ----------
FROM python:3.12-slim-bookworm

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY --from=builder /opt/venv /opt/venv
WORKDIR /app
COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
