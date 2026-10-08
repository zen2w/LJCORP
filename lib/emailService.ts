import emailjs from '@emailjs/browser';

// 1. Employee Email Pipeline
const EMPLOYEE_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_5azpfv8';
const EMPLOYEE_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_ktsebau';

// 2. Department Manager Email Pipeline
const MANAGER_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_MANAGER_SERVICE_ID || 'service_rqeun1b';
const MANAGER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_MANAGER_TEMPLATE_ID || 'template_7bc73k5';
export const DEPARTMENT_MANAGER_EMAIL = process.env.NEXT_PUBLIC_EMAILJS_MANAGER_EMAIL || 'gozenyans@gmail.com';

// EmailJS Public Key
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '5EbETUO7A8SUC3ma4';

export interface ActivationEmailParams {
  to_name: string;
  to_email: string;
  employee_id: string;
  username: string;
  password: string;
}

export async function sendActivationEmail(params: ActivationEmailParams): Promise<{
  success: boolean;
  employeeSent?: boolean;
  managerSent?: boolean;
  error?: string;
}> {
  const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login';

  let employeeSent = false;
  let managerSent = false;
  let employeeError = '';
  let managerError = '';

  // -------------------------------------------------------------
  // PIPELINE 1: Send Account Credentials to Employee Personal Inbox
  // Service: service_5azpfv8 | Template: template_ktsebau
  // -------------------------------------------------------------
  try {
    const employeeParams = {
      subject: `Welcome to Ljcorp - Account Credentials for ${params.to_name}`,
      to_name: params.to_name,
      to_email: params.to_email,
      user_email: params.to_email,
      email: params.to_email,
      reply_to: params.to_email,
      employee_id: params.employee_id,
      username: params.username,
      work_email: params.username,
      password: params.password,
      temp_password: params.password,
      login_url: loginUrl,
      recipient_type: 'Employee',
      message: `Hello ${params.to_name},\n\nYour Ljcorp Employee Account (${params.employee_id}) has been activated.\n\nUsername: ${params.username}\nTemporary Password: ${params.password}\nPortal URL: ${loginUrl}\n\nPlease sign in and update your security settings.`,
    };

    console.log(`[EmailJS] Dispatching to Employee Personal Email (${params.to_email}) via Service: ${EMPLOYEE_SERVICE_ID}, Template: ${EMPLOYEE_TEMPLATE_ID}`);
    const empRes = await emailjs.send(
      EMPLOYEE_SERVICE_ID,
      EMPLOYEE_TEMPLATE_ID,
      employeeParams,
      PUBLIC_KEY
    );

    console.log('[EmailJS] Employee email sent! Status:', empRes.status, empRes.text);
    if (empRes.status === 200) {
      employeeSent = true;
    }
  } catch (err: unknown) {
    console.error('[EmailJS] Failed delivering to Employee:', err);
    employeeError = err instanceof Error ? err.message : 'Error delivering to employee email';
  }

  // Brief 400ms delay to cleanly separate the two HTTP dispatches
  await new Promise(resolve => setTimeout(resolve, 400));

  // -------------------------------------------------------------
  // PIPELINE 2: Send Verification Notice to Department Manager
  // Service: service_rqeun1b | Template: template_7bc73k5 | Email: gozenyans@gmail.com
  // -------------------------------------------------------------
  try {
    const managerParams = {
      subject: `[Manager Verification] Employee Activated: ${params.to_name} (${params.employee_id})`,
      to_name: 'Department Manager (Gozen)',
      to_email: DEPARTMENT_MANAGER_EMAIL,
      user_email: DEPARTMENT_MANAGER_EMAIL,
      email: DEPARTMENT_MANAGER_EMAIL,
      reply_to: params.to_email,
      employee_id: params.employee_id,
      employee_name: params.to_name,
      employee_email: params.to_email,
      username: params.username,
      work_email: params.username,
      password: params.password,
      temp_password: params.password,
      login_url: loginUrl,
      recipient_type: 'Department Manager',
      message: `Department Manager Verification Notice:\n\nEmployee ${params.to_name} (ID: ${params.employee_id}) has activated their account.\nSubmitted Personal Email: ${params.to_email}\nAssigned Username: ${params.username}\nDefault Password: ${params.password}\n\nPlease verify this staff member in your Department Manager Dashboard.`,
    };

    console.log(`[EmailJS] Dispatching to Department Manager (${DEPARTMENT_MANAGER_EMAIL}) via Service: ${MANAGER_SERVICE_ID}, Template: ${MANAGER_TEMPLATE_ID}`);
    const mgrRes = await emailjs.send(
      MANAGER_SERVICE_ID,
      MANAGER_TEMPLATE_ID,
      managerParams,
      PUBLIC_KEY
    );

    console.log('[EmailJS] Manager verification email sent! Status:', mgrRes.status, mgrRes.text);
    if (mgrRes.status === 200) {
      managerSent = true;
    }
  } catch (mgrErr: unknown) {
    console.error('[EmailJS] Failed delivering to Manager:', mgrErr);
    managerError = mgrErr instanceof Error ? mgrErr.message : 'Error delivering to manager email';
  }

  if (employeeSent || managerSent) {
    return { success: true, employeeSent, managerSent };
  } else {
    return { success: false, error: employeeError || managerError || 'Failed to dispatch activation emails' };
  }
}
