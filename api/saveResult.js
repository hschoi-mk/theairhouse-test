const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personalityType, scores, dimensions } = req.body;

    // 환경 변수에서 Supabase 정보 읽기
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase 설정이 없습니다' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 데이터베이스에 저장
    const { data, error } = await supabase
      .from('results')
      .insert([
        {
          personality_type: personalityType,
          jandi_score: scores.jandi,
          baram_score: scores.baram,
          hanok_score: scores.hanok,
          maum_score: scores.maum,
          soop_score: scores.soop,
          madang_score: scores.madang,
          dimension_data: dimensions,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase 저장 오류:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: '결과가 저장되었습니다',
      data: data
    });

  } catch (error) {
    console.error('오류:', error);
    return res.status(500).json({ error: error.message });
  }
};
