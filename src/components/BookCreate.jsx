import { useState } from 'react'
import BookForm from './BookForm'

function BookCreate({ onCreate, onCancel }) {

  // 입력 데이터 관리
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [type, setType] = useState('로맨스')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  // 등록 버튼 클릭
  const handleSubmit = (e) => {
    e.preventDefault()

    if (title.trim() === '' || author.trim() === '' || content.trim() === '') {
      setError('제목, 작가, 책 내용을 모두 입력해주세요.')
      return
    }

    if (title.trim().length > 50) {
      setError('제목은 50자 이내로 입력해주세요.')
      return
    }

    if (author.trim().length > 30) {
      setError('작가 이름은 30자 이내로 입력해주세요.')
      return
    }

    setError('')

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      type: type,
      content: content.trim(),
      coverImageUrl: ''
    }

    onCreate(newBook)
  }

  return (
    <div className="modal-overlay">
      <div className="book-modal">

        <h2>새 도서 등록</h2>
        <p>새로운 책을 내 서재에 추가해보세요.</p>

        <form onSubmit={handleSubmit}>

          <BookForm
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            type={type}
            setType={setType}
            content={content}
            setContent={setContent}
          />

          {error && <p className="form-error" style={{ color: '#d9534f' }}>{error}</p>}

          <div className="form-buttons">
            <button type="submit" className="save-button">
              등록
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              취소
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default BookCreate