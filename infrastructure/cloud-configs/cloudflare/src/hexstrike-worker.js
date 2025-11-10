/**
 * HexStrike AI Service Worker
 * Routes requests to the HexStrike AI container
 */

import { Container, getContainer } from "@cloudflare/containers";

// Durable Object class for HexStrike Container
export class HexStrikeContainer extends Container {
  defaultPort = 8888;
  sleepAfter = "10m";
  
  envVars = {
    SERVICE_NAME: "hexstrike-ai",
    ENVIRONMENT: "production",
    HEXSTRIKE_PORT: "8888",
    HEXSTRIKE_HOST: "0.0.0.0"
  };

  onStart() {
    console.log("HexStrike AI container started");
  }

  onStop() {
    console.log("HexStrike AI container stopped");
  }

  onError(error) {
    console.error("HexStrike AI container error:", error);
  }
}

// Worker fetch handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'hexstrike-ai',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Route to container
    try {
      // Get container instance (singleton pattern)
      const container = getContainer(env.HEXSTRIKE_CONTAINER);
      return await container.fetch(request);
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Container unavailable',
        message: error.message
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

