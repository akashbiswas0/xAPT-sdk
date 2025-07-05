#!/usr/bin/env node

/**
 * xAPT Showcase Client
 * 
 * Demonstrates the xAPT SDK client-side functionality with smart wallet
 */

import { DemoClient } from './client/demoClient';

async function main() {
  const client = new DemoClient();
  await client.runDemo();
}

main().catch(console.error); 