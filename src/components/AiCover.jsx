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

      <section className="ai-cover-layout">
        <div className="ai-form-panel">
          <div className="ai-panel-heading">
            <span className="ai-step">01</span>
            <div>
              <h2>표지 생성 설정</h2>
              <p>도서 정보를 선택하고 원하는 이미지 품질을 설정하세요.</p>
            </div>
          </div>

          <div className="book-form ai-book-form">
            <label>도서 선택</label>
            <select value={bookId} onChange={(e) => handleSelect(e.target.value)}>
              <option value="">도서를 선택하세요</option>
              {books.map((item) => (
                <option key={item.id} value={item.id}>{item.title} - {item.author}</option>
              ))}
            </select>

            {book && (
              <div className="ai-selected-book">
                <span className="ai-selected-label">선택한 도서</span>
                <strong>{book.title}</strong>
                <span>{book.author} · {book.type}</span>
                <p>{book.content}</p>
              </div>
            )}

            <label>OpenAI API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
            />

            <div className="ai-settings-row">
              <div>
                <label>이미지 크기</label>
                <input type="text" value="1024 × 1536 (세로형)" readOnly />
              </div>

              <div>
                <label>품질</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="auto">auto</option>
                </select>
              </div>
            </div>

            <p className="ai-cost-notice">
              ⓘ 생성할 때마다 OpenAI API 비용이 발생합니다. API Key는 저장되지 않습니다.
            </p>

            {error && <p className="ai-error" role="alert">{error}</p>}

            <button className="save-button ai-generate-button" onClick={handleGenerateCover} disabled={loading}>
              {loading ? '생성 중...' : preview ? '↻ 다시 생성하기' : '✧ AI 표지 생성하기'}
            </button>
          </div>
        </div>

        <div className="ai-preview-panel">
          <div className="ai-panel-heading">
            <span className="ai-step">02</span>
            <div>
              <h2>미리보기</h2>
              <p>생성된 도서 표지가 여기에 표시됩니다.</p>
            </div>
          </div>

          <div className="ai-preview-stage">
            {preview || book?.coverImageUrl ? (
              <img src={preview || book.coverImageUrl} alt={book?.title || '생성된 도서 표지'} />
            ) : (
              <div className="ai-preview-placeholder">
                <span className="ai-preview-icon">▧</span>
                <strong>{book ? book.title : '표지 미리보기'}</strong>
                <small>{book ? book.author : '도서를 선택하면 미리보기가 준비됩니다.'}</small>
              </div>
            )}
          </div>

          <div className="ai-preview-caption">
            <span>BOOK COVER PREVIEW</span>
            <span>2 : 3</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default AiCover