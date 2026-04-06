#!/bin/bash
# Post-deploy script: runs Prisma migrations/push on Zeabur
# This creates the database tables automatically

echo "🔧 Running Prisma db push..."
npx prisma db push --accept-data-loss 2>/dev/null || npx prisma db push
echo "✅ Database tables ready!"
