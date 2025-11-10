/**
 * AI/Quantum Service Worker
 * Routes requests to the AI/Quantum container
 */

import { Container, getContainer } from "@cloudflare/containers";

// Durable Object class for AI Container
export class AIContainer extends Container {
  defaultPort = 8000;
  sleepAfter = "5m";
  
  envVars = {
    SERVICE_NAME: "ai-quantum",
    ENVIRONMENT: "production"
  };

  onStart() {
    console.log("AI/Quantum container started");
  }

  onStop() {
    console.log("AI/Quantum container stopped");
  }

  onError(error) {
    console.error("AI/Quantum container error:", error);
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
        service: 'ai-quantum',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Route to container
    try {
      // Get container instance (singleton pattern)
      const container = getContainer(env.AI_CONTAINER);
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

