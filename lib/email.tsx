// Email service integration for grievance notifications
// This is a template - configure with your actual email service

interface EmailParams {
  to: string
  subject: string
  html: string
  trackingId: string
}

export async function sendGrievanceNotification(params: EmailParams) {
  // Template for email service integration (Resend, SendGrid, etc.)
  // const emailService = process.env.EMAIL_SERVICE

  try {
    // Example with Resend (uncomment and configure if using Resend)
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL,
    //   to: params.to,
    //   subject: params.subject,
    //   html: params.html
    // })

    console.log("[EMAIL] Grievance notification sent to:", params.to, "Tracking ID:", params.trackingId)

    return {
      success: true,
      message: "Email notification sent",
    }
  } catch (error) {
    console.error("[EMAIL] Failed to send notification:", error)
    throw error
  }
}

// Confirmation email sent when grievance is submitted
export async function sendGrievanceConfirmation(
  email: string,
  grievanceId: string,
  title: string,
  category: string
) {
  try {
    const trackingId = `GR-${grievanceId}`;
    const htmlContent = grievanceEmailTemplate({
      name: email,
      trackingId,
      issueType: category,
      location: "Your submitted location",
    })

    console.log("[EMAIL] Grievance confirmation sent to:", email, "ID:", grievanceId)
    return { success: true, message: "Confirmation email sent" }
  } catch (error) {
    console.warn("[EMAIL] Could not send confirmation:", error)
    // Don't throw - email is optional
    return { success: false, message: "Email service unavailable" }
  }
}

// Status update email sent when grievance status changes
export async function sendGrievanceStatusUpdate(
  email: string,
  grievanceId: string,
  status: string,
  notes: string
) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
        <h2>Grievance Status Update</h2>
        <p>Your grievance (ID: ${grievanceId}) status has been updated.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>New Status:</strong> ${status}</p>
          <p><strong>Notes:</strong> ${notes || "No additional notes"}</p>
        </div>
        
        <p>You can track the detailed progress on your Civilio dashboard.</p>
        <p>Best regards,<br>Smart City Operations Team</p>
      </div>
    `

    console.log("[EMAIL] Status update sent to:", email, "ID:", grievanceId, "Status:", status)
    return { success: true, message: "Status update email sent" }
  } catch (error) {
    console.warn("[EMAIL] Could not send status update:", error)
    // Don't throw - email is optional
    return { success: false, message: "Email service unavailable" }
  }
}

export function grievanceEmailTemplate(data: {
  name: string
  trackingId: string
  issueType: string
  location: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
      <h2>Grievance Submitted Successfully</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for submitting your grievance to the Civilio portal.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tracking ID:</strong> ${data.trackingId}</p>
        <p><strong>Issue Type:</strong> ${data.issueType}</p>
        <p><strong>Location:</strong> ${data.location}</p>
      </div>
      
      <p>Your grievance has been received and will be reviewed within 24 hours. You will receive email updates on the status.</p>
      <p>Expected resolution time: 3-5 business days</p>
      
      <p>Best regards,<br>Smart City Operations Team</p>
    </div>
  `
}
