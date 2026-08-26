FROM node:20-alpine AS build
WORKDIR /build
COPY package.json ./
RUN npm install
COPY build/ build/
COPY js/ js/
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css /usr/share/nginx/html/
COPY --from=build /build/dist/js/ /usr/share/nginx/html/js/

EXPOSE 8080
