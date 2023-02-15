FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS server
ENV PORT=7689
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=builder ./app/dist/src ./src
EXPOSE 7689
CMD ["npm", "start"]
