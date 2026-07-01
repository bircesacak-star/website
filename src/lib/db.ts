import { createClient, type Client } from '@libsql/client'

type InValue = string | number | null | bigint | boolean | ArrayBuffer

let client: Client | null = null

function getDb(): Client {
  if (client) return client

  const raw = process.env.DATABASE_URL ?? './data/app.db'
  const url = raw.startsWith('libsql://') || raw.startsWith('file:') ? raw : `file:${raw}`
  const authToken = process.env.TURSO_AUTH_TOKEN

  client = createClient(authToken ? { url, authToken } : { url })
  return client
}

export async function queryOne<T>(sql: string, args: InValue[] = []): Promise<T | undefined> {
  const result = await getDb().execute({ sql, args })
  if (result.rows.length === 0) return undefined
  return result.rows[0] as unknown as T
}

export async function queryAll<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  const result = await getDb().execute({ sql, args })
  return result.rows as unknown as T[]
}

export async function execute(sql: string, args: InValue[] = []): Promise<void> {
  await getDb().execute({ sql, args })
}

export async function initSchema(): Promise<void> {
  const fs = await import('fs')
  const path = await import('path')
  const schema = fs.readFileSync(path.join(process.cwd(), 'src/lib/schema.sql'), 'utf-8')
  const stmts = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))
  for (const sql of stmts) {
    await getDb().execute(sql)
  }
}
