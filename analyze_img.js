import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  try {
    // 1. Read the screenshot and convert to base64
    const imageBuffer = fs.readFileSync('/tmp/screenshot.png');
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    console.log(`Image loaded: ${(imageBuffer.length / 1024).toFixed(1)} KB (${base64Image.length} chars base64)`);

    // 2. Initialize the SDK
    const zai = await ZAI.create();

    // 3. Call createVision with the screenshot and prompt
    console.log('Calling VLM createVision...');
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Describe what's on this screen in detail. What website/app is this? What step is the user at?"
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    // 4. Print the response
    const messageContent = response.choices[0]?.message?.content;
    if (messageContent) {
      console.log('\n=== VLM RESPONSE ===\n');
      console.log(messageContent);
      console.log('\n=== END RESPONSE ===');
    } else {
      console.log('No content in response. Full response:');
      console.log(JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

main();
