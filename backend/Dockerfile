FROM eclipse-temurin:21-jdk as builder
WORKDIR /build
COPY src ./src
COPY data ./data

# Download PostgreSQL JDBC driver directly
RUN mkdir -p lib && \
    curl -L -o lib/postgresql-42.6.0.jar https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

# Compile
RUN javac -cp lib/postgresql-42.6.0.jar -d out src/com/ai_travel/*.java

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/out ./
COPY --from=builder /build/data ./data
COPY --from=builder /build/lib ./lib

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-cp", ".:lib/postgresql-42.6.0.jar", "com.ai_travel.Main"]