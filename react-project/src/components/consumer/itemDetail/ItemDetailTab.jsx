import React, { useState } from 'react'
import ItemDetailDescription from './ItemDetailDescription'
import ItemDetailReview from './ItemDetailReview'
import ItemDetailQuestion from './ItemDetailQuestion'

const ItemDetailTab = ({ itemNo }) => {
  // 탭 상태 확인
  const [tabState, setTabState] = useState('description')
  return (
    <div className='w-[60rem] relative'>
      {/* 탭 bar */}
      <div className='h-[45px] grid grid-cols-3 border-b border-black mb-5 sticky top-[61px] z-10'>
        <p
          className={`flex justify-center items-center cursor-pointer ${tabState === 'description' ? 'bg-[#6F4E37] text-white' : 'bg-white'}`}
          onClick={() => setTabState('description')}
        >
          상품 상세
        </p>
        <p
          className={`flex justify-center items-center border-x border-gray-400 cursor-pointer ${tabState === 'review' ? 'bg-[#6F4E37] text-white' : 'bg-white'}`}
          onClick={() => setTabState('review')}
        >
          리뷰
        </p>
        <p
          className={`flex justify-center items-center cursor-pointer ${tabState === 'question' ? 'bg-[#6F4E37] text-white' : 'bg-white'}`}
          onClick={() => setTabState('question')}
        >
          문의
        </p>
      </div>
      {tabState === 'description' ? (
        <ItemDetailDescription />
      ) : tabState === 'review' ? (
        <ItemDetailReview itemNo={itemNo} />
      ) : (
        <ItemDetailQuestion itemNo={itemNo} />
      )}
    </div>
  )
}

export default ItemDetailTab
