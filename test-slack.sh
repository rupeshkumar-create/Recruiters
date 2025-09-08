#!/bin/bash

# Test script for Slack webhook integration
# This script tests the Slack webhook URL with a sample message

echo "🔧 Testing Slack Webhook Integration..."
echo ""

# Check if SLACK_WEBHOOK_URL is set in .env
if [ -f ".env" ]; then
    WEBHOOK_URL=$(grep "SLACK_WEBHOOK_URL=" .env | cut -d '=' -f2)
    
    if [[ "$WEBHOOK_URL" == *"YOUR_WORKSPACE_ID"* ]] || [[ -z "$WEBHOOK_URL" ]]; then
        echo "❌ Slack webhook URL not configured properly in .env file"
        echo ""
        echo "📝 To set up your Slack webhook:"
        echo "1. Go to https://api.slack.com/apps"
        echo "2. Create a new app or select existing one"
        echo "3. Go to 'Incoming Webhooks' and toggle it ON"
        echo "4. Click 'Add New Webhook to Workspace'"
        echo "5. Select your #sales-activity channel"
        echo "6. Copy the webhook URL and update SLACK_WEBHOOK_URL in .env"
        echo "7. Run this test again: ./test-slack.sh"
        exit 1
    fi
    
    echo "📡 Testing webhook URL: ${WEBHOOK_URL:0:50}..."
    echo ""
    
    # Test message payload
    TEST_MESSAGE='{
        "text": "🧪 Test Message from Tool Directory App",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*🧪 Slack Integration Test*\n\nThis is a test message to verify that Slack notifications are working correctly for new tool submissions."
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Tool:*\nTest Tool"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Category:*\nTesting"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Submitter:*\nTest User"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Status:*\n✅ Integration Working"
                    }
                ]
            }
        ]
    }'
    
    # Send test message
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-type: application/json" \
        --data "$TEST_MESSAGE" \
        "$WEBHOOK_URL")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ SUCCESS! Slack notification sent successfully!"
        echo "📱 Check your #sales-activity channel in Slack for the test message."
        echo ""
        echo "🎉 Your Slack integration is working correctly!"
    else
        echo "❌ FAILED! HTTP Status Code: $HTTP_CODE"
        echo "Response: $RESPONSE_BODY"
        echo ""
        echo "🔍 Please check:"
        echo "- Webhook URL is correct"
        echo "- Channel #sales-activity exists"
        echo "- App has permission to post to the channel"
    fi
else
    echo "❌ .env file not found"
    echo "Please make sure you have a .env file with SLACK_WEBHOOK_URL configured"
fi