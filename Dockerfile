# Stage 1: compile a GraalVM native binary
FROM ghcr.io/graalvm/native-image-community:21 AS build
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Warm the local Maven cache so source-only changes don't redownload deps.
RUN ./mvnw -B -DskipTests dependency:go-offline || true

COPY src src
RUN ./mvnw -B -Pnative -DskipTests native:compile

# Stage 2: minimal Debian runtime — needs libz for GraalVM native binary
FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends zlib1g \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/colorcustoms /app/colorcustoms

EXPOSE 8080
ENTRYPOINT ["/app/colorcustoms"]
