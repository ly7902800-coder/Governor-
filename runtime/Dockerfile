FROM ghcr.io/cirruslabs/flutter:stable
USER root
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && rm -rf /var/lib/apt/lists/*
RUN pip3 install --break-system-packages fastapi uvicorn
WORKDIR /srv/governor-runtime
COPY server.py /srv/governor-runtime/server.py
ENV PORT=8090
EXPOSE 8090
CMD ["sh","-c","uvicorn server:app --host 0.0.0.0 --port ${PORT}"]
