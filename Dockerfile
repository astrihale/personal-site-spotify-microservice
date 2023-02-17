FROM node:18-alpine AS builder
MAINTAINER astrihale
WORKDIR /app
RUN npm install typescript@^4.9.5 -g
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS server
ENV PORT=7689
WORKDIR /home/node
RUN npm install pino-pretty@^9.2.0 -g
COPY package* ./
RUN npm install --omit=dev
COPY views/ ./views
COPY --from=builder ./app/dist ./dist/
EXPOSE 7689
CMD ["npm", "start"]
