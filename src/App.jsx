import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const TrinityAssessmentComplete = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  // 75項目の質問データベース（サブカテゴリ付き）
  const questions = {
    rider: [
      // 使命・目的に関する偽物感 (0-4)
      { text: "本当にやりたいことが分からない状態で行動している", subcategory: "mission", id: 0 },
      { text: "周囲の期待に応えるために、自分の直感を無視している", subcategory: "mission", id: 1 },
      { text: "成功しているはずなのに、深い充実感を感じられない", subcategory: "mission", id: 2 },
      { text: "「これが私の人生の目的なのか？」と疑問を感じることがある", subcategory: "mission", id: 3 },
      { text: "心の奥で「違う、これは本当の私じゃない」という声が聞こえる", subcategory: "mission", id: 4 },
      
      // 内なる声・直感に関する偽物感 (5-9)
      { text: "重要な決断を他人の意見に頼ってしまう", subcategory: "intuition", id: 5 },
      { text: "自分の直感を信じることができない", subcategory: "intuition", id: 6 },
      { text: "「もっと大きな意味があるはず」という感覚を無視している", subcategory: "intuition", id: 7 },
      { text: "スピリチュアルな体験や洞察を「気のせい」と否定してしまう", subcategory: "intuition", id: 8 },
      { text: "内側から湧き上がるインスピレーションを表現できない", subcategory: "intuition", id: 9 },
      
      // 存在価値・自己認識に関する偽物感 (10-14)
      { text: "「私はここにいていいのか？」という疑念を感じる", subcategory: "existence", id: 10 },
      { text: "自分の存在そのものに価値を感じられない", subcategory: "existence", id: 11 },
      { text: "他者と比較して自分が劣っていると感じる", subcategory: "existence", id: 12 },
      { text: "「特別な存在でありたい」と思う一方で、それを恥じている", subcategory: "existence", id: 13 },
      { text: "宇宙や自然とのつながりを感じられない", subcategory: "existence", id: 14 },
      
      // 表現・創造性に関する偽物感 (15-19)
      { text: "本当の自分を表現することに恐れを感じる", subcategory: "expression", id: 15 },
      { text: "創造的な活動に「才能がない」と制限をかけている", subcategory: "expression", id: 16 },
      { text: "独自性や個性を出すことに罪悪感を感じる", subcategory: "expression", id: 17 },
      { text: "「私なんかが」という思いで自己表現を控える", subcategory: "expression", id: 18 },
      { text: "魂が求める表現と社会的役割の間で引き裂かれている", subcategory: "expression", id: 19 },
      
      // 愛・つながりに関する偽物感 (20-24)
      { text: "無条件の愛を受け取ることができない", subcategory: "love", id: 20 },
      { text: "深いレベルでの理解や共感を諦めている", subcategory: "love", id: 21 },
      { text: "「本当の私を知られたら嫌われる」と恐れている", subcategory: "love", id: 22 },
      { text: "孤独感の中で「私だけが違う」と感じている", subcategory: "love", id: 23 },
      { text: "魂レベルでのつながりを体験したことがない", subcategory: "love", id: 24 }
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
    
    body: [
      // 身体感覚・エネルギーに関する偽物感 (50-54)
      { text: "体が緊張していることが多く、リラックスできない", subcategory: "sensation", id: 50 },
      { text: "身体の感覚や声を無視することが多い", subcategory: "sensation", id: 51 },
      { text: "エネルギーレベルが不安定で、極端な疲労感がある", subcategory: "sensation", id: 52 },
      { text: "身体からのサインを「気のせい」として無視している", subcategory: "sensation", id: 53 },
      { text: "自分の身体を信頼できない感覚がある", subcategory: "sensation", id: 54 },
      
      // 身体ケア・セルフケアに関する偽物感 (55-59)
      { text: "疲れているのに休むことに罪悪感を感じる", subcategory: "selfcare", id: 55 },
      { text: "身体のメンテナンスよりも仕事や義務を優先してしまう", subcategory: "selfcare", id: 56 },
      { text: "「我慢すること」が美徳だと思い込んでいる", subcategory: "selfcare", id: 57 },
      { text: "身体的な不調を精神力で乗り切ろうとする", subcategory: "selfcare", id: 58 },
      { text: "自分の身体を労わることに価値を感じられない", subcategory: "selfcare", id: 59 },
      
      // 外見・表現に関する偽物感 (60-64)
      { text: "見た目を取り繕うために、本来の自分らしさを隠している", subcategory: "appearance", id: 60 },
      { text: "他者の目を意識した「演技的」な身体表現をしている", subcategory: "appearance", id: 61 },
      { text: "自然な身体の動きや表現を抑制している", subcategory: "appearance", id: 62 },
      { text: "身体的な魅力や美しさを認めることができない", subcategory: "appearance", id: 63 },
      { text: "「こうあるべき」身体像に合わせて自分を無理に変えようとする", subcategory: "appearance", id: 64 },
      
      // 身体の不調・症状に関する偽物感 (65-69)
      { text: "身体的な不調（頭痛、肩こり、胃痛など）が慢性化している", subcategory: "symptoms", id: 65 },
      { text: "原因不明の身体症状に悩まされている", subcategory: "symptoms", id: 66 },
      { text: "身体の不調を「年のせい」「仕方ない」と諦めている", subcategory: "symptoms", id: 67 },
      { text: "痛みや不調があっても「まだ大丈夫」と無理を続ける", subcategory: "symptoms", id: 68 },
      { text: "身体のメンテナンスを先延ばしにしがちである", subcategory: "symptoms", id: 69 },
      
      // 身体と心の統合に関する偽物感 (70-74)
      { text: "心の状態と身体の状態の関連性に気づけない", subcategory: "mindbody", id: 70 },
      { text: "身体の声を聞いて生活することができない", subcategory: "mindbody", id: 71 },
      { text: "身体を使った表現（ダンス、運動など）に抵抗がある", subcategory: "mindbody", id: 72 },
      { text: "身体を通じた癒しや変容を信じられない", subcategory: "mindbody", id: 73 },
      { text: "身体の知恵を活用することができない", subcategory: "mindbody", id: 74 }
    ]
  };

  // サブカテゴリラベル
  const subcategoryLabels = {
    mission: "使命・目的",
    intuition: "内なる声・直感",
    existence: "存在価値・自己認識",
    expression: "表現・創造性",
    love: "愛・つながり",
    thinking: "思考パターン",
    emotion: "感情表現",
    relationship: "他者との関係性",
    growth: "学習・成長",
    integration: "内面と外面の一致",
    sensation: "身体感覚・エネルギー",
    selfcare: "身体ケア・セルフケア",
    appearance: "外見・表現",
    symptoms: "身体の不調・症状",
    mindbody: "身体と心の統合"
  };

  // 全ての質問を統合（馬体→馬の意思→騎手の順）
  const allQuestions = [...questions.body, ...questions.mind, ...questions.rider];
  const currentQuestion = allQuestions[currentStep];
  const progress = ((currentStep + 1) / allQuestions.length) * 100;

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 結果分析ロジック
  const analyzeResults = () => {
    if (Object.keys(responses).length !== 75) return null;

    // 三位一体別スコア計算
    const riderScore = questions.rider.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const mindScore = questions.mind.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const bodyScore = questions.body.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const totalScore = riderScore + mindScore + bodyScore;

    // サブカテゴリ別スコア計算
    const subcategoryScores = {};
    Object.keys(subcategoryLabels).forEach(key => {
      const questionsInCategory = allQuestions.filter(q => q.subcategory === key);
      subcategoryScores[key] = questionsInCategory.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    });

    // レベル判定
    const getLevelInfo = (score, maxScore) => {
      const percentage = (score / maxScore) * 100;
      if (percentage <= 20) return { level: "高次元統合", color: "#10B981" };
      if (percentage <= 40) return { level: "統合進行中", color: "#3B82F6" };
      if (percentage <= 60) return { level: "バランス模索中", color: "#F59E0B" };
      if (percentage <= 80) return { level: "偽物感強め", color: "#EF4444" };
      return { level: "深刻な偽物感", color: "#991B1B" };
    };

    const levels = {
      total: getLevelInfo(totalScore, 375),
      rider: getLevelInfo(riderScore, 125),
      mind: getLevelInfo(mindScore, 125),
      body: getLevelInfo(bodyScore, 125)
    };

    // 統合度計算（偽物感が低いほど統合度が高い）
    const integrationLevel = Math.max(0, 100 - (totalScore / 375) * 100);

    // 総合プロフィール
    const getOverallProfile = () => {
      if (integrationLevel >= 80) return "高次元で統合された神性顕現状態";
      if (integrationLevel >= 60) return "三位一体統合が進んだ覚醒状態";
      if (integrationLevel >= 40) return "成長と変容の途上にある発展状態";
      if (integrationLevel >= 20) return "偽物感と真実性が混在する模索状態";
      return "深い偽物感に覆われた変容要請状態";
    };

    return {
      scores: {
        total: totalScore,
        rider: riderScore,
        mind: mindScore,
        body: bodyScore
      },
      subcategoryScores,
      levels,
      integrationLevel,
      overallProfile: getOverallProfile()
    };
  };

  const analysis = Object.keys(responses).length === 75 ? analyzeResults() : null;

  // チャート用データ準備 - 健全度表示（偽物感が低いほど高い値）
  const chartData = analysis ? [
    { name: '馬体（肉体）', score: analysis.scores.body, 健全度: Math.max(0, 125 - analysis.scores.body), maxScore: 125, color: '#10B981' },
    { name: '馬の意思（精神）', score: analysis.scores.mind, 健全度: Math.max(0, 125 - analysis.scores.mind), maxScore: 125, color: '#EC4899' },
    { name: '騎手（魂）', score: analysis.scores.rider, 健全度: Math.max(0, 125 - analysis.scores.rider), maxScore: 125, color: '#6366F1' }
  ] : [];

  // **修正部分**: 三位一体統合レーダーチャート用データ（数字が少ないほど頂点に近づく）
  const trinityRadarData = analysis ? [
    { 
      category: '馬体（肉体）', 
      健全度: Math.max(0, 125 - analysis.scores.body),
      fullMark: 125
    },
    { 
      category: '馬の意思（精神）', 
      健全度: Math.max(0, 125 - analysis.scores.mind),
      fullMark: 125
    },
    { 
      category: '騎手（魂）', 
      健全度: Math.max(0, 125 - analysis.scores.rider),
      fullMark: 125
    }
  ] : [];

  // **修正部分**: サブカテゴリチャート用データも健全度表示に変更
  const subcategoryChartData = analysis ? Object.keys(subcategoryLabels).map(key => {
    const maxSubScore = allQuestions.filter(q => q.subcategory === key).length * 5; // 各カテゴリの最大スコア
    return {
      name: subcategoryLabels[key],
      score: analysis.subcategoryScores[key],
      健全度: Math.max(0, maxSubScore - analysis.subcategoryScores[key]),
      category: key.includes('sensation') || key.includes('selfcare') || key.includes('appearance') || key.includes('symptoms') || key.includes('mindbody') ? 'body' :
               key.includes('thinking') || key.includes('emotion') || key.includes('relationship') || key.includes('growth') || key.includes('integration') ? 'mind' : 'rider'
    };
  }) : [];

  // **修正部分**: レーダーチャート用データ - 健全度での表示
  const radarData = analysis ? Object.keys(subcategoryLabels).map(key => {
    const questionsInCategory = allQuestions.filter(q => q.subcategory === key);
    const maxScore = questionsInCategory.length * 5;
    const actualScore = analysis.subcategoryScores[key];
    const healthScore = Math.max(0, maxScore - actualScore); // 健全度 = 最大スコア - 実際のスコア
    
    return {
      category: subcategoryLabels[key],
      健全度: healthScore,
      fullMark: maxScore
    };
  }) : [];

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      responses,
      analysis,
      version: "完全版75項目"
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `魂感自在道_偽物感診断結果_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // カテゴリ名と色の決定（馬体→馬の意思→騎手の順）
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

            {/* 修正されたレーダーチャート */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🔥 三位一体統合バランス</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">※外側ほど健全・統合された状態</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={trinityRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 125]} 
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                    />
                    <Radar
                      name="健全度"
                      dataKey="健全度"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📈 健全度比較</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === '健全度' ? `${value}/125` : `${value}/125`,
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
              <div className="p-6 rounded-2xl" style={{ backgroundColor: analysis.levels.body.color + '20' }}>
                <h4 className="font-bold text-lg mb-2" style={{ color: analysis.levels.body.color }}>
                  💪 馬体（肉体）レベル
                </h4>
                <p className="font-semibold mb-2" style={{ color: analysis.levels.body.color }}>
                  {analysis.levels.body.level}
                </p>
                <p className="text-sm text-gray-600">
                  スコア: {analysis.scores.body}/125点<br/>
                  健全度: {125 - analysis.scores.body}/125点
                </p>
              </div>
              
              <div className="p-6 rounded-2xl" style={{ backgroundColor: analysis.levels.mind.color + '20' }}>
                <h4 className="font-bold text-lg mb-2" style={{ color: analysis.levels.mind.color }}>
                  🧠 馬の意思（精神）レベル
                </h4>
                <p className="font-semibold mb-2" style={{ color: analysis.levels.mind.color }}>
                  {analysis.levels.mind.level}
                </p>
                <p className="text-sm text-gray-600">
                  スコア: {analysis.scores.mind}/125点<br/>
                  健全度: {125 - analysis.scores.mind}/125点
                </p>
              </div>
              
              <div className="p-6 rounded-2xl" style={{ backgroundColor: analysis.levels.rider.color + '20' }}>
                <h4 className="font-bold text-lg mb-2" style={{ color: analysis.levels.rider.color }}>
                  🧘‍♀️ 騎手（魂）レベル
                </h4>
                <p className="font-semibold mb-2" style={{ color: analysis.levels.rider.color }}>
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
            <p className="text-gray-600 text-lg mb-4">【完全版75項目】</p>
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

export default TrinityAssessmentComplete;
