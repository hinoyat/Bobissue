import React, { useEffect, useRef, useState } from 'react'
import ItemCard from '../common/ItemCard'
import API from '../../../utils/API'
import { Link } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const HomeItemList = ({ category }) => {
  const [items, setItems] = useState([]) // 상품 데이터 리스트
  // 화면 감지 관련
  const divRef = useRef(null)
  const [hasFetched, setHasFetched] = useState(false)

  // 데이터 불러오기
  const getCategoryItem = () => {
    API.get(`/categories/${category.categoryNo}`)
      .then((res) => {
        const result = res.data.result?.data.items.slice(0, 4)
        if (result) {
          setItems(result)
          setHasFetched(true)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 카테고리에 맞는 상품 불러오기
  useEffect(() => {
    // mount
    if (hasFetched) return // 이미 실행되었으면 추가 실행 방지지
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getCategoryItem()
        }
      },
      { threshold: 0.5 }, // 50% 이상 보여야 감지
    )

    if (divRef.current) {
      observer.observe(divRef.current)
    }
    // unmount
    return () => {
      observer.disconnect()
    }
  }, [])
  return (
    <div className='w-[70rem]' ref={divRef}>
      <div className='flex justify-between mb-5'>
        <p className={`text-xl ${items.length < 1 && 'text-gray-600'}`}>{category.name}</p>
        <Link to={`/category/${category.categoryNo}`}>+ 더보기</Link>
      </div>
      <div className='grid grid-cols-4 gap-3'>
        {items.map((v) => (
          <ItemCard key={v.itemNo} item={v} />
        ))}
      </div>
      {items.length < 1 && (
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-center'>
            <ExclamationCircleIcon className='w-20 text-gray-400' />
          </p>
          <p className='text-center text-xl text-gray-600'>상품 준비 중 입니다.</p>
        </div>
      )}
    </div>
  )
}

export default HomeItemList
