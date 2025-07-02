import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const TrinityAssessmentComplete = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  // 75項目の質問データベース（サブカテゴリ付き）
  const questions = {
    body: [
      // 身体感覚・エネルギーに関する偽物感 (0-4)
      { text: "体が緊張していることが多く、リラックスできない", subcategory: "sensation", id: 0 },
      { text: "身体の感覚や声を無視することが多い", subcategory: "sensation", id: 1 },
      { text: "エネルギーレベルが不安定で、極端な疲労感がある", subcategory: "sensation", id: 2 },
      { text: "身体からのサインを「気のせい」として無視している", subcategory: "sensation", id: 3 },
      { text: "自分の身体を信頼できない感覚がある", subcategory: "sensation", id: 4 },
      
      // 身体ケア・セルフケアに関する偽物感 (5-9)
      { text: "疲れているのに休むことに罪悪感を感じる", subcategory: "selfcare", id: 5 },
      { text: "身体のメンテナンスよりも仕事や義務を優先してしまう", subcategory: "selfcare", id: 6 },
      { text: "「我慢すること」が美徳だと思い込んでいる", subcategory: "selfcare", id: 7 },
      { text: "身体的な不調を精神力で乗り切ろうとする", subcategory: "selfcare", id: 8 },
      { text: "自分の身体を労わることに価値を感じられない", subcategory: "selfcare", id: 9 },
      
      // 外見・表現に関する偽物感 (10-14)
      { text: "見た目を取り繕うために、本来の自分らしさを隠している", subcategory: "appearance", id: 10 },
      { text: "他者の目を意識した「演技的」な身体表現をしている", subcategory: "appearance", id: 11 },
      { text: "自然な身体の動きや表現を抑制している", subcategory: "appearance", id: 12 },
      { text: "身体的な魅力や美しさを認めることができない", subcategory: "appearance", id: 13 },
      { text: "「こうあるべき」身体像に合わせて自分を無理に変えようとする", subcategory: "appearance", id: 14 },
      
      // 身体の不調・症状に関する偽物感 (15-19)
      { text: "身体的な不調（頭痛、肩こり等）が慢性化している", subcategory: "symptoms", id: 15 },
      { text: "ストレスが身体症状として現れやすい", subcategory: "symptoms", id: 16 },
      { text: "身体の不調を「気持ちの問題」だと思いがち", subcategory: "symptoms", id: 17 },
      { text: "薬や外的手段に頼りがちで、身体の自然治癒力を信頼していない", subcategory: "symptoms", id: 18 },
      { text: "身体からの警告サインを見逃しがち", subcategory: "symptoms", id: 19 },
      
      // エネルギー・活力に関する偽物感 (20-24)
      { text: "朝起きた時から疲れている感覚がある", subcategory: "energy", id: 20 },
      { text: "やる気や情熱を感じられない時期が続いている", subcategory: "energy", id: 21 },
      { text: "身体のエネルギーを効率的に使えていない感覚がある", subcategory: "energy", id: 22 },
      { text: "食事や睡眠でエネルギーが回復しにくい", subcategory: "energy", id: 23 },
      { text: "自分のエネルギーレベルをコントロールできない", subcategory: "energy", id: 24 }
    ],
    
    mind: [
      // 思考パターンに関する偽物感 (25-29)
      { text: "常に「正しくあらねば」というプレッシャーを感じている", subcategory: "thinking", id: 25 },
      { text: "完璧でいなければならないという思考パターンがある", subcategory: "thinking", id: 26 },
      { text: "失敗や間違いを過度に恐れている", subcategory: "thinking", id: 27 },
      { text: "「もっと頑張らなければ」という思考が止まらない", subcategory: "thinking", id: 28 },
      { text: "自己批判的な内的対話が頻繁に起こる", subcategory: "thinking", id: 29 },
      
      // 感情表現に関する偽物感 (30-34)
      { text: "感情を表に出すことを控え、「大丈夫」を装っている", subcategory: "emotion", id: 30 },
      { text: "怒りや悲しみなどの「ネガティブ」な感情を抑圧している", subcategory: "emotion", id: 31 },
      { text: "本当の感情と表現している感情が違う", subcategory: "emotion", id: 32 },
      { text: "感情的になることを「弱さ」と捉えている", subcategory: "emotion", id: 33 },
      { text: "他者に気を使いすぎて自分の感情を後回しにしている", subcategory: "emotion", id: 34 },
      
      // 他者との関係性に関する偽物感 (35-39)
      { text: "他人からどう見られるかを過度に気にしている", subcategory: "relationship", id: 35 },
      { text: "本音を言うことができない場面が多い", subcategory: "relationship", id: 36 },
      { text: "「嫌われたくない」ために自分を偽ることがある", subcategory: "relationship", id: 37 },
      { text: "対立や摩擦を避けるために意見を控える", subcategory: "relationship", id: 38 },
      { text: "他者の評価によって自己価値が大きく左右される", subcategory: "relationship", id: 39 },
      
      // 学習・成長に関する偽物感 (40-44)
      { text: "「まだ十分じゃない」という感覚が常にある", subcategory: "growth", id: 40 },
      { text: "新しいことを学ぶ時「私には無理」と最初から諦めがち", subcategory: "growth", id: 41 },
      { text: "他者と比較して自分の進歩を否定してしまう", subcategory: "growth", id: 42 },
      { text: "成功体験を「たまたま」や「運」で片付けてしまう", subcategory: "growth", id: 43 },
      { text: "頭では理解しているのに、心が納得していない感覚がある", subcategory: "growth", id: 44 },
      
      // 内面と外面の一致に関する偽物感 (45-49)
      { text: "公的な自分と私的な自分の間に大きなギャップがある", subcategory: "integration", id: 45 },
      { text: "役割を演じているような感覚で日々を過ごしている", subcategory: "integration", id: 46 },
      { text: "「いつか正体がバレる」という恐怖を抱えている", subcategory: "integration", id: 47 },
      { text: "本当の自分を知られることへの恐れがある", subcategory: "integration", id: 48 },
      { text: "心の中の真実と表面的な言動が一致していない", subcategory: "integration", id: 49 }
    ],
    
    rider: [
      // 使命・目的に関する偽物感 (50-54)
      { text: "本当にやりたいことが分からない状態で行動している", subcategory: "mission", id: 50 },
      { text: "周囲の期待に応えるために、自分の直感を無視している", subcategory: "mission", id: 51 },
      { text: "成功しているはずなのに、深い充実感を感じられない", subcategory: "mission", id: 52 },
      { text: "「これが私の人生の目的なのか？」と疑問を感じることがある", subcategory: "mission", id: 53 },
      { text: "心の奥で「違う、これは本当の私じゃない」という声が聞こえる", subcategory: "mission", id: 54 },
      
      // 内なる声・直感に関する偽物感 (55-59)
      { text: "重要な決断を他人の意見に頼ってしまう", subcategory: "intuition", id: 55 },
      { text: "自分の直感を信じることができない", subcategory: "intuition", id: 56 },
      { text: "「もっと大きな意味があるはず」という感覚を無視している", subcategory: "intuition", id: 57 },
      { text: "スピリチュアルな体験や洞察を「気のせい」と否定してしまう", subcategory: "intuition", id: 58 },
      { text: "内側から湧き上がるインスピレーションを表現できない", subcategory: "intuition", id: 59 },
      
      // 存在価値・自己認識に関する偽物感 (60-64)
      { text: "「私はここにいていいのか？」という疑念を感じる", subcategory: "existence", id: 60 },
      { text: "自分の存在そのものに価値を感じられない", subcategory: "existence", id: 61 },
      { text: "他者と比較して自分が劣っていると感じる", subcategory: "existence", id: 62 },
      { text: "「特別な存在でありたい」と思う一方で、それを恥じている", subcategory: "existence", id: 63 },
      { text: "宇宙や自然とのつながりを感じられない", subcategory: "existence", id: 64 },
      
      // 表現・創造性に関する偽物感 (65-69)
      { text: "本当の自分を表現することに恐れを感じる", subcategory: "expression", id: 65 },
      { text: "創造的な活動に「才能がない」と制限をかけている", subcategory: "expression", id: 66 },
      { text: "独自性や個性を出すことに罪悪感を感じる", subcategory: "expression", id: 67 },
      { text: "「私なんかが」という思いで自己表現を控える", subcategory: "expression", id: 68 },
      { text: "魂が求める表現と社会的役割の間で引き裂かれている", subcategory: "expression", id: 69 },
      
      // 愛・つながりに関する偽物感 (70-74)
      { text: "無条件の愛を受け取ることができない", subcategory: "love", id: 70 },
      { text: "深いレベルでの理解や共感を諦めている", subcategory: "love", id: 71 },
      { text: "「本当の私を知られたら嫌われる」と恐れている", subcategory: "love", id: 72 },
      { text: "孤独感の中で「私だけが違う」と感じている", subcategory: "love", id: 73 },
      { text: "魂レベルでのつながりを体験したことがない", subcategory: "love", id: 74 }
    ]
  };

  const subcategoryLabels = {
    // 馬体（肉体）関連
    sensation: "身体感覚・エネルギー認識",
    selfcare: "身体ケア・セルフケア",
    appearance: "外見・身体表現",
    symptoms: "身体の不調・症状",
    energy: "エネルギー・活力",
    
    // 馬の意思（精神）関連
    thinking: "思考パターン",
    emotion: "感情表現",
    relationship: "他者との関係性",
    growth: "学習・成長",
    integration: "内面と外面の一致",
    
    // 騎手（魂）関連
    mission: "使命・目的",
    intuition: "内なる声・直感",
    existence: "存在価値・自己認識",
    expression: "表現・創造性",
    love: "愛・つながり"
  };

  // 全質問を配列として展開
  const allQuestions = [...questions.body, ...questions.mind, ...questions.rider];
  const currentQuestion = allQuestions[currentStep];

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 結果分析関数
  const analyzeResults = () => {
    if (Object.keys(responses).length < 75) return null;

    // カテゴリ別スコア計算
    const bodyScore = questions.body.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const mindScore = questions.mind.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const riderScore = questions.rider.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const totalScore = bodyScore + mindScore + riderScore;

    // サブカテゴリ別分析
    const subcategoryScores = {};
    Object.keys(subcategoryLabels).forEach(subcategory => {
      subcategoryScores[subcategory] = allQuestions
        .filter(q => q.subcategory === subcategory)
        .reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    });

    // レベル判定
    const getLevel = (score, maxScore) => {
      const percentage = (score / maxScore) * 100;
      if (percentage >= 80) return { level: "深刻な分断状態", color: "#DC2626", description: "緊急に統合的サポートが必要" };
      if (percentage >= 60) return { level: "強い偽物感", color: "#EA580C", description: "包括的なアプローチが推奨" };
      if (percentage >= 40) return { level: "中程度の偽物感", color: "#D97706", description: "段階的な統合プログラムが有効" };
      if (percentage >= 20) return { level: "軽度の偽物感", color: "#65A30D", description: "予防的サポートが推奨" };
      return { level: "健全な統合状態", color: "#059669", description: "良好な三位一体バランス" };
    };

    // 統合度計算（健全度ベース）
    const integrationLevel = Math.max(0, 100 - (totalScore / 375) * 100);

    // 総合プロフィール
    const getOverallProfile = () => {
      if (totalScore >= 300) return "深刻な三位一体分断状態";
      if (totalScore >= 225) return "強い偽物感・統合要";
      if (totalScore >= 150) return "中程度の偽物感・調整要";
      if (totalScore >= 75) return "軽度の偽物感・予防要";
      return "健全な三位一体統合状態";
    };

    return {
      scores: {
        total: totalScore,
        body: bodyScore,
        mind: mindScore,
        rider: riderScore
      },
      levels: {
        total: getLevel(totalScore, 375),
        body: getLevel(bodyScore, 125),
        mind: getLevel(mindScore, 125),
        rider: getLevel(riderScore, 125)
      },
      subcategoryScores,
      integrationLevel,
      overallProfile: getOverallProfile()
    };
  };

  const analysis = analyzeResults();

  // レーダーチャート用データ準備
  const radarData = analysis ? Object.keys(subcategoryLabels).map(subcategory => ({
    category: subcategoryLabels[subcategory],
    健全度: Math.max(0, 25 - (analysis.subcategoryScores[subcategory] || 0)),
    偽物感: analysis.subcategoryScores[subcategory] || 0
  })) : [];

  // プログレス計算
  const progress = (currentStep / allQuestions.length) * 100;
  const categoryName = currentStep < 25 ? '馬体（肉体）' : currentStep < 50 ? '馬の意思（精神）' : '騎手（魂）';
  const categoryColor = currentStep < 25 ? '#10B981' : currentStep < 50 ? '#EC4899' : '#6366F1';

  if (showResults && analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                三位一体偽物感度分析結果【完全版】
              </h1>
              <p className="text-gray-600 text-lg">
                75項目の詳細分析に基づく包括的な診断結果
              </p>
            </div>

            {/* 総合スコア表示 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2">総合偽物感スコア</h3>
                <p className="text-3xl font-bold">{analysis.scores.total}</p>
                <p className="text-sm opacity-90">/ 375点</p>
                <p className="text-sm mt-2">統合度: {analysis.integrationLevel.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2">馬体（肉体）</h3>
                <p className="text-3xl font-bold">{analysis.scores.body}</p>
                <p className="text-sm opacity-90">/ 125点</p>
                <p className="text-sm mt-2">健全度: {Math.max(0, 125 - analysis.scores.body)}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-6 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2">馬の意思（精神）</h3>
                <p className="text-3xl font-bold">{analysis.scores.mind}</p>
                <p className="text-sm opacity-90">/ 125点</p>
                <p className="text-sm mt-2">健全度: {Math.max(0, 125 - analysis.scores.mind)}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-6 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2">騎手（魂）</h3>
                <p className="text-3xl font-bold">{analysis.scores.rider}</p>
                <p className="text-sm opacity-90">/ 125点</p>
                <p className="text-sm mt-2">健全度: {Math.max(0, 125 - analysis.scores.rider)}</p>
              </div>
            </div>

            {/* 総合プロフィール */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">📊 総合プロフィール分析</h3>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg text-gray-700">{analysis.overallProfile}</p>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: analysis.levels.total.color }}></div>
                  <span className="font-bold text-lg" style={{ color: analysis.levels.total.color }}>
                    {analysis.levels.total.level}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">三位一体統合度:</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.integrationLevel}%` }}
                  ></div>
                </div>
                <span className="font-bold text-purple-600">{analysis.integrationLevel.toFixed(1)}%</span>
              </div>
            </div>

            {/* カテゴリ別バーチャート */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 三位一体バランス分析</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={[
                    { 
                      name: '馬体（肉体）', 
                      score: analysis.scores.body, 
                      健全度: Math.max(0, 125 - analysis.scores.body),
                      fullMark: 125 
                    },
                    { 
                      name: '馬の意思（精神）', 
                      score: analysis.scores.mind, 
                      健全度: Math.max(0, 125 - analysis.scores.mind),
                      fullMark: 125 
                    },
                    { 
                      name: '騎手（魂）', 
                      score: analysis.scores.rider, 
                      健全度: Math.max(0, 125 - analysis.scores.rider),
                      fullMark: 125 
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 125]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'score' ? `${value}/125` : `${value}/125`,
                        name === '健全度' ? '健全度' : '偽物感スコア'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="score" fill="#EF4444" name="偽物感スコア" />
                    <Bar dataKey="健全度" fill="#10B981" name="健全度" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 修正されたサブカテゴリ詳細レーダーチャート */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🌟 15領域詳細分析</h3>
              <p className="text-sm text-gray-600 mb-6 text-center">※外側ほど健全・統合された状態を表します</p>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 'dataMax']} 
                    tick={{ fontSize: 8 }}
                    axisLine={false}
                  />
                  <Radar
                    name="健全度"
                    dataKey="健全度"
                    stroke="#EC4899"
                    fill="#EC4899"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* レベル別診断結果 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-500">
                <h4 className="text-lg font-bold text-gray-800 mb-2">🐎 馬体（肉体）</h4>
                <p className="text-2xl font-bold mb-2" style={{ color: analysis.levels.body.color }}>
                  {analysis.levels.body.level}
                </p>
                <p className="text-sm text-gray-600">
                  スコア: {analysis.scores.body}/125点<br/>
                  健全度: {125 - analysis.scores.body}/125点
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-l-4 border-pink-500">
                <h4 className="text-lg font-bold text-gray-800 mb-2">🧠 馬の意思（精神）</h4>
                <p className="text-2xl font-bold mb-2" style={{ color: analysis.levels.mind.color }}>
                  {analysis.levels.mind.level}
                </p>
                <p className="text-sm text-gray-600">
                  スコア: {analysis.scores.mind}/125点<br/>
                  健全度: {125 - analysis.scores.mind}/125点
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-l-4 border-indigo-500">
                <h4 className="text-lg font-bold text-gray-800 mb-2">👤 騎手（魂）</h4>
                <p className="text-2xl font-bold mb-2" style={{ color: analysis.levels.rider.color }}>
                  {analysis.levels.rider.level}
                </p>
                <p className="text-sm text-gray-600">
                  スコア: {analysis.scores.rider}/125点<br/>
                  健全度: {125 - analysis.scores.rider}/125点
                </p>
              </div>
            </div>



            {/* アクションボタン */}
            <div className="text-center space-y-4">
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setResponses({});
                  setShowResults(false);
                }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                🔄 再診断する
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              魂感自在道 三位一体偽物感度チェック
            </h1>

            <p className="text-gray-500">
              各質問について、どの程度当てはまるかを0〜5で評価してください
            </p>
          </div>

          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: categoryColor }}>
                {categoryName} ({currentStep + 1}/75)
              </span>
              <span className="text-sm text-gray-500">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}dd)`
                }}
              ></div>
            </div>
          </div>

          {/* サブカテゴリ表示 */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{ 
              backgroundColor: categoryColor + '20',
              color: categoryColor
            }}>
              📋 {subcategoryLabels[currentQuestion.subcategory]}
            </div>
          </div>

          {/* 質問カード */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQuestion.text}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponseChange(currentQuestion.id, value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    responses[currentQuestion.id] === value
                      ? 'border-indigo-500 bg-indigo-500 text-white transform scale-105'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs mt-1">
                    {value === 0 && '全く当てはまらない'}
                    {value === 1 && 'ほとんど当てはまらない'}
                    {value === 2 && 'あまり当てはまらない'}
                    {value === 3 && 'やや当てはまる'}
                    {value === 4 && 'かなり当てはまる'}
                    {value === 5 && 'とても当てはまる'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all duration-300"
            >
              ← 前の質問
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                回答済み: {Object.keys(responses).length}/75
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(responses).length / 75) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={nextQuestion}
              disabled={responses[currentQuestion.id] === undefined}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              {currentStep === allQuestions.length - 1 ? '結果を見る 🎯' : '次の質問 →'}
            </button>
          </div>

          {/* 回答状況表示 */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                回答状況: 馬体（肉体）{Math.min(25, Object.keys(responses).filter((id, index) => allQuestions.findIndex(q => q.id == id) < 25).length)}/25 
                | 馬の意思（精神）{Math.min(25, Object.keys(responses).filter((id, index) => {
                  const pos = allQuestions.findIndex(q => q.id == id);
                  return pos >= 25 && pos < 50;
                }).length)}/25 
                | 騎手（魂）{Math.min(25, Object.keys(responses).filter((id, index) => allQuestions.findIndex(q => q.id == id) >= 50).length)}/25
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// App.jsxのメインコンポーネント
function App() {
  return <TrinityAssessmentComplete />;
}

export default App;
