import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    const dbState = mongoose.connection.readyState;
    const stateMap: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: {
        state: stateMap[dbState],
        stateCode: dbState,
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port || 27017,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}