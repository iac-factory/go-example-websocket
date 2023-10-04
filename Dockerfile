# syntax=docker/dockerfile:1
# A sample microservice in Go packaged into a container image.

FROM golang:1.21-alpine AS BUILD

WORKDIR /application

COPY . ./
RUN go mod download && CGO_ENABLED=0 GOOS=linux go build -o /api
RUN adduser -h "/dev/null" -g "" -s "/sbin/nologin" -D -H -u 10001 api-service-user

FROM scratch as RELEASE

WORKDIR /

COPY --from=BUILD /api /api
COPY --from=BUILD /etc/passwd /etc/passwd

USER api-service-user

CMD ["/api"]