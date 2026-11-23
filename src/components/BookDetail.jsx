import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3000/books'

const formatDate = (date) => (date ? new Date(date).toLocaleString('ko-KR') : '날짜 정보 없음')

function BookDetail({ book, onClose, onEdit, onDelete }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBookDetail(bookId) {
      try {
        const res = await fetch(`${API_URL}/${bookId}`)
        if (res.status === 404) throw new Error('도서를 찾을 수 없습니다.')
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.')
        const data = await res.json()
        setDetail(data)
        setError('')
      } catch (err) {
        setDetail(null)
        setError(err.message === '도서를 찾을 수 없습니다.' ? err.message : '도서 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    loadBookDetail(book.id)
  }, [book])

  return (
    <div className="modal-overlay">
      <div className="book-modal detail-modal">
        <div className="detail-header">
          <h2>도서 상세 정보</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        {loading && <p className="empty-message">도서 정보를 불러오는 중입니다.</p>}

        {!loading && error && (
          <>
            <p className="empty-message">{error}</p>
            <div className="form-buttons">
              <button className="cancel-button" onClick={onClose}>닫기</button>
            </div>
          </>
        )}

        {!loading && detail && (
          <>
            <div className="detail-cover">
              {detail.coverImageUrl ? (
                <img src={detail.coverImageUrl} alt={detail.title} />
              ) : (
                <div className="cover-placeholder">
                  <strong>{detail.title}</strong>
                  <small>{detail.author}</small>
                </div>
              )}
            </div>

            <div className="detail-info">
              <h3>{detail.title}</h3>
              <p>작가 : {detail.author}</p>
              <p>종류 : {detail.type}</p>
              <p>좋아요 : ♥ {detail.likes}</p>

              <div className="detail-content">
                <strong>책 내용</strong>
                <p>{detail.content}</p>
              </div>

              <div className="date-info">
                <p><strong>생성 날짜</strong><span>{formatDate(detail.createdAt)}</span></p>
                <p><strong>수정 날짜</strong><span>{formatDate(detail.updatedAt)}</span></p>
              </div>
            </div>

            <div className="form-buttons">
              <button className="save-button" onClick={onEdit}>수정</button>
              <button className="delete-button" onClick={onDelete}>삭제</button>
              <button className="cancel-button" onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookDetail