'use client';

import { useState, useEffect, useRef } from 'react';
import { BookOpen, Volume2, RefreshCw, ExternalLink, Search, X } from 'lucide-react';

interface DictionaryWord {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
  sourceUrls?: string[];
}

interface DailyDictionaryProps {
  className?: string;
}

export default function DailyDictionary({ className = '' }: DailyDictionaryProps) {
  const [word, setWord] = useState<DictionaryWord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // List of IELTS-related words for daily display
  const ieltsWords = [
    'academic', 'analyze', 'comprehensive', 'criteria', 'demonstrate', 'evaluate',
    'fluent', 'hypothesis', 'implement', 'justify', 'methodology', 'objective',
    'perspective', 'qualitative', 'quantitative', 'significant', 'substantial',
    'synthesize', 'theoretical', 'validity', 'proficiency', 'coherent',
    'articulate', 'elaborate', 'exemplify', 'facilitate', 'illustrate',
    'interpret', 'navigate', 'optimize', 'prioritize', 'rationalize',
    'abundant', 'achieve', 'adequate', 'advance', 'advantage', 'affect',
    'alternative', 'approach', 'appropriate', 'aspect', 'assess', 'assume',
    'available', 'benefit', 'capacity', 'challenge', 'characteristic', 'circumstance',
    'concept', 'conclude', 'conduct', 'consequence', 'consider', 'consist',
    'constant', 'construct', 'consume', 'contribute', 'conventional', 'create',
    'culture', 'data', 'define', 'derive', 'design', 'determine', 'develop',
    'device', 'dimension', 'distinct', 'distribute', 'domain', 'economic',
    'element', 'eliminate', 'emerge', 'enable', 'energy', 'ensure', 'environment',
    'equate', 'establish', 'estimate', 'evidence', 'examine', 'exceed',
    'exclude', 'exist', 'expand', 'expert', 'explicit', 'exploit', 'export',
    'external', 'factor', 'feature', 'final', 'finance', 'focus', 'form',
    'formula', 'function', 'fundamental', 'generate', 'global', 'goal',
    'grade', 'grant', 'guarantee', 'guideline', 'hence', 'hypothesis',
    'identical', 'identify', 'illustrate', 'impact', 'implement', 'imply',
    'import', 'impose', 'income', 'incorporate', 'increase', 'indicate',
    'individual', 'initial', 'instance', 'integrate', 'intelligence', 'intend',
    'intense', 'interact', 'internal', 'interpret', 'interval', 'invest',
    'investigate', 'involve', 'issue', 'item', 'job', 'join', 'journal',
    'justify', 'key', 'label', 'labour', 'layer', 'legal', 'legislate',
    'level', 'liberal', 'license', 'limit', 'link', 'list', 'local',
    'locate', 'logic', 'maintain', 'major', 'manage', 'manual', 'margin',
    'mark', 'market', 'mass', 'master', 'match', 'material', 'matrix',
    'maximum', 'measure', 'mechanism', 'media', 'medical', 'medium',
    'member', 'mental', 'method', 'migrate', 'military', 'minimal',
    'minimum', 'minor', 'mode', 'modify', 'monitor', 'motion', 'motivate',
    'motor', 'move', 'multiple', 'mutual', 'narrow', 'nation', 'native',
    'natural', 'nature', 'negative', 'network', 'neutral', 'nevertheless',
    'normal', 'notion', 'nuclear', 'number', 'objective', 'obtain',
    'obvious', 'occupy', 'occur', 'odd', 'offer', 'official', 'offset',
    'option', 'order', 'organ', 'organic', 'orient', 'origin', 'outcome',
    'output', 'overall', 'overcome', 'overlap', 'overview', 'panel',
    'paragraph', 'parallel', 'parameter', 'parent', 'park', 'part',
    'participate', 'particular', 'partner', 'pass', 'passage', 'passive',
    'pattern', 'peak', 'peer', 'penalty', 'perceive', 'percent', 'perfect',
    'perform', 'period', 'permanent', 'permit', 'persist', 'person',
    'perspective', 'phase', 'phenomenon', 'philosophy', 'physical',
    'picture', 'piece', 'place', 'plan', 'plane', 'planet', 'plant',
    'platform', 'play', 'plus', 'point', 'policy', 'political', 'poll',
    'pool', 'poor', 'popular', 'portion', 'pose', 'position', 'positive',
    'possess', 'possible', 'post', 'potential', 'pound', 'power', 'practical',
    'practice', 'precede', 'precise', 'predict', 'prefer', 'preliminary',
    'prepare', 'present', 'preserve', 'press', 'pressure', 'presume',
    'prevent', 'previous', 'primary', 'prime', 'principal', 'principle',
    'prior', 'priority', 'private', 'probable', 'problem', 'procedure',
    'proceed', 'process', 'produce', 'product', 'profession', 'professional',
    'profile', 'profit', 'program', 'progress', 'project', 'promise',
    'promote', 'prompt', 'proof', 'proper', 'property', 'proportion',
    'propose', 'prospect', 'protect', 'protein', 'protest', 'provide',
    'province', 'provision', 'public', 'publish', 'purchase', 'purpose',
    'pursue', 'push', 'put', 'qualify', 'quality', 'quantity', 'quarter',
    'question', 'quick', 'quiet', 'quite', 'quote', 'race', 'radical',
    'radio', 'rail', 'rain', 'raise', 'random', 'range', 'rank', 'rapid',
    'rare', 'rate', 'rather', 'ratio', 'raw', 'reach', 'react', 'read',
    'ready', 'real', 'realise', 'realistic', 'reality', 'realize', 'really',
    'reason', 'reasonable', 'recall', 'receive', 'recent', 'recently',
    'recognise', 'recognition', 'recognize', 'recommend', 'record',
    'recover', 'recruit', 'red', 'reduce', 'refer', 'reference', 'reflect',
    'reform', 'refuse', 'regard', 'region', 'register', 'regret', 'regular',
    'regulation', 'reject', 'relate', 'relation', 'relationship', 'relative',
    'relax', 'release', 'relevant', 'reliable', 'relief', 'religion',
    'religious', 'reluctant', 'rely', 'remain', 'remarkable', 'remember',
    'remind', 'remove', 'render', 'rent', 'repair', 'repeat', 'replace',
    'reply', 'report', 'represent', 'representative', 'reputation', 'request',
    'require', 'requirement', 'research', 'reserve', 'resident', 'resign',
    'resist', 'resolve', 'resource', 'respect', 'respond', 'response',
    'responsibility', 'responsible', 'rest', 'restaurant', 'restore',
    'restrict', 'result', 'retain', 'retire', 'return', 'reveal', 'revenue',
    'review', 'revise', 'revolution', 'reward', 'rich', 'ride', 'right',
    'ring', 'rise', 'risk', 'rival', 'river', 'road', 'rob', 'rock',
    'role', 'roll', 'romantic', 'room', 'root', 'rope', 'rose', 'rough',
    'round', 'route', 'routine', 'row', 'royal', 'rule', 'run', 'rural',
    'rush', 'sad', 'safe', 'sail', 'sake', 'salary', 'sale', 'salt',
    'same', 'sample', 'sand', 'save', 'say', 'scale', 'scan', 'scare',
    'scene', 'schedule', 'scheme', 'school', 'science', 'scientific',
    'scientist', 'scope', 'score', 'scream', 'screen', 'script', 'sea',
    'search', 'season', 'seat', 'second', 'secret', 'secretary', 'section',
    'sector', 'secure', 'see', 'seek', 'seem', 'segment', 'select',
    'self', 'sell', 'send', 'senior', 'sense', 'sensitive', 'sentence',
    'separate', 'sequence', 'series', 'serious', 'serve', 'service',
    'session', 'set', 'settle', 'settlement', 'several', 'severe', 'sex',
    'sexual', 'shade', 'shadow', 'shake', 'shall', 'shape', 'share',
    'sharp', 'she', 'sheet', 'shelf', 'shell', 'shelter', 'shift',
    'shine', 'ship', 'shirt', 'shock', 'shoe', 'shoot', 'shop', 'shore',
    'short', 'shot', 'should', 'shoulder', 'shout', 'show', 'shut',
    'sick', 'side', 'sight', 'sign', 'signal', 'significant', 'silence',
    'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'simply',
    'since', 'sing', 'single', 'sink', 'sir', 'sister', 'sit', 'site',
    'situation', 'six', 'size', 'skill', 'skin', 'sky', 'slave', 'sleep',
    'slice', 'slide', 'slight', 'slip', 'slope', 'slow', 'small', 'smart',
    'smell', 'smile', 'smoke', 'smooth', 'snap', 'snow', 'so', 'soap',
    'social', 'society', 'sock', 'soft', 'soil', 'solar', 'soldier',
    'solid', 'solution', 'solve', 'some', 'somebody', 'somehow', 'someone',
    'something', 'sometimes', 'somewhat', 'somewhere', 'son', 'song',
    'soon', 'sophisticated', 'sorry', 'sort', 'soul', 'sound', 'soup',
    'source', 'south', 'southern', 'space', 'spare', 'speak', 'special',
    'specialist', 'species', 'specific', 'specify', 'speech', 'speed',
    'spend', 'spirit', 'spiritual', 'split', 'spoke', 'spokesman', 'sponsor',
    'sport', 'spot', 'spread', 'spring', 'square', 'squeeze', 'stable',
    'staff', 'stage', 'stain', 'stake', 'stand', 'standard', 'star',
    'stare', 'start', 'state', 'statement', 'station', 'statistics',
    'status', 'stay', 'steady', 'steal', 'steel', 'step', 'stick',
    'still', 'stir', 'stock', 'stomach', 'stone', 'stop', 'store',
    'storm', 'story', 'straight', 'strange', 'strategy', 'stream',
    'street', 'strength', 'stress', 'stretch', 'strike', 'string',
    'strip', 'stroke', 'strong', 'structure', 'struggle', 'student',
    'studio', 'study', 'stuff', 'stupid', 'style', 'subject', 'submit',
    'subsequent', 'substance', 'substantial', 'substitute', 'subtle',
    'succeed', 'success', 'successful', 'such', 'sudden', 'suffer',
    'sufficient', 'sugar', 'suggest', 'suit', 'suitable', 'sum',
    'summary', 'summer', 'sun', 'super', 'superior', 'supervise',
    'supply', 'support', 'suppose', 'sure', 'surface', 'surgery',
    'surprise', 'surround', 'survey', 'survive', 'suspect', 'sustain',
    'swear', 'sweep', 'sweet', 'swim', 'swing', 'switch', 'symbol',
    'symptom', 'system', 'table', 'tackle', 'tail', 'take', 'tale',
    'talk', 'tall', 'tank', 'tap', 'tape', 'target', 'task', 'taste',
    'tax', 'tea', 'teach', 'team', 'tear', 'technical', 'technique',
    'technology', 'teenage', 'telephone', 'television', 'tell', 'temper',
    'temperature', 'temple', 'temporary', 'tend', 'tendency', 'tennis',
    'tension', 'tent', 'term', 'terrible', 'territory', 'terror',
    'test', 'text', 'than', 'thank', 'that', 'the', 'theatre', 'their',
    'them', 'theme', 'themselves', 'then', 'theory', 'therapy', 'there',
    'therefore', 'these', 'they', 'thick', 'thin', 'thing', 'think',
    'third', 'this', 'thorough', 'those', 'though', 'thought', 'thousand',
    'threat', 'threaten', 'three', 'through', 'throughout', 'throw',
    'thus', 'ticket', 'tie', 'tight', 'till', 'time', 'tiny', 'tip',
    'tire', 'tired', 'title', 'to', 'today', 'toe', 'together', 'toilet',
    'tolerance', 'tolerate', 'tomorrow', 'tone', 'tongue', 'tonight',
    'too', 'tool', 'tooth', 'top', 'topic', 'total', 'touch', 'tough',
    'tour', 'tourist', 'toward', 'towards', 'tower', 'town', 'toy',
    'track', 'trade', 'tradition', 'traditional', 'traffic', 'tragedy',
    'trail', 'train', 'training', 'transfer', 'transform', 'transition',
    'translate', 'translation', 'transmit', 'transport', 'trap', 'travel',
    'treat', 'treatment', 'treaty', 'tree', 'tremendous', 'trend',
    'trial', 'tribe', 'trick', 'trip', 'troop', 'trouble', 'truck',
    'true', 'truly', 'trust', 'truth', 'try', 'tube', 'tune', 'turn',
    'twelve', 'twenty', 'twice', 'twin', 'two', 'type', 'typical',
    'ugly', 'ultimate', 'unable', 'uncle', 'under', 'undergo', 'understand',
    'undertake', 'unemployment', 'unexpected', 'unfortunately', 'uniform',
    'union', 'unique', 'unit', 'unite', 'university', 'unless', 'unlike',
    'unlikely', 'until', 'unusual', 'up', 'upon', 'upper', 'upset',
    'urban', 'urge', 'urgent', 'us', 'use', 'used', 'useful', 'user',
    'usual', 'usually', 'utility', 'utilize', 'utter', 'vacation',
    'vacuum', 'vague', 'valid', 'valley', 'valuable', 'value', 'van',
    'vanish', 'variable', 'variation', 'variety', 'various', 'vary',
    'vast', 'vegetable', 'vehicle', 'venture', 'verb', 'version', 'versus',
    'very', 'via', 'victim', 'victory', 'video', 'view', 'village',
    'violence', 'violent', 'virtual', 'virus', 'visible', 'vision',
    'visit', 'visitor', 'visual', 'vital', 'voice', 'volume', 'volunteer',
    'vote', 'voter', 'vulnerable', 'wage', 'wait', 'wake', 'walk',
    'wall', 'want', 'war', 'warm', 'warn', 'warning', 'wash', 'waste',
    'watch', 'water', 'wave', 'way', 'we', 'weak', 'wealth', 'wealthy',
    'weapon', 'wear', 'weather', 'web', 'website', 'wedding', 'week',
    'weekend', 'weekly', 'weigh', 'weight', 'welcome', 'welfare', 'well',
    'west', 'western', 'wet', 'what', 'whatever', 'wheel', 'when',
    'whenever', 'where', 'whereas', 'wherever', 'whether', 'which',
    'while', 'whilst', 'whisper', 'white', 'who', 'whole', 'whom',
    'whose', 'why', 'wide', 'widely', 'widespread', 'wife', 'wild',
    'will', 'willing', 'win', 'wind', 'window', 'wine', 'wing', 'winner',
    'winter', 'wipe', 'wire', 'wise', 'wish', 'with', 'withdraw',
    'within', 'without', 'witness', 'woman', 'wonder', 'wonderful',
    'wood', 'wooden', 'wool', 'word', 'work', 'worker', 'workforce',
    'working', 'workshop', 'world', 'worldwide', 'worry', 'worse',
    'worst', 'worth', 'would', 'wrap', 'write', 'writer', 'writing',
    'written', 'wrong', 'yard', 'yeah', 'year', 'yellow', 'yes',
    'yesterday', 'yet', 'yield', 'you', 'young', 'your', 'yours',
    'yourself', 'youth', 'zone'
  ];

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * ieltsWords.length);
    return ieltsWords[randomIndex];
  };

  const generateSuggestions = (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = ieltsWords
      .filter(word => 
        word.toLowerCase().startsWith(input.toLowerCase()) ||
        word.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    fetchWord(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const fetchWord = async (wordToFetch?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const word = wordToFetch || getRandomWord();
      setCurrentWord(word);
      
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      setWord(data[0]);
    } catch (err) {
      setError('Không thể tải từ vựng. Vui lòng thử lại.');
      console.error('Dictionary API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(err => console.error('Audio play error:', err));
  };

  useEffect(() => {
    fetchWord();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRefresh = () => {
    fetchWord();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchWord = formData.get('search') as string;
    if (searchWord.trim()) {
      fetchWord(searchWord.trim().toLowerCase());
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          Từ vựng IELTS hôm nay
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={searchRef}
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Tìm kiếm từ vựng... (gõ ít nhất 2 ký tự)"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-1" />
              Tìm
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between"
                >
                  <span className="text-gray-900">{suggestion}</span>
                  <span className="text-xs text-gray-500">IELTS</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Word Display */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải từ vựng...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {word && !loading && (
        <div className="space-y-4">
          {/* Word Header */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{word.word}</h4>
                {word.phonetic && (
                  <p className="text-gray-600 mt-1">/{word.phonetic}/</p>
                )}
              </div>
              {word.phonetics && word.phonetics[0]?.audio && (
                <button
                  onClick={() => playAudio(word.phonetics![0].audio!)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Meanings */}
          <div className="space-y-4">
            {word.meanings.map((meaning, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {meaning.partOfSpeech}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {meaning.definitions.slice(0, 2).map((def, defIndex) => (
                    <div key={defIndex}>
                      <p className="text-gray-800 mb-1">{def.definition}</p>
                      {def.example && (
                        <p className="text-gray-600 italic text-sm">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Synonyms */}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Từ đồng nghĩa:</p>
                    <div className="flex flex-wrap gap-1">
                      {meaning.synonyms.slice(0, 5).map((synonym, synIndex) => (
                        <span
                          key={synIndex}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Source Link */}
          {word.sourceUrls && word.sourceUrls.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={word.sourceUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Xem thêm trên Dictionary.com
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

