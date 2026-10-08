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
    const { employeeId, email, name, password } = body;

    const cleanId = employeeId ? String(employeeId).trim().toUpperCase() : '';
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanName = name ? String(name).trim() : '';
    const cleanPassword = password ? String(password).trim() : '';

    if (!cleanPassword && !cleanName) {
      return NextResponse.json({ error: 'Please provide a name or password to update.' }, { status: 400 });
    }

    const tableNames = ['Public employees', 'employees', 'public_employees'];
    let updated = false;

    for (const tableName of tableNames) {
      // 1. Try updating by emp id
      if (cleanId) {
        const { data, error } = await supabase
          .from(tableName)
          .update({
            ...(cleanPassword ? { password: cleanPassword } : {}),
            ...(cleanName ? { name: cleanName } : {}),
          })
          .eq('emp id', cleanId)
          .select();

        if (!error && data && data.length > 0) {
          updated = true;
          return NextResponse.json({ success: true, table: tableName, data });
        }

        const { data: d2, error: err2 } = await supabase
          .from(tableName)
          .update({
            ...(cleanPassword ? { password: cleanPassword } : {}),
            ...(cleanName ? { name: cleanName } : {}),
          })
          .eq('employee_id', cleanId)
          .select();

        if (!err2 && d2 && d2.length > 0) {
          updated = true;
          return NextResponse.json({ success: true, table: tableName, data: d2 });
        }
      }

      // 2. Try updating by email
      if (cleanEmail) {
        const { data: d3, error: err3 } = await supabase
          .from(tableName)
          .update({
            ...(cleanPassword ? { password: cleanPassword } : {}),
            ...(cleanName ? { name: cleanName } : {}),
          })
          .eq('email', cleanEmail)
          .select();

        if (!err3 && d3 && d3.length > 0) {
          updated = true;
          return NextResponse.json({ success: true, table: tableName, data: d3 });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Local updated. Supabase row synced if matching record exists.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update credentials' }, { status: 500 });
  }
}
