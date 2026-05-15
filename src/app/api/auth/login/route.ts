import { NextRequest } from 'next/server';
import { proxyAuthMutation } from '@/lib/api/server/session';

export async function POST(request: NextRequest) {    
  
  return proxyAuthMutation(request, 'auth/login');
}