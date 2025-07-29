export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: { authorization: apiKey },
    body: req.body,
  });
  const uploadData = await uploadRes.json();
  const audio_url = uploadData.upload_url;

  const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ audio_url })
  });
  const transcriptData = await transcriptRes.json();

  const transcriptId = transcriptData.id;
  let completed = false;
  let transcriptText = '';

  while (!completed) {
    const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { authorization: apiKey }
    });
    const pollingData = await pollingRes.json();
    if (pollingData.status === 'completed') {
      transcriptText = pollingData.text;
      completed = true;
    } else if (pollingData.status === 'error') {
      return res.status(500).json({ error: pollingData.error });
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return res.status(200).json({ text: transcriptText });
}
