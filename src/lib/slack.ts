import { WebClient } from '@slack/web-api';

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export interface ToolSubmission {
  firstName: string;
  lastName: string;
  url: string;
  tagline?: string;
  description?: string;
  submitterEmail: string;
}

export async function sendToolSubmissionNotification(submission: ToolSubmission) {
  try {
    const message = {
      channel: 'sales-activity',
      text: '🚀 New Tool Submission Received!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚀 New Tool Submission'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Submitter:*\n${submission.firstName} ${submission.lastName}`
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${submission.submitterEmail}`
            },
            {
              type: 'mrkdwn',
              text: `*Tool URL:*\n<${submission.url}|${submission.url}>`
            },
            {
              type: 'mrkdwn',
              text: `*Tagline:*\n${submission.tagline || 'Not provided'}`
            }
          ]
        }
      ]
    };

    if (submission.description) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${submission.description}`
        }
      });
    }

    (message.blocks as any).push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Review Submission'
          },
          style: 'primary',
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin`
        }
      ]
    });

    const result = await slack.chat.postMessage(message);
    
    if (result.ok) {
      console.log('Slack notification sent successfully:', result.ts);
      return { success: true, messageId: result.ts };
    } else {
      console.error('Failed to send Slack notification:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Alternative webhook-based approach (simpler setup)
export async function sendWebhookNotification(submission: ToolSubmission) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('SLACK_WEBHOOK_URL not configured');
    }

    const payload = {
      channel: '#sales-activity',
      username: 'Tool Submission Bot',
      icon_emoji: ':rocket:',
      text: '🚀 New Tool Submission Received!',
      attachments: [
        {
          color: 'good',
          fields: [
            {
              title: 'Submitter',
              value: `${submission.firstName} ${submission.lastName}`,
              short: true
            },
            {
              title: 'Email',
              value: submission.submitterEmail,
              short: true
            },
            {
              title: 'Tool URL',
              value: submission.url,
              short: false
            },
            {
              title: 'Tagline',
              value: submission.tagline || 'Not provided',
              short: false
            }
          ],
          footer: 'AI Staffing Tools Directory',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    if (submission.description) {
      payload.attachments[0].fields.push({
        title: 'Description',
        value: submission.description,
        short: false
      });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Slack webhook notification sent successfully');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('Failed to send Slack webhook notification:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Error sending Slack webhook notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}