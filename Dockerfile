FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/colorcustoms-0.0.1-SNAPSHOT.jar /app/app.jar

ENV JAVA_OPTS="-Xms96m -Xmx384m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError -XX:+HeapDumpOnOutOfMemoryError"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
