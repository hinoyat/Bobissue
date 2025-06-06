import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import SearchBar from '../../../components/consumer/common/SearchBar'

const Board = () => {
  return (
    <div>
      <SearchBar />
      <div className='w-full min-h-[70vh] flex justify-center'>
        <div className='w-[70rem] my-10 flex gap-10'>
          {/* 사이드바 */}
          <div className='flex-none w-[200px] h-[300px] border border-[#6F4E37] rounded p-3'>
            <h3 className='text-xl text-[#6F4E37] mb-10'>고객센터</h3>
            <div className='flex flex-col gap-5'>
              <Link to={'/board/faq'} className='hover:text-[#6F4E37]'>
                자주 묻는 질문
              </Link>
              <Link to={'/board/notice'} className='hover:text-[#6F4E37]'>
                공지사항
              </Link>
              <Link to={'/board/question'} className='hover:text-[#6F4E37]'>
                문의하기
              </Link>
            </div>
          </div>
          {/* 본문 */}
          <div className='grow h-auto border border-[#6F4E37] rounded'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board
