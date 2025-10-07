interface NotificationPayload {
  customer_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  lead_id: number;
  lead_name: string;
  message: string;
  type: 'lead_created' | 'lead_completed' | 'lead_updated';
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_types: {
    lead_created: boolean;
    lead_completed: boolean;
    lead_updated: boolean;
  };
}

class NotificationService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.erpsamuiaksorn.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Send notification when a new lead is created
   */
  async notifyLeadCreated(payload: {
    customer_id: number;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    lead_id: number;
    lead_name: string;
  }): Promise<boolean> {
    try {
      const message = `สวัสดี ${payload.customer_name} ✨
      
ใบสั่งงาน "${payload.lead_name}" ได้รับการสร้างเรียบร้อยแล้ว
เลขที่งาน: ${payload.lead_id}

เราจะดำเนินการและแจ้งให้ทราบความคืบหน้าในขั้นตอนถัดไป

ขอบคุณที่ไว้วางใจใช้บริการของเรา 🙏`;

      return await this.sendNotification({
        ...payload,
        message,
        type: 'lead_created',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error sending lead created notification:', error);
      return false;
    }
  }

  /**
   * Send notification when a lead is completed
   */
  async notifyLeadCompleted(payload: {
    customer_id: number;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    lead_id: number;
    lead_name: string;
  }): Promise<boolean> {
    try {
      const message = `สวัสดี ${payload.customer_name} 🎉
      
ใบสั่งงาน "${payload.lead_name}" เสร็จสมบูรณ์แล้ว!
เลขที่งาน: ${payload.lead_id}

งานของคุณพร้อมรับแล้ว
กรุณาติดต่อเราเพื่อจัดส่งหรือรับงาน

ขอบคุณที่ไว้วางใจใช้บริการของเรา 🙏`;

      return await this.sendNotification({
        ...payload,
        message,
        type: 'lead_completed',
        priority: 'high'
      });
    } catch (error) {
      console.error('Error sending lead completed notification:', error);
      return false;
    }
  }

  /**
   * Send notification when a lead status is updated
   */
  async notifyLeadUpdated(payload: {
    customer_id: number;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    lead_id: number;
    lead_name: string;
    new_status: string;
  }): Promise<boolean> {
    try {
      const message = `สวัสดี ${payload.customer_name} 📋
      
ใบสั่งงาน "${payload.lead_name}" มีการอัปเดตสถานะ
เลขที่งาน: ${payload.lead_id}
สถานะใหม่: ${payload.new_status}

ขอบคุณที่ไว้วางใจใช้บริการของเรา 🙏`;

      return await this.sendNotification({
        ...payload,
        message,
        type: 'lead_updated',
        priority: 'low'
      });
    } catch (error) {
      console.error('Error sending lead updated notification:', error);
      return false;
    }
  }

  /**
   * Core notification sending method
   */
  private async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // Get customer notification preferences
      const preferences = await this.getNotificationPreferences(payload.customer_id);
      
      // Check if notifications are enabled for this type
      if (!preferences.notification_types[payload.type]) {
        console.log(`Notification type ${payload.type} disabled for customer ${payload.customer_id}`);
        return true;
      }

      const promises: Promise<boolean>[] = [];

      // Send email notification
      if (preferences.email_notifications && payload.customer_email) {
        promises.push(this.sendEmailNotification({
          to: payload.customer_email,
          subject: this.getEmailSubject(payload.type, payload.lead_name),
          message: payload.message,
          lead_id: payload.lead_id,
          customer_name: payload.customer_name
        }));
      }

      // Send SMS notification
      if (preferences.sms_notifications && payload.customer_phone) {
        promises.push(this.sendSMSNotification({
          to: payload.customer_phone,
          message: payload.message,
          lead_id: payload.lead_id
        }));
      }

      // Wait for all notifications to complete
      const results = await Promise.all(promises);
      return results.some(result => result); // Return true if at least one succeeded

    } catch (error) {
      console.error('Error in sendNotification:', error);
      return false;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(payload: {
    to: string;
    subject: string;
    message: string;
    lead_id: number;
    customer_name: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: payload.to,
          subject: payload.subject,
          html: this.formatEmailHTML(payload.message, payload.lead_id, payload.customer_name),
          text: payload.message
        })
      });

      if (!response.ok) {
        console.error('Email notification failed:', response.statusText);
        return false;
      }

      console.log(`Email sent successfully to ${payload.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(payload: {
    to: string;
    message: string;
    lead_id: number;
  }): Promise<boolean> {
    try {
      // Format phone number for SMS
      const phone = payload.to.replace(/\D/g, ''); // Remove non-digits
      
      const response = await fetch(`${this.baseUrl}/api/notifications/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: payload.message
        })
      });

      if (!response.ok) {
        console.error('SMS notification failed:', response.statusText);
        return false;
      }

      console.log(`SMS sent successfully to ${payload.to}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  /**
   * Get customer notification preferences
   */
  private async getNotificationPreferences(customer_id: number): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/api/res.partner/${customer_id}/notification_preferences`);
      
      if (response.ok) {
        const data = await response.json();
        return data.preferences || this.getDefaultPreferences();
      } else {
        return this.getDefaultPreferences();
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update customer notification preferences
   */
  async updateNotificationPreferences(customer_id: number, preferences: NotificationPreferences): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/res.partner/${customer_id}/notification_preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences })
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      email_notifications: true,
      sms_notifications: true,
      notification_types: {
        lead_created: true,
        lead_completed: true,
        lead_updated: false
      }
    };
  }

  /**
   * Get email subject based on notification type
   */
  private getEmailSubject(type: string, lead_name: string): string {
    switch (type) {
      case 'lead_created':
        return `✅ ใบสั่งงานใหม่: ${lead_name}`;
      case 'lead_completed':
        return `🎉 งานเสร็จแล้ว: ${lead_name}`;
      case 'lead_updated':
        return `📋 อัปเดตสถานะ: ${lead_name}`;
      default:
        return `📢 แจ้งเตือน: ${lead_name}`;
    }
  }

  /**
   * Format email HTML content
   */
  private formatEmailHTML(message: string, lead_id: number, customer_name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 12px; }
          .lead-info { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 บริการพิมพ์สมุยอักษร</h1>
          </div>
          <div class="content">
            <h2>สวัสดี ${customer_name}! 👋</h2>
            <div style="white-space: pre-line;">${message}</div>
            
            <div class="lead-info">
              <strong>📋 เลขที่งาน:</strong> ${lead_id}<br>
              <strong>🌐 ดูรายละเอียด:</strong> 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/crm/${lead_id.toString().split('')[0] || '1'}" class="button">
                เข้าสู่ระบบลูกค้า
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 บริการพิมพ์สมุยอักษร | ติดต่อเรา: info@erpsamuiaksorn.com</p>
            <p>หากไม่ต้องการรับอีเมลแจ้งเตือน <a href="#">คลิกที่นี่</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default NotificationService;
export type { NotificationPayload, NotificationPreferences };