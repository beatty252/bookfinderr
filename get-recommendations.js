const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { genre, authors, books } = JSON.parse(event.body);

    // Build the prompt
    let prompt = `You are an expert book recommender. Please recommend exactly 5 books based on these preferences:

LOOKING FOR: ${genre}`;

    if (authors) {
      prompt += `\nFAVORITE AUTHORS: ${authors}`;
    }

    if (books) {
      prompt += `\nBOOKS THEY'VE LOVED: ${books}`;
    }

    prompt += `

Based on these preferences, recommend 5 books that would be perfect matches. For each book, provide:
1. Title (exact title)
2. Author (full author name)
3. Description (2-3 sentences explaining why this book fits their specific preferences and what makes it appealing)

Make sure to consider their favorite authors and loved books when making recommendations - look for similar themes, writing styles, or genres.

Format your response as a JSON array with this exact structure:
[
    {
        "title": "Book Title",
        "author": "Author Name", 
        "description": "Why this book perfectly matches their preferences..."
    }
]

Only recommend real, published books. Focus on quality matches over popular titles.`;

    // Call OpenAI API - KEY IS SAFE ON SERVER!
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const recommendations = JSON.parse(content);

    return {
      statusCode: 200,
      body: JSON.stringify(recommendations)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get recommendations' })
    };
  }
};