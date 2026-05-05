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

# Stage 2: tiny glibc runtime, no JVM
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /app/target/colorcustoms /app/colorcustoms

EXPOSE 8080
ENTRYPOINT ["/app/colorcustoms"]
