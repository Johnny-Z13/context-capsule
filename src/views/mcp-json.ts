export function getMcpDiscovery(): object {
  return {
    name: 'Context Capsule',
    description: 'Optional hosted transport for short-lived coding handoffs. Public by URL; never include secrets.',
    url: 'https://www.contextcapsule.ai',
    version: '1.0.0',
    tools: [
      { name: 'create_capsule', description: 'Create a context capsule' },
      { name: 'fetch_capsule', description: 'Fetch a capsule by ID' },
      { name: 'signup', description: 'Get a free API key' },
    ],
    package: '@contextcapsule/mcp-server',
    install: 'npx -y @contextcapsule/mcp-server',
  }
}
