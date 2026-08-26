FROM eclipse-temurin:21-jdk as builder
WORKDIR /build
COPY src ./src
COPY data ./data

# PostgreSQL JDBC driver indir
RUN mkdir -p /build/lib && \
    cd /build/lib && \
    wget --no-check-certificate https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

# Compile with JDBC driver in classpath
RUN javac -cp /build/lib/postgresql-42.6.0.jar -d out src/com/ai_travel/*.java

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/out ./
COPY --from=builder /build/data ./data
COPY --from=builder /build/lib ./lib

ENV PORT=8080
EXPOSE 8080

# Run with PostgreSQL JDBC driver in classpath
CMD ["java", "-cp", ".:lib/postgresql-42.6.0.jar", "com.ai_travel.Main"]
