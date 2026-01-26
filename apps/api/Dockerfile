FROM node:22

WORKDIR /app

# 1. Copy root workspace manifests
COPY package.json package-lock.json ./

# 2. Copy workspace package manifests (dependency graph only)
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY tsconfig.base.json tsconfig.base.json

# 3. Install dependencies at workspace root
RUN npm install

# 4. Copy the rest of the repository
COPY . .

# generate prisma client (REQUIRED)
RUN npx prisma generate

# 5. Build ONLY the API using docker-specific tsconfig
RUN npx tsc -p apps/api/tsconfig.json

# 6. Run ONLY the API
CMD ["node", "apps/api/dist/index.js"]
