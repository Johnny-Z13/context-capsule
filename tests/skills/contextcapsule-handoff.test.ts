import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import {
  appendFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const script = resolve('.agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs')
let sandbox = ''
let repository = ''
let semanticInput = ''
let outputDir = ''

function git(cwd: string, ...args: string[]) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

function run(...args: string[]) {
  return JSON.parse(execFileSync('node', [script, ...args], { encoding: 'utf8' }))
}

function initialiseRepository(path: string) {
  mkdirSync(path, { recursive: true })
  git(path, 'init', '-q')
  git(path, 'config', 'user.email', 'tests@example.com')
  git(path, 'config', 'user.name', 'ContextCapsule Tests')
  writeFileSync(join(path, 'tracked.txt'), 'initial\n')
  git(path, 'add', 'tracked.txt')
  git(path, 'commit', '-qm', 'initial')
}

beforeAll(() => {
  sandbox = mkdtempSync(join(tmpdir(), 'contextcapsule-skill-'))
  repository = join(sandbox, 'source-repo')
  semanticInput = join(sandbox, 'semantic.json')
  outputDir = join(sandbox, 'capsule-output')
  initialiseRepository(repository)
  writeFileSync(semanticInput, JSON.stringify({
    objective: 'Continue the migration safely',
    status_summary: 'Implementation complete; deployment is not verified',
    decisions: ['Keep the legacy endpoint'],
    constraints: ['Do not publish without approval'],
    verification: [{
      command: 'npm test -- --run',
      result: '71 passed',
      observed_at: '2026-07-19T09:10:20.000Z',
      source: 'observed',
    }],
    blockers: ['Production smoke test is outstanding'],
    next_action: 'Run the production smoke test',
    references: { proofslip_ids: ['prf_example'], issues: [], pull_requests: [] },
  }))
})

afterAll(() => {
  rmSync(sandbox, { recursive: true, force: true })
})

describe('contextcapsule-handoff skill script', () => {
  it('captures bounded repository state without file contents', () => {
    const captured = run('capture', '--repo', repository)
    expect(captured.root_name).toBe('source-repo')
    expect(captured.working_tree).toBe('clean')
    expect(captured.head_sha).toMatch(/^[a-f0-9]{40}$/)
    expect(captured.changed_files).toEqual([])
    expect(JSON.stringify(captured)).not.toContain('initial')
  })

  it('creates JSON and Markdown handoffs outside the repository', () => {
    const created = run(
      'create',
      '--repo', repository,
      '--input', semanticInput,
      '--out-dir', outputDir,
    )
    expect(created.capsule.schema_version).toBe('coding-handoff/v1')
    expect(created.capsule.repository.working_tree).toBe('clean')

    const json = JSON.parse(readFileSync(join(outputDir, 'latest.json'), 'utf8'))
    const markdown = readFileSync(join(outputDir, 'latest.md'), 'utf8')
    expect(json.next_action).toBe('Run the production smoke test')
    expect(markdown).toContain('# ContextCapsule handoff')
    expect(markdown).toContain('prf_example')
  })

  it('does not make its own local capsule immediately stale', () => {
    const created = run(
      'create',
      '--repo', repository,
      '--input', semanticInput,
    )
    expect(created.files.json).toMatch(/\/source-repo\/\.contextcapsule\/latest\.json$/)

    const resumed = run(
      'resume',
      '--repo', repository,
      '--capsule', created.files.json,
    )
    expect(resumed.classification).toBe('compatible')
    expect(resumed.current_repository.working_tree).toBe('clean')
  })

  it('classifies an unchanged repository as compatible and later changes as stale', () => {
    const compatible = run(
      'resume',
      '--repo', repository,
      '--capsule', join(outputDir, 'latest.json'),
    )
    expect(compatible.classification).toBe('compatible')

    appendFileSync(join(repository, 'tracked.txt'), 'changed\n')
    const stale = run(
      'resume',
      '--repo', repository,
      '--capsule', join(outputDir, 'latest.json'),
    )
    expect(stale.classification).toBe('stale')
    expect(stale.discrepancies).toContain('working-tree fingerprint changed')
  })

  it('classifies a different repository as mismatched', () => {
    const other = join(sandbox, 'other-repo')
    initialiseRepository(other)
    const result = run(
      'resume',
      '--repo', other,
      '--capsule', join(outputDir, 'latest.json'),
    )
    expect(result.classification).toBe('mismatched')
    expect(result.safe_to_reuse).toEqual([])
  })

  it('accepts a renamed clone when the remote identity and repository state match', () => {
    const original = join(sandbox, 'remote-source')
    const renamedClone = join(sandbox, 'renamed-clone')
    const cloneOutput = join(sandbox, 'clone-capsule')
    initialiseRepository(original)
    git(original, 'remote', 'add', 'origin', 'https://github.com/z13labs/shared-project.git')
    git(sandbox, 'clone', '-q', original, renamedClone)
    git(renamedClone, 'remote', 'set-url', 'origin', 'https://github.com/z13labs/shared-project.git')

    const created = run(
      'create',
      '--repo', original,
      '--input', semanticInput,
      '--out-dir', cloneOutput,
    )
    const resumed = run(
      'resume',
      '--repo', renamedClone,
      '--capsule', created.files.json,
    )
    expect(resumed.classification).toBe('compatible')
    expect(resumed.discrepancies).toEqual([])
  })

  it('rejects likely secrets before writing a capsule', () => {
    const unsafe = join(sandbox, 'unsafe.json')
    writeFileSync(unsafe, JSON.stringify({
      objective: 'Do work',
      status_summary: 'Token sk-abcdefghijklmnopqrstuvwxyz123456 leaked here',
      next_action: 'Stop',
    }))
    expect(() => execFileSync('node', [
      script,
      'create',
      '--repo', repository,
      '--input', unsafe,
      '--out-dir', join(sandbox, 'unsafe-output'),
    ], { encoding: 'utf8', stdio: 'pipe' })).toThrow()
  })

  it('rejects verification timestamps materially in the future', () => {
    const future = join(sandbox, 'future.json')
    writeFileSync(future, JSON.stringify({
      objective: 'Do work',
      status_summary: 'Waiting for verification',
      verification: [{
        command: 'npm test',
        result: 'reported passing',
        observed_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        source: 'reported',
      }],
      next_action: 'Verify locally',
    }))
    expect(() => execFileSync('node', [
      script,
      'create',
      '--repo', repository,
      '--input', future,
      '--out-dir', join(sandbox, 'future-output'),
    ], { encoding: 'utf8', stdio: 'pipe' })).toThrow()
  })
})
