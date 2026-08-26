FROM eclipse-temurin:21-jdk AS builder

WORKDIR /build

# Create directories
RUN mkdir -p out lib data

# Download PostgreSQL JDBC driver
RUN wget -O lib/postgresql-42.6.0.jar \
    https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

# Copy source files
COPY src ./src

# Compile Java source files
RUN javac \
    -cp "lib/postgresql-42.6.0.jar" \
    -d out \
    $(find src -name "*.java")

# Copy data files
COPY data ./data


# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy compiled classes
COPY --from=builder /build/out ./

# Copy data files
COPY --from=builder /build/data ./data

# Copy PostgreSQL JDBC driver
COPY --from=builder /build/lib ./lib

# Run application with PostgreSQL JDBC driver
CMD ["java", "-cp", "/app:/app/lib/*", "com.ai_travel.Main"]