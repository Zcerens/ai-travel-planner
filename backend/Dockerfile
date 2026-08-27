FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy source files
COPY src ./src
COPY data ./data

# Download PostgreSQL JDBC driver and compile in single stage
RUN mkdir -p lib && \
    apt-get update && apt-get install -y wget && \
    wget -q https://jdbc.postgresql.org/download/postgresql-42.6.0.jar -O lib/postgresql-42.6.0.jar && \
    apt-get remove -y wget && apt-get clean && \
    echo "✓ JAR downloaded" && ls -lh lib/ && \
    echo "✓ Compiling Java source..." && \
    javac -cp lib/postgresql-42.6.0.jar -d . src/com/ai_travel/*.java && \
    echo "✓ Compilation complete"

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-cp", "/app:/app/lib/postgresql-42.6.0.jar", "com.ai_travel.Main"]