FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy source files
COPY src ./src
COPY data ./data

# Download PostgreSQL JDBC driver
RUN mkdir -p /app/lib && \
    apt-get update && apt-get install -y wget && \
    wget -q https://jdbc.postgresql.org/download/postgresql-42.6.0.jar -O /app/lib/postgresql-42.6.0.jar && \
    apt-get remove -y wget && apt-get clean && \
    echo "✓ JAR downloaded to /app/lib/" && ls -lh /app/lib/

# Compile with absolute path to JAR
RUN javac -cp /app/lib/postgresql-42.6.0.jar -d /app src/com/ai_travel/*.java && \
    echo "✓ Compilation complete"

ENV PORT=8080
EXPOSE 8080

# Explicit absolute paths for classpath
CMD ["java", "-cp", "/app:/app/lib/*", "com.ai_travel.Main"]