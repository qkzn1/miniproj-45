import { useState } from 'react'

const OPENAI_IMAGE_API_URL = 'https://api.openai.com/v1/images/generations'

function AiCover({ books, onCoverSave }) {
  const [bookId, setBookId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const size = '1024x1536'
  const [quality, setQuality] = useState('auto')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const book = books.find((item) => item.id === bookId)

  const handleSelect = (id) => {
    setBookId(id)
    setPreview('')
    setError('')
  }

  const handleGenerateCover = async () => {
    if (!book) {
      setError('표지를 만들 도서를 선택해주세요.')
      return
    }

    if (apiKey.trim() === '') {
      setError('OpenAI API Key를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const prompt = `책 표지 이미지를 만들어줘. 제목: "${book.title}", 작가: ${book.author}, 장르: ${book.type}, 내용: ${book.content}. 세로형 책 표지 구도로, 내용의 분위기가 느껴지게 그려줘.`

      const res = await fetch(OPENAI_IMAGE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt,
          n: 1,
          size,
          quality,
          output_format: 'png'
        })
      })

      if (res.status === 401) throw new Error('API Key가 올바르지 않습니다. 다시 확인해주세요.')
      if (res.status === 429) throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      if (!res.ok) throw new Error('OpenAI 요청에 실패했습니다.')

      const data = await res.json()
      const b64Json = data.data?.[0]?.b64_json
      if (!b64Json) throw new Error('응답에서 이미지를 찾을 수 없습니다.')

      const imageSrc = `data:image/png;base64,${b64Json}`
      setPreview(imageSrc)

      await onCoverSave(book.id, imageSrc)
    } catch (err) {
      setError(err.message || '표지 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="page-title">
        <div>
          <span className="breadcrumb">AI Integration / Cover</span>
          <h1>AI Integration</h1>
          <p>도서 제목과 내용으로 표지 이미지를 만들어 저장합니다.</p>
        </div>
      </section>

      <section className="library-section" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div className="book-form" style={{ flex: 1 }}>
          <label>도서 선택</label>
          <select value={bookId} onChange={(e) => handleSelect(e.target.value)}>
            <option value="">도서를 선택하세요</option>
            {books.map((item) => (
              <option key={item.id} value={item.id}>{item.title} - {item.author}</option>
            ))}
          </select>

          {book && (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--sub-text-color)' }}>
              {book.type} · {book.content}
            </p>
          )}

          <label>OpenAI API Key</label>
          <input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <label>이미지 크기</label>
          <input type="text" value="1024x1536 (세로)" readOnly />

          <label>품질</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="auto">auto</option>
          </select>

          <p style={{ margin: 0, fontSize: '12px', color: 'var(--sub-text-color)' }}>
            생성할 때마다 OpenAI API 비용이 발생합니다. API Key는 저장되지 않습니다.
          </p>

          {error && <p style={{ margin: 0, color: '#d9534f' }}>{error}</p>}

          <div className="form-buttons">
            <button className="save-button" onClick={handleGenerateCover} disabled={loading}>
              {loading ? '생성 중...' : preview ? '다시 생성' : 'AI 표지 생성'}
            </button>
          </div>
        </div>

        <div style={{ width: '260px' }}>
          <div className="detail-cover">
            {preview || book?.coverImageUrl ? (
              <img src={preview || book.coverImageUrl} alt={book?.title} />
            ) : (
              <div className="cover-placeholder">
                <strong>{book ? book.title : '미리보기'}</strong>
                <small>{book ? book.author : '도서를 선택하세요'}</small>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default AiCover