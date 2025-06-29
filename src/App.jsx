import React, { useState, useEffect } from 'react';
import { Calendar, BarChart3, User, Settings, Save, TrendingUp, Heart, Brain, Activity } from 'lucide-react';

// UTAGEユーザー情報取得
const getUserInfo = () => {
  // URLパラメータからユーザー情報を取得
  const urlParams = new URLSearchParams(window.location.search);
  return {
    userId: urlParams.get('user_id') || 'anonymous',
    email: urlParams.get('email') || '',
    name: urlParams.get('name') || ''
  };
};

// データ送信関数
const sendDataToUTAGE = async (data) => {
  try {
    const userInfo = getUserInfo();
    const payload = {
      ...data,
      user: userInfo,
      timestamp: new Date().toISOString()
    };
    
    // 開発段階：コンソールでデータ確認
    console.log('📊 送信データ:', payload);
    
    // 将来的にはwebhook URLに送信予定
    // await fetch('YOUR_WEBHOOK_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    
    alert('データが記録されました！（開発モード）');
    return true;
  } catch (error) {
    console.error('❌ データ送信エラー:', error);
    return false;
  }
};

const NisemonoMappingApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSection, setCurrentSection] = useState('soul');
  const [userData, setUserData] = useState({
    assessments: {
      soul: [], // 騎手レベル
      mind: [], // 馬の意思レベル  
      body: []  // 馬体レベル
    },
    dailyEntries: [],
    weeklyReviews: [],
    monthlyReviews: []
  });
  const [currentAssessment, setCurrentAssessment] = useState({
    soul: {},
    mind: {},
    body: {}
  });

  // 偽物感チェックリスト項目
  const soulQuestions = [
    "本当にやりたいことが分からない状態で行動している",
    "周囲の期待に応えるために、自分の直感を無視している", 
    "成功しているはずなのに、深い充実感を感じられない",
    "「これが私の人生の目的なのか？」と疑問を感じることがある",
    "心の奥で「違う、これは本当の私じゃない」という声が聞こえる"
  ];

  const mindQuestions = [
    "感情を表に出すことを控え、「大丈夫」を装っている",
    "完璧でいなければならないという思考パターンがある",
    "他人からどう見られるかを過度に気にしている",
    "自分の本音を言うことができない場面が多い",
    "頭では理解しているのに、心が納得していない感覚がある"
  ];

  const bodyQuestions = [
    "体が緊張していることが多く、リラックスできない",
    "疲れているのに休むことに罪悪感を感じる",
    "身体の声（空腹、疲労、違和感）を無視しがち",
    "見た目を取り繕うために、本来の自分らしさを隠している",
    "身体的な不調（頭痛、肩こり、胃痛など）が慢性化している"
  ];

  // スコア計算
  const calculateScore = (answers) => {
    return Object.values(answers).reduce((sum, score) => sum + (score || 0), 0);
  };

  const getTotalScore = () => {
    return calculateScore(currentAssessment.soul) + 
           calculateScore(currentAssessment.mind) + 
           calculateScore(currentAssessment.body);
  };

  // 今日のデイリーエントリー追加
  const addDailyEntry = (entry) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      ...entry,
      timestamp: Date.now()
    };
    setUserData(prev => ({
      ...prev,
      dailyEntries: [...prev.dailyEntries, newEntry]
    }));
  };

  const nextSection = () => {
    if (currentSection === 'soul') {
      setCurrentSection('mind');
      // 次のページに遷移時のみスクロール
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
    else if (currentSection === 'mind') {
      setCurrentSection('body');
      // 次のページに遷移時のみスクロール
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
    else {
      // 結果保存時にデータ送信
      const assessmentData = {
        type: 'assessment_complete',
        scores: {
          soul: calculateScore(currentAssessment.soul),
          mind: calculateScore(currentAssessment.mind),
          body: calculateScore(currentAssessment.body)
        },
        totalScore: getTotalScore(),
        responses: currentAssessment
      };
      
      // データ送信
      sendDataToUTAGE(assessmentData);
      
      setUserData(prev => ({
        ...prev,
        assessments: {
          soul: [...prev.assessments.soul, currentAssessment.soul],
          mind: [...prev.assessments.mind, currentAssessment.mind],
          body: [...prev.assessments.body, currentAssessment.body]
        }
      }));
      setCurrentSection('soul'); // 次回のためにリセット
      setCurrentView('dashboard');
    }
  };

  // ダッシュボードコンポーネント
  const Dashboard = () => {
    const totalScore = getTotalScore();
    const recentEntries = userData.dailyEntries.slice(-7);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">偽物感マッピング</h1>
          <p className="text-indigo-600">真の自分を取り戻す旅路</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 現在のスコア */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-900">総合偽物感スコア</h3>
                <p className="text-3xl font-bold text-indigo-700">{totalScore}/75</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
          </div>

          {/* 今日の記録 */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">今日の記録</h3>
                <p className="text-sm text-emerald-600">
                  {userData.dailyEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).length > 0 
                    ? '記録済み' : '未記録'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          {/* 継続日数 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-amber-900">継続日数</h3>
                <p className="text-3xl font-bold text-amber-700">{userData.dailyEntries.length}日</p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              setCurrentSection('soul');
              setCurrentView('assessment');
            }}
            className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            偽物感チェック開始
          </button>
          <button 
            onClick={() => setCurrentView('daily')}
            className="bg-emerald-600 text-white p-4 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            今日の記録をつける
          </button>
        </div>
      </div>
    );
  };

  // アセスメントコンポーネント
  const Assessment = () => {
    const sections = {
      soul: { questions: soulQuestions, icon: Heart, title: "騎手（魂）レベル", color: "indigo" },
      mind: { questions: mindQuestions, icon: Brain, title: "馬の意思（精神）レベル", color: "purple" },
      body: { questions: bodyQuestions, icon: Activity, title: "馬体（肉体）レベル", color: "emerald" }
    };

    const currentSectionData = sections[currentSection];
    const Icon = currentSectionData.icon;

    const handleAnswerChange = (questionIndex, value) => {
      setCurrentAssessment(prev => ({
        ...prev,
        [currentSection]: {
          ...prev[currentSection],
          [questionIndex]: parseInt(value)
        }
      }));
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${
            currentSection === 'soul' ? 'bg-indigo-100' :
            currentSection === 'mind' ? 'bg-purple-100' : 'bg-emerald-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              currentSection === 'soul' ? 'text-indigo-600' :
              currentSection === 'mind' ? 'text-purple-600' : 'text-emerald-600'
            }`} />
            <h2 className={`text-xl font-bold ${
              currentSection === 'soul' ? 'text-indigo-900' :
              currentSection === 'mind' ? 'text-purple-900' : 'text-emerald-900'
            }`}>
              {currentSectionData.title}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {currentSectionData.questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-800 mb-4">{question}</p>
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => handleAnswerChange(index, value)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      currentAssessment[currentSection][index] === value
                        ? currentSection === 'soul' ? 'bg-indigo-500 border-indigo-500 text-white' :
                          currentSection === 'mind' ? 'bg-purple-500 border-purple-500 text-white' :
                          'bg-emerald-500 border-emerald-500 text-white'
                        : currentSection === 'soul' ? 'border-gray-300 text-gray-600 hover:border-indigo-300' :
                          currentSection === 'mind' ? 'border-gray-300 text-gray-600 hover:border-purple-300' :
                          'border-gray-300 text-gray-600 hover:border-emerald-300'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>全く当てはまらない</span>
                <span>とても当てはまる</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => {
              setCurrentSection('soul');
              setCurrentView('dashboard');
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            戻る
          </button>
          <button 
            onClick={nextSection}
            className={`px-6 py-3 text-white rounded-lg ${
              currentSection === 'soul' ? 'bg-indigo-600 hover:bg-indigo-700' :
              currentSection === 'mind' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {currentSection === 'body' ? '結果を見る' : '次へ'}
          </button>
        </div>
      </div>
    );
  };

  // デイリー記録コンポーネント
  const DailyTracking = () => {
    const [dailyData, setDailyData] = useState({
      fakenessDegree: 5,
      mainTrigger: '',
      bodyReaction: '',
      copingMethod: '',
      learningForTomorrow: ''
    });

    const handleSubmit = () => {
      // デイリーデータ送信
      const dailyTrackingData = {
        type: 'daily_tracking',
        data: dailyData
      };
      
      // データ送信
      sendDataToUTAGE(dailyTrackingData);
      
      addDailyEntry(dailyData);
      setCurrentView('dashboard');
    };

    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">今日の偽物感記録</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-4">
              偽物感度 (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyData.fakenessDegree}
              onChange={(e) => setDailyData(prev => ({...prev, fakenessDegree: e.target.value}))}
              className="w-full"
            />
            <div className="text-center text-2xl font-bold text-indigo-600 mt-2">
              {dailyData.fakenessDegree}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-2">
              主なトリガー
            </label>
            <textarea
              value={dailyData.mainTrigger}
              onChange={(e) => setDailyData(prev => ({...prev, mainTrigger: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="今日偽物感を感じた主な出来事や状況"
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-2">
              身体反応
            </label>
            <textarea
              value={dailyData.bodyReaction}
              onChange={(e) => setDailyData(prev => ({...prev, bodyReaction: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="その時の身体の反応や感覚"
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-2">
              対処法
            </label>
            <textarea
              value={dailyData.copingMethod}
              onChange={(e) => setDailyData(prev => ({...prev, copingMethod: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="どのように対処したか"
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 font-semibold mb-2">
              明日への学び
            </label>
            <textarea
              value={dailyData.learningForTomorrow}
              onChange={(e) => setDailyData(prev => ({...prev, learningForTomorrow: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="今日の気づきから明日に活かすこと"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => {
              setCurrentSection('soul');
              setCurrentView('dashboard');
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            戻る
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>記録を保存</span>
          </button>
        </div>
      </div>
    );
  };

  // データ分析コンポーネント
  const DataAnalytics = () => {
    const recentEntries = userData.dailyEntries.slice(-30);
    const avgFakenessDegree = recentEntries.length > 0 
      ? Math.round(recentEntries.reduce((sum, entry) => sum + parseInt(entry.fakenessDegree), 0) / recentEntries.length)
      : 0;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">データ分析・管理者ビュー</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">過去30日間の傾向</h3>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{avgFakenessDegree}/10</div>
            <p className="text-gray-600">平均偽物感度</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">記録頻度</h3>
            <div className="text-3xl font-bold text-emerald-600 mb-2">{userData.dailyEntries.length}</div>
            <p className="text-gray-600">総記録日数</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最新の記録</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {userData.dailyEntries.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{entry.date}</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    偽物感度: {entry.fakenessDegree}/10
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{entry.mainTrigger}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">データエクスポート</h3>
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(userData, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'nisemono_mapping_data.json';
              link.click();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            データをダウンロード
          </button>
        </div>
      </div>
    );
  };

  // ナビゲーション
  const Navigation = () => (
    <nav className="bg-white shadow-lg border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'ダッシュボード' },
            { id: 'assessment', icon: User, label: 'チェック' },
            { id: 'daily', icon: Calendar, label: '日次記録' },
            { id: 'analytics', icon: Settings, label: '分析' }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'assessment') {
                    setCurrentSection('soul');
                  }
                  setCurrentView(item.id);
                }}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  currentView === item.id 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'assessment' && <Assessment />}
        {currentView === 'daily' && <DailyTracking />}
        {currentView === 'analytics' && <DataAnalytics />}
      </div>
      <Navigation />
    </div>
  );
};

export default NisemonoMappingApp;
