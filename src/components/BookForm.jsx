
function BookForm({
  title,
  setTitle,
  author,
  setAuthor,
  type,
  setType,
  content,
  setContent,
  coverImageUrl,
  setCoverImageUrl
}) {
  return (
    <div className="book-form">

      {/* 책 제목 */}
      <label>책 제목</label>
      <input
        type="text"
        placeholder="책 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 작가 */}
      <label>작가</label>
      <input
        type="text"
        placeholder="작가 이름을 입력하세요"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* 도서 종류 */}
      <label>도서 종류</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {/* 문학 및 장르소설 */}
        <option value="일반 소설">일반 소설</option>
        <option value="로맨스">로맨스</option>
        <option value="판타지 / 무협">판타지 / 무협</option>
        <option value="추리 / 미스터리 / 스릴러">추리 / 미스터리 / 스릴러</option>
        <option value="공포 / 호러 / 오컬트">공포 / 호러 / 오컬트</option>
        <option value="SF">SF</option>
        <option value="라이트노벨">라이트노벨</option>
        <option value="시 / 희곡">시 / 희곡</option>
        <option value="에세이">에세이</option>

        {/* 인문 및 지식 분야 */}
        <option value="경제 / 경영 / 재테크">경제 / 경영 / 재테크</option>
        <option value="자기계발">자기계발</option>
        <option value="인문 / 철학 / 역사">인문 / 철학 / 역사</option>
        <option value="사회 / 정치">사회 / 정치</option>
        <option value="과학 / 기술">과학 / 기술</option>

        {/* 문화 및 생활 */}
        <option value="예술 / 대중문화">예술 / 대중문화</option>
        <option value="실용 / 취미">실용 / 취미</option>
        <option value="여행">여행</option>
        <option value="만화 / 웹툰">만화 / 웹툰</option>
        <option value="어린이 / 청소년">어린이 / 청소년</option>
        <option value="기타">기타</option>
      </select>

      {/* 책 내용 */}
      <label>책 내용</label>
      <textarea
        placeholder="책 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 표지 이미지 주소 */}
      <label>표지 이미지 URL</label>
      <input
        type="text"
        placeholder="이미지 주소를 입력하세요"
        value={coverImageUrl}
        onChange={(e) => setCoverImageUrl(e.target.value)}
      />

    </div>
  )
}

export default BookForm
