import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';

type Bucket = { _id: string; count: number; expiresAt: Date };
type Limit = { key: string; maximum: number; windowMs: number };

let indexReady: Promise<string> | undefined;

export function clientKey(request: Request): string {
  const address = process.env.VERCEL === '1'
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
    : undefined;
  return address && isIP(address)
    ? createHash('sha256').update(address).digest('hex')
    : 'shared';
}

export async function enforceLimits(limits: Limit[]): Promise<Response | null> {
  await dbConnect();
  const buckets = mongoose.connection.collection<Bucket>('api_rate_limits');
  if (!indexReady) {
    indexReady = buckets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }
  try {
    await indexReady;
  } catch (error) {
    indexReady = undefined;
    throw error;
  }

  const now = Date.now();
  for (const limit of limits) {
    const windowStart = Math.floor(now / limit.windowMs) * limit.windowMs;
    const bucketId = createHash('sha256')
      .update(`${limit.key}:${windowStart}`)
      .digest('hex');
    let bucket;
    try {
      bucket = await buckets.findOneAndUpdate(
        { _id: bucketId },
        {
          $inc: { count: 1 },
          $setOnInsert: { expiresAt: new Date(windowStart + limit.windowMs) },
        },
        { upsert: true, returnDocument: 'after' }
      );
    } catch (error) {
      if (!(error instanceof mongoose.mongo.MongoServerError) || error.code !== 11000) {
        throw error;
      }
      bucket = await buckets.findOneAndUpdate(
        { _id: bucketId },
        { $inc: { count: 1 } },
        { returnDocument: 'after' }
      );
    }
    if (!bucket) throw new Error('Unable to reserve API usage');
    if (bucket.count > limit.maximum) {
      return Response.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.max(1, Math.ceil((windowStart + limit.windowMs - now) / 1000))) },
        }
      );
    }
  }
  return null;
}

export async function readMessageBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing request body');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new Error('Request body too large');
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally {
    reader.releaseLock();
  }
}
