
import { useState } from 'react'
import BookForm from './BookForm'

function BookEdit({ book, onUpdate, onCancel }) {

  // 기존 도서 정보를 입력 칸에 불러오기
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [type, setType] = useState(book.type)
  const [content, setContent] = useState(book.content)

  // 수정 버튼 클릭
  
const handleSubmit = (e) => {
    e.preventDefault()

    // 필수 입력값 검사
    if (!title.trim() || !author.trim() ||
        !type.trim() || !content.trim()) {
        alert('제목, 작가, 장르, 내용을 모두 입력해 주세요.')
        return
    }

    // 변경된 필드만 담을 객체
    const updateBook = {}
    let isChanged = false

    if (title !== book.title) {
        updateBook.title = title
        isChanged = true
    }

    if (author !== book.author) {
        updateBook.author = author
        isChanged = true
    }

    if (type !== book.type) {
        updateBook.type = type
        isChanged = true
    }

    if (content !== book.content) {
        updateBook.content = content
        isChanged = true
    }

    // 아무것도 변경하지 않은 경우
    if (!isChanged) {
        alert('변경된 내용이 없습니다.')
        return
    }

    // 부모 컴포넌트에 변경된 정보 전달
    onUpdate(book.id, updateBook)
}

  return (
    <div className="modal-overlay">
      <div className="book-modal">

        <h2>도서 수정</h2>
        <p>도서 정보를 수정해주세요.</p>

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

          <div className="form-buttons">

            <button type="submit" className="save-button">
              수정 완료
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

export default BookEdit