import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const POOL_FILE = path.join(process.cwd(), 'data', 'pool.json');

export async function GET() {
  try {
    await fs.access(POOL_FILE);
    const data = await fs.readFile(POOL_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    console.error('Error reading pool:', error);
    return NextResponse.json({ error: 'Failed to read pool' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await fs.mkdir(path.dirname(POOL_FILE), { recursive: true });
    await fs.writeFile(POOL_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing pool:', error);
    return NextResponse.json({ error: 'Failed to write pool' }, { status: 500 });
  }
}
