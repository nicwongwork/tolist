import { pool } from '../config/db';
import { Duty } from '../types/duty.interface';

export class DutyRepository {
  async findAll(): Promise<Duty[]> {
    const { rows } = await pool.query('SELECT id::text, name FROM duties ORDER BY id ASC;');
    return rows;
  }

  async create(name: string): Promise<Duty> {
    const { rows } = await pool.query(
      'INSERT INTO duties (name) VALUES ($1) RETURNING id::text, name;',
      [name]
    );
    return rows[0];
  }

  async update(id: string, name: string): Promise<Duty | null> {
    const { rows } = await pool.query(
      'UPDATE duties SET name = $2 WHERE id = $1 RETURNING id::text, name;',
      [id, name]
    );
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM duties WHERE id = $1;', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}