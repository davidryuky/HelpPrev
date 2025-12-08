import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Credenciais hardcoded conforme solicitado (apenas para verificação simples no backend)
const VALID_AUTH = 'bWF5Om1heUAwdW1p'; // Base64 de may:may@@umi (simulando header Basic ou custom)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();

    // 1. Criação automática da tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pendente',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Manipulação de Métodos
    if (req.method === 'POST') {
      // Salvar novo lead (Público)
      const { name, whatsapp, type } = req.body;
      
      if (!name || !whatsapp || !type) {
        client.release();
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      await client.query(
        'INSERT INTO leads (name, whatsapp, type) VALUES ($1, $2, $3)',
        [name, whatsapp, type]
      );
      
      client.release();
      return res.status(201).json({ message: 'Contato salvo com sucesso!' });
    } 
    
    else if (req.method === 'GET') {
      // Listar leads (Protegido - Admin)
      const authHeader = req.headers.authorization;
      
      if (authHeader !== `Bearer ${'MAY-MAY@@umi'}`) { // Verificação simples do token gerado no front
         client.release();
         return res.status(401).json({ error: 'Não autorizado' });
      }

      const result = await client.query('SELECT * FROM leads ORDER BY created_at DESC');
      client.release();
      return res.status(200).json(result.rows);
    } 
    
    else if (req.method === 'PUT') {
      // Atualizar lead (Protegido - Admin)
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${'MAY-MAY@@umi'}`) {
         client.release();
         return res.status(401).json({ error: 'Não autorizado' });
      }

      const { id, status, notes } = req.body;
      
      if (status) {
        await client.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);
      }
      if (notes !== undefined) {
        await client.query('UPDATE leads SET notes = $1 WHERE id = $2', [notes, id]);
      }

      client.release();
      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }

    client.release();
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
}