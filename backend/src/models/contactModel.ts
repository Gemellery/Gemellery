import pool from '../database';

export interface ContactMessage {
  first_name: string;
  last_name: string;
  email: string;
  inquiry_type: string;
  message: string;
  subscribe: boolean;
}

export const saveContactMessage = async (data: ContactMessage): Promise<void> => {
  const query = `
    INSERT INTO contact_messages 
      (first_name, last_name, email, inquiry_type, message, subscribe)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(query, [
    data.first_name,
    data.last_name,
    data.email,
    data.inquiry_type,
    data.message,
    data.subscribe ? 1 : 0,
  ]);
};