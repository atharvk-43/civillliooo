import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendGrievanceConfirmation(
  email: string,
  grievanceId: string,
  title: string,
  category: string
) {
  try {
    await transporter.sendMail({
      from: process.env.GRIEVANCE_EMAIL,
      to: email,
      subject: `Grievance Registered - ID: ${grievanceId}`,
      html: `
        <h2>Your Grievance Has Been Registered</h2>
        <p>Dear Citizen,</p>
        <p>Thank you for submitting your grievance to Civilio. Here are your details:</p>
        <ul>
          <li><strong>Grievance ID:</strong> ${grievanceId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Category:</strong> ${category}</li>
          <li><strong>Status:</strong> Pending Initial Review</li>
        </ul>
        <p>Your grievance will be reviewed within 24 hours. You can track the progress of your grievance at any time by visiting your dashboard.</p>
        <p><strong>Expected Timeline:</strong></p>
        <ul>
          <li>Initial Review: 24 hours</li>
          <li>Assignment to Team: 2-3 days</li>
          <li>Resolution: 5-7 days</li>
        </ul>
        <p>Best regards,<br/>Civilio Citizen Services Team</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending grievance confirmation:', error);
    return { success: false, error };
  }
}

export async function sendGrievanceStatusUpdate(
  email: string,
  grievanceId: string,
  status: string,
  details: string
) {
  try {
    const statusMessages: Record<string, string> = {
      'pending': 'Your grievance is under initial review',
      'in-review': 'Your grievance is being reviewed by the department',
      'assigned': 'Your grievance has been assigned to a work team',
      'in-progress': 'Work has started on resolving your issue',
      'completed': 'Your grievance has been resolved',
      'closed': 'Your grievance has been closed',
    };

    await transporter.sendMail({
      from: process.env.GRIEVANCE_EMAIL,
      to: email,
      subject: `Status Update - Grievance ${grievanceId}`,
      html: `
        <h2>Grievance Status Update</h2>
        <p>Dear Citizen,</p>
        <p><strong>Grievance ID:</strong> ${grievanceId}</p>
        <p><strong>Current Status:</strong> ${status.toUpperCase()}</p>
        <p><strong>Details:</strong> ${details}</p>
        <p>Track your grievance progress on your Civilio dashboard anytime.</p>
        <p>Best regards,<br/>Civilio Citizen Services Team</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending status update:', error);
    return { success: false, error };
  }
}

export async function sendWorkOrderAssignment(
  workerEmail: string,
  workOrderId: string,
  title: string,
  location: string,
  priority: string,
  dueDate: Date
) {
  try {
    await transporter.sendMail({
      from: process.env.WORK_ORDER_EMAIL,
      to: workerEmail,
      subject: `New Work Order Assigned - ${workOrderId}`,
      html: `
        <h2>New Work Order Assigned</h2>
        <p>Dear Worker,</p>
        <p>A new work order has been assigned to you:</p>
        <ul>
          <li><strong>Work Order ID:</strong> ${workOrderId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Priority:</strong> ${priority}</li>
          <li><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</li>
        </ul>
        <p>Please log in to your Civilio worker dashboard to view full details and update the status.</p>
        <p><strong>Important:</strong> Complete this task or submit a detailed report within 7 days.</p>
        <p>Best regards,<br/>Civilio Work Management Team</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending work order assignment:', error);
    return { success: false, error };
  }
}

export async function sendWorkOrderCompletion(
  citizenEmail: string,
  grievanceId: string,
  title: string
) {
  try {
    await transporter.sendMail({
      from: process.env.WORK_ORDER_EMAIL,
      to: citizenEmail,
      subject: `Your Issue Has Been Resolved - ${grievanceId}`,
      html: `
        <h2>Your Issue Has Been Resolved</h2>
        <p>Dear Citizen,</p>
        <p>We're pleased to inform you that the work on your grievance has been completed:</p>
        <ul>
          <li><strong>Grievance ID:</strong> ${grievanceId}</li>
          <li><strong>Issue:</strong> ${title}</li>
          <li><strong>Status:</strong> RESOLVED</li>
        </ul>
        <p>Please visit the issue details page to verify the resolution and provide your feedback. Your feedback helps us improve our services.</p>
        <p>Best regards,<br/>Civilio Citizen Services Team</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending completion notification:', error);
    return { success: false, error };
  }
}

export async function sendOverdueWorkOrderAlert(
  supervisorEmail: string,
  workOrderId: string,
  title: string,
  daysOverdue: number
) {
  try {
    await transporter.sendMail({
      from: process.env.WORK_ORDER_EMAIL,
      to: supervisorEmail,
      subject: `ALERT: Overdue Work Order ${workOrderId}`,
      html: `
        <h2>Overdue Work Order Alert</h2>
        <p>Dear Supervisor,</p>
        <p>The following work order is overdue:</p>
        <ul>
          <li><strong>Work Order ID:</strong> ${workOrderId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Days Overdue:</strong> ${daysOverdue}</li>
        </ul>
        <p>Please follow up with the assigned worker immediately to ensure timely completion or request status updates.</p>
        <p>Best regards,<br/>Civilio Work Management System</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending overdue alert:', error);
    return { success: false, error };
  }
}
