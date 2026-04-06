/**
 * 通义千问 VL 图像理解 API - Vercel Serverless Function
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { image, apiKey } = req.body || {};

  if (!image) {
    return res.status(400).json({ error: '缺少图片数据' });
  }

  // 优先用客户端传入的 key，其次用环境变量
  const key = apiKey || process.env.DASHSCOPE_API_KEY;

  if (!key) {
    return res.status(500).json({ error: '未配置 API Key' });
  }

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
                },
              },
              {
                type: 'text',
                text: `你是一个专为3-8岁儿童讲故事的老师。请看这张绘本图片，用温暖亲切的语气：
1. 用一段简短的儿童故事描述这张图片（3-5句话，适合朗读）
2. 列出图片中1-2个适合教小朋友的英文单词（用中文解释含义）
3. 如果图片中有适合讲成语的内容，提炼一个相关成语并简单解释

请直接返回JSON，不要有markdown代码块：
{
  "story": "故事内容",
  "words": [{"word": "英文单词", "meaning": "中文含义", "phonetic": "音标"}],
  "idiom": {"idiom": "成语", "meaning": "解释", "story": "成语小故事"}
}`,
              },
            ],
          },
        ],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DashScope error:', response.status, errText);
      return res.status(502).json({ error: `API 返回错误: ${response.status}`, detail: errText });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // 解析 JSON
    try {
      const jsonStr = content.replace(/```json\n?|```\n?/g, '').trim();
      const result = JSON.parse(jsonStr);
      return res.json(result);
    } catch {
      // 解析失败返回原文
      return res.json({
        story: content,
        words: [],
        idiom: null,
        raw: true,
      });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message });
  }
}
