---
title: Security
description: Encoding-aware filtering, prompt injection detection, OPA/Rego policies, and supply-chain verification.
---

Arbitus provides defense-in-depth security for MCP tool calls. This page covers the security-specific features that make Arbitus unique.

## Encoding-aware payload filtering

Standard regex-based filtering can be bypassed by encoding sensitive data as Base64, URL-encoding, double-encoding, or Unicode variants. Arbitus decodes all of these before applying `block_patterns`:

- **Base64** (standard and URL-safe)
- **Percent-encoding** (single and double)
- **Unicode normalization** (NFC)
- **Bidi-control character stripping**

This means a payload like `cGFzc3dvcmQ=` (Base64 for "password") will be caught by a `block_patterns: ["password"]` rule.

### Filter modes

```yaml
rules:
  block_patterns: ["password", "api_key", "secret"]
  filter_mode: block    # default — reject the request entirely
```

```yaml
rules:
  block_patterns: ["password", "api_key", "secret"]
  filter_mode: redact   # scrub to [REDACTED] and forward
```

In `redact` mode, matching values in tool arguments are replaced with `[REDACTED]` and the sanitized request is forwarded. Upstream responses are always scrubbed regardless of `filter_mode`.

## Prompt injection detection

Enable built-in detection of prompt injection attempts:

```yaml
rules:
  block_prompt_injection: true
```

Seven built-in patterns detect common injection techniques like "ignore previous instructions", "you are now", and similar adversarial prompts. Matched requests are always blocked, even when `filter_mode: redact` is set.

## OPA/Rego policies

For complex authorization logic, Arbitus integrates with the [Open Policy Agent](https://www.openpolicyagent.org/) via Rego policy files:

```yaml
rules:
  opa:
    policy_path: policy.rego
    entrypoint: data.mcp.allow   # must resolve to boolean
```

The policy input object contains:

| Field | Description |
|-------|-------------|
| `agent_id` | Agent name from MCP `initialize` |
| `method` | MCP method (e.g., `tools/call`) |
| `tool_name` | Tool being called |
| `arguments` | Tool call arguments |
| `client_ip` | Client IP address |

Example policy:

```rego
package mcp
import future.keywords.if

default allow := false

allow if {
    input.tool_name == "read_file"
}

allow if {
    input.agent_id == "ops-agent"
}
```

Policy file changes are picked up automatically via [config hot-reload](/docs/observability#config-hot-reload).

## Schema validation

Validate tool call arguments against the `inputSchema` from `tools/list`:

```yaml
rules:
  validate_schema: true
```

Requests with invalid or unexpected fields are blocked before reaching the upstream.

## Supply-chain verification

When using stdio transport, verify MCP server binaries before spawning:

```yaml
transport:
  type: stdio
  server: ["/usr/local/bin/mcp-server", "--data-dir", "/data"]
  verify:
    sha256: "e3b0c44298fc1c149afbf4c8996fb924..."
    cosign_bundle: "/etc/mcp/server.bundle"
    cosign_identity: "ci@example.com"
    cosign_issuer: "https://token.actions.githubusercontent.com"
```

Both `sha256` and `cosign_bundle` are optional and independent. If either check fails, the gateway aborts before spawning the process.

## Authentication

Arbitus supports multiple authentication methods with a clear priority chain:

1. **JWT Bearer** — validate tokens against HMAC secrets, JWKS endpoints, or OIDC providers
2. **mTLS** — mutual TLS with client certificate CN matching
3. **API Key** — per-agent pre-shared keys via `X-Api-Key` header
4. **clientInfo.name** — fallback to the MCP initialize message (no auth)

See [Configuration — auth](/docs/configuration#auth-jwt--oidc--oauth-21) and [Deployment — mTLS](/docs/deployment#mtls-agent-authentication) for setup details.

## Human-in-the-Loop

Sensitive tool calls can be suspended until a human operator approves them via REST API. This provides a manual safety net for high-risk operations.

See [Usage — HITL](/docs/usage#human-in-the-loop-hitl) for the full API reference.

## Shadow mode

Intercept and log tool calls without forwarding them to the upstream. Useful for safely observing what a new agent would do before granting real access.

See [Usage — Shadow mode](/docs/usage#shadow-mode) for configuration details.
