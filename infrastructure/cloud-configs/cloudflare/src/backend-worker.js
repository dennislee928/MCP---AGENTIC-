/**
 * Backend Service Worker
 * Routes requests to the Go Backend container
 */

import { Container, getContainer } from "@cloudflare/containers";

// Durable Object class for Backend Container
export class BackendContainer extends Container {
  defaultPort = 3001;
  sleepAfter = "5m";
  
  envVars = {
    SERVICE_NAME: "backend",
    ENVIRONMENT: "production"
  };

  onStart() {
    console.log("Backend container started");
  }

  onStop() {
    console.log("Backend container stopped");
  }

  onError(error) {
    console.error("Backend container error:", error);
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
        service: 'backend',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Route to container
    try {
      // Get container instance (singleton pattern)
      const container = getContainer(env.BACKEND_CONTAINER);
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

