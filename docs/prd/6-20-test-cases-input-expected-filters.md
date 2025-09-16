# 6) 20 test cases (input → expected filters)
1. “create **images** from text, **free**” → `{primary_tag: 'text-to-image', pricing: 'free'}`
2. “**remove background** fast, **no signup**” → `{primary_tag: 'image-editing', no_signup: true}`
3. “**upscale** old photos on the **web**” → `{primary_tag: 'image-upscaling', platform: 'web'}`
4. “**talking avatar** from **text**, **free**” → `{primary_tag: 'talking-avatar', pricing: 'free'}`
5. “**generate video** from prompt, **Vietnamese**” → `{primary_tag: 'text-to-video', language: ['vi']}`
6. “**auto subtitles** for videos” → `{primary_tag: 'video-editing'}`
7. “**TTS** Vietnamese via **API**” → `{primary_tag: 'text-to-speech', platform: 'api', language: ['vi']}`
8. “**transcribe** English meetings” → `{primary_tag: 'speech-to-text', language: ['en']}`
9. “**clone voice** baritone male” → `{primary_tag: 'voice-cloning'}`
10. “**ask PDF** in Vietnamese” → `{primary_tag: 'document-qa', language: ['vi']}`
11. “**summarize** long article” → `{primary_tag: 'summarization'}`
12. “**translate** EN ↔ VI, **free**” → `{primary_tag: 'translation', pricing: 'free'}`
13. “**rewrite** a polite email” → `{primary_tag: 'paraphrase'}`
14. “**coding assistant** for JavaScript” → `{primary_tag: 'coding-assistant'}`
15. “write **SQL** from description” → `{primary_tag: 'sql-generation'}`
16. “**analyze CSV** quickly” → `{primary_tag: 'data-analysis'}`
17. “**generate slides** for pitch” → `{primary_tag: 'presentation'}`
18. “**agent** to automate web tasks” → `{primary_tag: 'agent-builder'}`
19. “**host models** via **API**” → `{primary_tag: 'model-hosting', platform: 'api'}`
20. “**fine-tune** a small model” → `{primary_tag: 'fine-tuning'}`
