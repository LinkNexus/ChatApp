FROM node:23-alpine AS node_base
WORKDIR /app
COPY package*.json ./
ENV PORT=3000
EXPOSE 3000

FROM node_base as node_dev
RUN npm install
COPY . .
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM node_base as node_build
RUN npm install --omit-dev
COPY . .
CMD ["npm", "run", "build"]

FROM node_base as node_prod
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
COPY --from=node_build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=node_build /app/node_modules ./node_modules
COPY --from=node_build /app/package.json ./package.json
COPY --from=node_build /app/public ./public
CMD ["npm", "run", "start"]
