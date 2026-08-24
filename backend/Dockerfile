FROM eclipse-temurin:21-jre as builder
WORKDIR /build
COPY src ./src
COPY data ./data
RUN javac -d out src/com/ai_travel/*.java

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/out ./
COPY --from=builder /build/data ./data
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-cp", ".", "com.ai_travel.Main"]
