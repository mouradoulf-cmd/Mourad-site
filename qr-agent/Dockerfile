FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY web/package.json web/
RUN npm ci
COPY . .
RUN npm run build && node scripts/sync-engine.mjs || true
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production DATA_DIR=/data PORT=8787
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/server/package.json server/
COPY --from=build /app/web/package.json web/
RUN npm ci --omit=dev -w server
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/server/engine server/engine
COPY --from=build /app/web/dist web/dist
WORKDIR /app/server
ENV ENGINE_DIR=/app/server/engine WEB_DIR=/app/web/dist
VOLUME /data
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/index.js"]
