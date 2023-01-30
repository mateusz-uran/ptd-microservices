FROM eclipse-temurin:17.0.5_8-jre-alpine as builder
WORKDIR extracted
ADD target/*.jar user-1.0-SNAPSHOT.jar
RUN java -Djarmode=layertools -jar user-1.0-SNAPSHOT.jar extract

FROM eclipse-temurin:17.0.5_8-jre-alpine
WORKDIR application
COPY --from=builder extracted/dependencies/ ./
COPY --from=builder extracted/spring-boot-loader/ ./
COPY --from=builder extracted/snapshot-dependencies/ ./
COPY --from=builder extracted/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]