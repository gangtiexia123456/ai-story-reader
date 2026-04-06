import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

// ===== 英文单词数据库（备用，当API不可用时使用）=====
const WORD_DATABASE = {
  animal: [
    { word: 'elephant', phonetic: '/ˈelɪfənt/', meaning: '大象', example: 'The elephant has a long trunk.' },
    { word: 'giraffe', phonetic: '/dʒəˈrɑːf/', meaning: '长颈鹿', example: 'The giraffe eats leaves from tall trees.' },
    { word: 'monkey', phonetic: '/ˈmʌŋki/', meaning: '猴子', example: 'The monkey swings from tree to tree.' },
    { word: 'lion', phonetic: '/ˈlaɪən/', meaning: '狮子', example: 'The lion is the king of the jungle.' },
    { word: 'tiger', phonetic: '/ˈtaɪɡər/', meaning: '老虎', example: 'The tiger has beautiful orange stripes.' },
    { word: 'bear', phonetic: '/beər/', meaning: '熊', example: 'The bear is sleeping in the cave.' },
    { word: 'rabbit', phonetic: '/ˈræbɪt/', meaning: '兔子', example: 'The rabbit hops very fast.' },
    { word: 'panda', phonetic: '/ˈpændə/', meaning: '熊猫', example: 'The panda loves eating bamboo.' },
    { word: 'dog', phonetic: '/dɔːɡ/', meaning: '狗', example: 'The dog wags its tail happily.' },
    { word: 'cat', phonetic: '/kæt/', meaning: '猫', example: 'The cat likes to sleep in the sun.' },
    { word: 'bird', phonetic: '/bɜːrd/', meaning: '鸟', example: 'The bird sings in the morning.' },
    { word: 'fish', phonetic: '/fɪʃ/', meaning: '鱼', example: 'The fish swims in the water.' },
    { word: 'duck', phonetic: '/dʌk/', meaning: '鸭子', example: 'The duck swims in the pond.' },
    { word: 'frog', phonetic: '/frɒɡ/', meaning: '青蛙', example: 'The frog can jump very high.' },
    { word: 'horse', phonetic: '/hɔːrs/', meaning: '马', example: 'The horse runs very fast.' },
  ],
  nature: [
    { word: 'flower', phonetic: '/ˈflaʊər/', meaning: '花', example: 'The flower smells very sweet.' },
    { word: 'tree', phonetic: '/triː/', meaning: '树', example: 'Birds live in the tree.' },
    { word: 'sun', phonetic: '/sʌn/', meaning: '太阳', example: 'The sun rises in the east.' },
    { word: 'moon', phonetic: '/muːn/', meaning: '月亮', example: 'The moon shines at night.' },
    { word: 'star', phonetic: '/stɑːr/', meaning: '星星', example: 'The stars twinkle in the sky.' },
    { word: 'rain', phonetic: '/reɪn/', meaning: '雨', example: 'The rain makes the flowers grow.' },
    { word: 'cloud', phonetic: '/klaʊd/', meaning: '云', example: 'The cloud looks like cotton.' },
    { word: 'water', phonetic: '/ˈwɔːtər/', meaning: '水', example: 'We need to drink water every day.' },
  ],
  color: [
    { word: 'red', phonetic: '/red/', meaning: '红色', example: 'The apple is red.' },
    { word: 'blue', phonetic: '/bluː/', meaning: '蓝色', example: 'The sky is blue.' },
    { word: 'yellow', phonetic: '/ˈjeloʊ/', meaning: '黄色', example: 'The sun is yellow.' },
    { word: 'green', phonetic: '/ɡriːn/', meaning: '绿色', example: 'Grass is green.' },
    { word: 'orange', phonetic: '/ˈɔːrɪndʒ/', meaning: '橙色', example: 'The orange is sweet.' },
    { word: 'purple', phonetic: '/ˈpɜːrpəl/', meaning: '紫色', example: 'Grapes can be purple.' },
    { word: 'pink', phonetic: '/pɪŋk/', meaning: '粉色', example: 'The flower is pink.' },
    { word: 'white', phonetic: '/waɪt/', meaning: '白色', example: 'Snow is white.' },
  ],
  family: [
    { word: 'mother', phonetic: '/ˈmʌðər/', meaning: '妈妈', example: 'Mother loves me very much.' },
    { word: 'father', phonetic: '/ˈfɑːðər/', meaning: '爸爸', example: 'Father reads me stories.' },
    { word: 'baby', phonetic: '/ˈbeɪbi/', meaning: '宝宝', example: 'The baby is sleeping.' },
    { word: 'friend', phonetic: '/frend/', meaning: '朋友', example: 'My friend and I play together.' },
    { word: 'happy', phonetic: '/ˈhæpi/', meaning: '开心的', example: 'I am happy today.' },
    { word: 'love', phonetic: '/lʌv/', meaning: '爱', example: 'I love my family.' },
  ],
  action: [
    { word: 'jump', phonetic: '/dʒʌmp/', meaning: '跳', example: 'The frog can jump.' },
    { word: 'run', phonetic: '/rʌn/', meaning: '跑', example: 'I run in the park.' },
    { word: 'eat', phonetic: '/iːt/', meaning: '吃', example: 'The bunny eats carrots.' },
    { word: 'sleep', phonetic: '/sliːp/', meaning: '睡觉', example: 'The baby bear is sleeping.' },
    { word: 'fly', phonetic: '/flaɪ/', meaning: '飞', example: 'Birds can fly.' },
    { word: 'swim', phonetic: '/swɪm/', meaning: '游泳', example: 'Fish can swim.' },
    { word: 'sing', phonetic: '/sɪŋ/', meaning: '唱歌', example: 'The bird likes to sing.' },
    { word: 'dance', phonetic: '/dæns/', meaning: '跳舞', example: 'The children love to dance.' },
  ],
  food: [
    { word: 'apple', phonetic: '/ˈæpəl/', meaning: '苹果', example: 'An apple a day keeps doctor away.' },
    { word: 'banana', phonetic: '/bəˈnɑːnə/', meaning: '香蕉', example: 'The monkey loves banana.' },
    { word: 'carrot', phonetic: '/ˈkærət/', meaning: '胡萝卜', example: 'The rabbit eats carrot.' },
    { word: 'bread', phonetic: '/bred/', meaning: '面包', example: 'I eat bread for breakfast.' },
    { word: 'milk', phonetic: '/mɪlk/', meaning: '牛奶', example: 'Kids need to drink milk.' },
    { word: 'water', phonetic: '/ˈwɔːtər/', meaning: '水', example: 'We need to drink water.' },
  ],
};

// ===== 成语数据库（备用）=====
const IDIOM_DATABASE = [
  { idiom: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: '比喻死守狭隘经验，不知变通', story: '农夫守在树桩旁等兔子撞死，结果田地都荒废了。' },
  { idiom: '亡羊补牢', pinyin: 'wáng yáng bǔ láo', meaning: '出了问题及时补救，还不算晚', story: '丢了羊才修羊圈，从此再没丢过羊。' },
  { idiom: '画蛇添足', pinyin: 'huà shé tiān zú', meaning: '做了多余的事，反而把事情弄糟', story: '画蛇最快的人给蛇添了脚，反而输了比赛。' },
  { idiom: '对牛弹琴', pinyin: 'duì niú tán qín', meaning: '对不懂的人讲道理，白费口舌', story: '有人对牛弹最优美的曲子，牛只顾吃草。' },
  { idiom: '掩耳盗铃', pinyin: 'yǎn ěr dào líng', meaning: '自己欺骗自己', story: '捂住耳朵去偷铃铛，以为自己听不见别人也听不见。' },
  { idiom: '狐假虎威', pinyin: 'hú jiǎ hǔ wēi', meaning: '依仗别人的势力来欺压人', story: '狐狸借着老虎的威风，动物们怕的是老虎不是狐狸。' },
  { idiom: '刻舟求剑', pinyin: 'kè zhōu qiú jiàn', meaning: '办事刻板，不知变通', story: '在船舷刻记号找剑，船走了剑却没动。' },
  { idiom: '叶公好龙', pinyin: 'shè gōng hào lóng', meaning: '表面上喜欢，实际不是真的喜欢', story: '叶公喜欢画上的龙，真龙来了却吓跑了。' },
  { idiom: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: '比喻见识短浅的人', story: '井底的青蛙以为天只有井口那么大。' },
  { idiom: '盲人摸象', pinyin: 'máng rén mō xiàng', meaning: '看问题以偏概全', story: '盲人摸象各执己见，其实只摸了象的一部分。' },
  { idiom: '揠苗助长', pinyin: 'yà miáo zhù zhǎng', meaning: '急于求成，反而坏事', story: '把禾苗往上拔想让它们长快，结果禾苗都枯死了。' },
  { idiom: '杯水车薪', pinyin: 'bēi shuǐ chē xīn', meaning: '力量太小，无济于事', story: '用一杯水去救一车着火的柴薪，当然救不了。' },
];

// ===== AI 图像分析器（通义千问 VL）=====
class AIAnalyzer {
  constructor(apiEndpoint = '/api/story') {
    this.apiEndpoint = apiEndpoint;
    this.lastCall = 0;
    this.minInterval = 2000; // 最少2秒间隔，避免API超额
    this.apiKey = localStorage.getItem('qwen_api_key') || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('qwen_api_key', key);
  }

  getHasApiKey() {
    return !!this.apiKey;
  }

  async analyze(imageData, options = {}) {
    const now = Date.now();

    // 节流
    if (now - this.lastCall < this.minInterval) {
      return null;
    }
    this.lastCall = now;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
        },
        body: JSON.stringify({
          model: 'qwen-vl-plus',
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageData } },
              { type: 'text', text: '请看这张绘本图片，用温暖的语气给3-8岁小朋友讲一个3-5句的简短故事，并提取2-3个简单英文单词（如物品、颜色、动作等，每词配中文释义）。' },
            ],
          }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || 'API请求失败: ' + response.status);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      // 解析故事 - 找第一段非空非标记文字
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      let story = '';
      for (const line of lines) {
        if (!line.match(/^[单词成语的?:：]/) && line.length > 5) {
          story = line;
          break;
        }
      }

      // 解析英文单词
      const words = [];
      const wordMatches = [...text.matchAll(/([a-zA-Z]{2,20})\s*[/,]\s*([^\n。！？]+)/g)];
      for (const m of wordMatches) {
        words.push({ word: m[1], phonetic: '/' + m[1] + '/', meaning: m[2].trim() });
      }

      return {
        story: story || '这幅画真有意思！',
        words: words.slice(0, 3),
        idiom: null,
      };
    } catch (err) {
      console.error('AI 分析失败:', err.message);
      return null;
    }
  }
}

// ===== 演示模式分析器（无API时使用）=====
class DemoAnalyzer {
  constructor() {
    this.lastScene = null;
    this.consecutiveSame = 0;
    this.storyIndex = 0;
    this.lastUpdate = 0;
    this.sentences = [
      '看！画面里有什么呢？',
      '小动物们在做什么呀？',
      '这个故事真有趣！',
      '我们来学几个新单词吧！',
      '你知道这个成语吗？',
      '继续看，画面变了！',
      '哇，好精彩的内容！',
      '跟着我一起看！',
    ];
  }

  async analyze() {
    const now = Date.now();
    if (now - this.lastUpdate < 2000) return null;

    const scenes = ['animal', 'nature', 'color', 'family'];
    const scene = scenes[Math.floor(Math.random() * scenes.length)];

    if (scene === this.lastScene) {
      this.consecutiveSame++;
    } else {
      this.consecutiveSame = 0;
      this.lastScene = scene;
      this.storyIndex = 0;
    }

    if (this.consecutiveSame === 0 || this.consecutiveSame % 4 === 0) {
      this.lastUpdate = now;
      const story = this.generateStory(scene, this.storyIndex);
      const words = this.selectWords(scene);
      const idiom = this.selectIdiom();
      const narration = this.sentences[Math.floor(Math.random() * this.sentences.length)];
      this.storyIndex++;
      return { story, words, idiom, narration, scene };
    }
    return null;
  }

  generateStory(scene, index) {
    const stories = {
      animal: [
        '小动物们正在森林里快乐地玩耍。小兔子在草地上跳来跳去，真可爱！小鸟在树枝上唱着动听的歌。',
        '瞧，小猫咪追着蝴蝶跑，好开心呀！小狗狗摇着尾巴，向你问好！',
        '大象用长鼻子喷水洗澡呢！小鸭子排着队在池塘里游泳。',
        '长颈鹿在吃高高树上的叶子。小鸟们在树枝上建了温暖的窝。',
      ],
      nature: [
        '天空蓝蓝的，白云像棉花糖一样。太阳公公笑眯眯地看着大家。',
        '花朵散发着淡淡的香味。小草绿绿的，踩上去软软的。',
        '小河哗哗地流着，水很清澈。彩虹出现在天边，七种颜色真漂亮！',
        '树叶在风中沙沙作响。星星眨着眼睛，一闪一闪的。',
      ],
      color: [
        '红色的苹果真好看！蓝蓝的天空让人心情愉快。',
        '黄色的太阳照亮了世界。绿色的小草铺满了大地。',
        '橙色的橘子甜甜的，真好吃！紫色的葡萄一串串挂在藤上。',
        '粉色的花朵像小朋友的脸蛋。白色的云朵飘在天上。',
      ],
      family: [
        '一家人在一起真幸福！妈妈抱着宝宝，轻轻地摇晃。',
        '爸爸带着小朋友一起玩耍。朋友们手拉手，做游戏真开心。',
        '大家一起分享食物，很快乐。宝宝学会了新本领，真棒！',
        '小动物们互相帮助，真有爱！每个人都笑眯眯的，充满爱。',
      ],
    };
    const sceneStories = stories[scene] || stories.animal;
    return sceneStories[index % sceneStories.length];
  }

  selectWords(scene) {
    const category = WORD_DATABASE[scene] || WORD_DATABASE.animal;
    const shuffled = [...category].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

  selectIdiom() {
    return IDIOM_DATABASE[Math.floor(Math.random() * IDIOM_DATABASE.length)];
  }
}

// ===== 语音朗读 ======
class TTS {
  constructor() {
    this.synth = window.speechSynthesis;
    this.queue = [];
    this._voices = [];
    // Force load voices
    this._loadVoices();
    this.synth.onvoiceschanged = () => {
      this._loadVoices();
    };
  }

  _loadVoices() {
    try {
      this._voices = this.synth.getVoices() || [];
    } catch(e) {
      this._voices = [];
    }
  }

  _getVoice(lang) {
    const voices = this._voices.length > 0 ? this._voices : (this.synth.getVoices() || []);
    let langVoices = voices.filter(v => v.lang.includes(lang));
    if (langVoices.length === 0) langVoices = voices;
    
    // Female voice preference
    const femaleNames = lang === 'zh' 
      ? ['female', 'girl', 'woman', '女', 'Ting', 'Mei', 'Xiao', 'Ya', 'Lili', 'Huihui', 'Kangkang', 'Moyan']
      : ['female', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'fei'];
    
    return langVoices.find(v => femaleNames.some(n => v.name.toLowerCase().includes(n)))
           || langVoices.find(v => v.lang.includes(lang === 'zh' ? 'CN' : 'US'))
           || langVoices[0];
  }

  speak(text, priority = false) {
    if (priority) {
      this.synth.cancel();
      this.queue = [];
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    const voice = this._getVoice('zh');
    if (voice) utterance.voice = voice;
    this.synth.speak(utterance);
  }

  speakEnglish(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    const voice = this._getVoice('en');
    if (voice) utterance.voice = voice;
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }
}

// ===== 主组件 ======
function App() {
  const [isLive, setIsLive] = useState(false);
  const [currentStory, setCurrentStory] = useState('');
  const [currentWords, setCurrentWords] = useState([]);
  const [currentIdiom, setCurrentIdiom] = useState(null);
  const [narration, setNarration] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [enableEnglish, setEnableEnglish] = useState(true);
  const [enableIdiom, setEnableIdiom] = useState(true);
  const [stats, setStats] = useState({ sentences: 0, words: 0, idioms: 0 });
  const [apiKey, setApiKey] = useState(localStorage.getItem('qwen_api_key') || 'sk-815b770efa3a4ee698bd49f9b96ae069');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analyzerRef = useRef(null);
  const demoAnalyzerRef = useRef(null);
  const ttsRef = useRef(null);
  const detectIntervalRef = useRef(null);

  // 初始化
  useEffect(() => {
    // 等语音引擎加载
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };

    // 初始化分析器
    analyzerRef.current = new AIAnalyzer();
    demoAnalyzerRef.current = new DemoAnalyzer();
    ttsRef.current = new TTS();

    // 加载历史记录
    const saved = localStorage.getItem('story_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      stopCamera();
      if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    };
  }, []);

  // API Key 变化时更新分析器
  useEffect(() => {
    if (apiKey && analyzerRef.current) {
      analyzerRef.current.setApiKey(apiKey);
      setIsDemoMode(false);
    } else {
      setIsDemoMode(true);
    }
  }, [apiKey]);

  // Camera stream attachment - runs after isLive changes and DOM updates
  useEffect(() => {
    if (isLive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
      detectIntervalRef.current = setInterval(() => captureAndAnalyze(), 1500);
    }
    return () => {
      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
        detectIntervalRef.current = null;
      }
    };
  }, [isLive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
    setIsLive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      // Set live state first, srcObject will be set by useEffect
      setIsLive(true);
    } catch (err) {
      alert('无法访问摄像头，请允许摄像头权限！错误：' + err.message);
    }
  };

  const captureAndAnalyze = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video.readyState < 2) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 压缩到合适大小
    const imageData = canvas.toDataURL('image/jpeg', 0.6);
    const sizeKB = imageData.length * 0.75 / 1024;

    if (sizeKB > 900) {
      // 太大，继续压缩
      return captureAndAnalyzeJPEG(0.4);
    }

    setIsAnalyzing(true);

    let result;
    if (isDemoMode || !apiKey) {
      result = await demoAnalyzerRef.current.analyze();
    } else {
      result = await analyzerRef.current.analyze(imageData);
    }

    setIsAnalyzing(false);

    if (result) {
      updateStory(result);
    }
  };

  const captureAndAnalyzeJPEG = async (quality) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', quality);

    setIsAnalyzing(true);

    let result;
    if (isDemoMode || !apiKey) {
      result = await demoAnalyzerRef.current.analyze();
    } else {
      result = await analyzerRef.current.analyze(imageData);
    }

    setIsAnalyzing(false);

    if (result) {
      updateStory(result);
    }
  };

  const updateStory = (result) => {
    const { story, words, idiom, narration } = result;

    // 显示故事
    setCurrentStory(story);
    setNarration(narration || '');

    // 朗读故事
    if (ttsRef.current) {
      ttsRef.current.stop();
      ttsRef.current.speak(story, true);
      setIsSpeaking(true);

      setTimeout(() => {
        if (words && words.length > 0 && enableEnglish) {
          words.forEach((w, i) => {
            setTimeout(() => {
              if (ttsRef.current) {
                ttsRef.current.speakEnglish(`${w.word}，${w.meaning}`);
              }
            }, i * 2000);
          });
        }
      }, story.length * 200 + 500);
    }

    // 更新单词
    if (words && words.length > 0) {
      setCurrentWords(words);
    }

    // 更新成语
    if (idiom && enableIdiom) {
      setCurrentIdiom(idiom);
      setTimeout(() => {
        if (ttsRef.current) {
          ttsRef.current.speak(`成语时间！${idiom.idiom}，${idiom.meaning}。${idiom.story}`);
        }
      }, story.length * 200 + 1500);
    }

    // 更新统计
    setStats(s => ({
      sentences: s.sentences + 1,
      words: s.words + (words?.length || 0),
      idioms: s.idioms + (idiom ? 1 : 0),
    }));

    // 保存历史
    const newHistory = [
      { id: Date.now(), story, time: new Date().toLocaleTimeString(), words, idiom },
      ...history,
    ].slice(0, 20);

    setHistory(newHistory);
    localStorage.setItem('story_history', JSON.stringify(newHistory));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setUploadedImage(dataUrl);

      // 转为 base64（压缩）
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxW = 1024;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);

        setIsAnalyzing(true);
        let result;
        if (isDemoMode || !apiKey) {
          result = await demoAnalyzerRef.current.analyze();
        } else {
          result = await analyzerRef.current.analyze(compressed);
        }
        setIsAnalyzing(false);

        if (result) {
          updateStory(result);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApiKeySave = () => {
    if (apiKey) {
      localStorage.setItem('qwen_api_key', apiKey);
      analyzerRef.current?.setApiKey(apiKey);
      setIsDemoMode(false);
      setShowApiKeyInput(false);
      alert('✅ API Key 已保存，现在使用真实的 AI 图像识别！');
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('qwen_api_key');
    setIsDemoMode(true);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>📖 AI 陪娃读绘本</h1>
        <div className="mode-indicator">
          {isDemoMode ? (
            <span className="demo-badge">🎭 演示模式</span>
          ) : (
            <span className="ai-badge">🤖 AI 识别模式</span>
          )}
        </div>
      </div>

      {/* API Key 设置 */}
      <div className="api-key-section">
        <button className="settings-btn" onClick={() => setShowApiKeyInput(!showApiKeyInput)}>
          {isDemoMode ? '⚙️ 设置 AI API Key' : '✅ AI 已连接'}
        </button>
        {showApiKeyInput && (
          <div className="api-key-form">
            <p>输入通义千问 VL API Key（免费额度很大）：</p>
            <input
              type="password"
              placeholder="sk-xxxxxxxx"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <div className="api-key-hint">
              申请地址：<a href="https://dashscope.console.aliyun.com" target="_blank" rel="noreferrer">dashscope.console.aliyun.com</a>
            </div>
            {apiKey && (
              <button className="save-btn" onClick={handleApiKeySave}>保存并启用 AI</button>
            )}
            {!isDemoMode && (
              <button className="clear-btn" onClick={clearApiKey}>切换回演示模式</button>
            )}
          </div>
        )}
      </div>

      {/* 主显示区 */}
      <div className="main-display">
        <div className="camera-view">
          <video
            ref={videoRef}
            className="camera-video"
            style={{ display: isLive ? 'block' : 'none' }}
            playsInline
            autoPlay
            muted
          />
          {uploadedImage && !isLive && (
            <img src={uploadedImage} className="camera-video" alt="已上传图片" />
          )}
          {!isLive && !uploadedImage && (
            <div className="camera-placeholder">
              📷 打开摄像头对准绘本，或上传图片
            </div>
          )}
          {isAnalyzing && <div className="analyzing-overlay">🔍 AI 识别中...</div>}
          <canvas ref={canvasRef} className="capture-canvas" />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="camera-controls">
        {!isLive ? (
          <>
            <button className="start-btn" onClick={startCamera}>
              📷 打开摄像头读绘本
            </button>
            <label className="upload-btn">
              📁 上传图片
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <button className="test-sound-btn" onClick={() => { if (ttsRef.current) ttsRef.current.speak('你好，我是你的AI绘本助手，正在为你讲故事！'); }}>
              🔊 测试声音
            </button>
          </>
        ) : (
          <button className="stop-btn" onClick={stopCamera}>
            ⏹️ 停止识别
          </button>
        )}
      </div>

      {/* 故事显示 */}
      {currentStory && (
        <div className="story-card">
          <div className="story-label">📖 故事</div>
          <p className="story-text">{currentStory}</p>
        </div>
      )}

      {/* 英文单词 */}
      {enableEnglish && currentWords.length > 0 && (
        <div className="words-section">
          <div className="section-label">🇬🇧 学单词</div>
          <div className="words-grid">
            {currentWords.map((w, i) => (
              <div key={i} className="word-card">
                <div className="word">{w.word}</div>
                {w.phonetic && <div className="phonetic">{w.phonetic}</div>}
                <div className="meaning">📖 {w.meaning}</div>
                {w.example && <div className="example">💬 {w.example}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 成语 */}
      {enableIdiom && currentIdiom && (
        <div className="idiom-card">
          <div className="section-label">🈴 成语</div>
          <div className="idiom-title">{currentIdiom.idiom}</div>
          {currentIdiom.pinyin && <div className="idiom-pinyin">{currentIdiom.pinyin}</div>}
          <div className="idiom-meaning">{currentIdiom.meaning}</div>
          {currentIdiom.story && <div className="idiom-story">📖 {currentIdiom.story}</div>}
        </div>
      )}

      {/* 设置 */}
      <div className="settings-section">
        <div className="settings-row">
          <span>🇬🇧 英文单词教学</span>
          <label className="toggle">
            <input type="checkbox" checked={enableEnglish} onChange={e => setEnableEnglish(e.target.checked)} />
            <span></span>
          </label>
        </div>
        <div className="settings-row">
          <span>🈴 成语故事</span>
          <label className="toggle">
            <input type="checkbox" checked={enableIdiom} onChange={e => setEnableIdiom(e.target.checked)} />
            <span></span>
          </label>
        </div>
      </div>

      {/* 统计 */}
      <div className="stats-bar">
        <span>📚 已读 {stats.sentences} 句</span>
        <span>🇬🇧 {stats.words} 单词</span>
        <span>🈴 {stats.idioms} 成语</span>
      </div>

      {/* 历史 */}
      {history.length > 0 && (
        <div className="history-section">
          <div className="history-label">📜 最近阅读</div>
          {history.slice(0, 5).map(item => (
            <div key={item.id} className="history-item">
              <div className="history-title">{item.story?.substring(0, 50)}...</div>
              <div className="history-time">{item.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
