interface LoopsEmailData {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, any>;
}

interface SendSubmissionEmailData {
  name: string;
  email: string;
}

interface SendApprovalEmailData {
  name: string;
  email: string;
  profileUrl: string;
}

class EmailService {
  private apiKey: string;
  private baseUrl = 'https://app.loops.so/api/v1/transactional';

  constructor() {
    this.apiKey = process.env.LOOPS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('LOOPS_API_KEY not found in environment variables');
    }
  }

  private async sendEmail(data: LoopsEmailData): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Loops API key not configured');
      return false;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Loops API error:', response.status, errorText);
        return false;
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendSubmissionConfirmation(data: SendSubmissionEmailData): Promise<boolean> {
    return this.sendEmail({
      transactionalId: 'cmgroum0g8bawy90i0jck6fwt',
      email: data.email,
      dataVariables: {
        name: data.name,
      },
    });
  }

  async sendApprovalNotification(data: SendApprovalEmailData): Promise<boolean> {
    return this.sendEmail({
      transactionalId: 'cmgroy309bc3gy60is6dyrvdj',
      email: data.email,
      dataVariables: {
        name: data.name,
        profileUrl: data.profileUrl,
      },
    });
  }
}

export const emailService = new EmailService();