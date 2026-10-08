import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gkagdfwlihzxxbmbtgag.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYWdkZndsaWh6eHhibWJ0Z2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDQ5NDYsImV4cCI6MjEwNzAyMDk0Nn0.QTB2USXO8WC81qcxAk0Px80wD8swrdjI-CyA4bzwwsI';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, email, password } = body;

    if (!employeeId || !email) {
      return NextResponse.json({ error: 'Missing employee ID or email' }, { status: 400 });
    }

    const cleanId = String(employeeId).trim().toUpperCase();
    const cleanEmail = String(email).trim().toLowerCase();
    const pass = password || 'Ljcorp2026!';

    // Candidate payloads matching different possible column naming schemes in Table Editor:
    // 1. "Public employees" with 'emp id', 'email', 'password'
    // 2. "Public employees" with 'emp id', 'gmail', 'password'
    // 3. "Public employees" with 'employee_id', 'email', 'password'
    // 4. "employees" table
    const tableNames = ['Public employees', 'employees', 'public_employees'];

    let saved = false;
    let lastError: any = null;

    for (const tableName of tableNames) {
      // Attempt 1: 'emp id', 'email', 'password'
      const { data: d1, error: err1 } = await supabase.from(tableName).upsert([
        {
          'emp id': cleanId,
          email: cleanEmail,
          password: pass,
        }
      ]).select();

      if (!err1) {
        saved = true;
        return NextResponse.json({ success: true, table: tableName, data: d1 });
      }

      // Attempt 2: 'emp id', 'gmail', 'password'
      const { data: d2, error: err2 } = await supabase.from(tableName).upsert([
        {
          'emp id': cleanId,
          gmail: cleanEmail,
          password: pass,
        }
      ]).select();

      if (!err2) {
        saved = true;
        return NextResponse.json({ success: true, table: tableName, data: d2 });
      }

      // Attempt 3: 'employee_id', 'email', 'password'
      const { data: d3, error: err3 } = await supabase.from(tableName).upsert([
        {
          employee_id: cleanId,
          email: cleanEmail,
          password: pass,
        }
      ]).select();

      if (!err3) {
        saved = true;
        return NextResponse.json({ success: true, table: tableName, data: d3 });
      }

      lastError = err1 || err2 || err3;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Could not write to Supabase table editor due to column type mismatch.',
        error: lastError,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
