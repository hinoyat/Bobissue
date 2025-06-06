import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import { useParams } from 'react-router-dom'
import API from '../../utils/API'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import ItemDetailTab from '../../components/consumer/itemDetail/ItemDetailTab'
import itemDefaultImg from '../../assets/consumer/itemDefault.webp'
import { useDispatch } from 'react-redux'
import { loadingReducerActions } from '../../redux/reducers/loadingSlice'

const ItemDetail = () => {
  const dispatch = useDispatch()
  // 파라미터 정보
  const params = useParams()
  // 상품 정보 객체
  const [item, setItem] = useState({})
  // 상품 수량 정보
  const [itemCount, setItemCount] = useState(1)
  // 상품 이미지 url
  const [itemImg, setItemImg] = useState('')

  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  // 상품 수량 input handle
  const handleCount = (e) => {
    if (e.target.value < 1) {
      // 1개보다 작게 되는것 막기
      setItemCount(1)
    } else if (e.target.value > item.stock) {
      // 재고보다 많아지는 것 막기
      setItemCount(item.stock)
    } else {
      setItemCount(e.target.value)
    }
  }

  // 상품 장바구니 담기
  const itemOnCart = () => {
    const tempItem = {
      itemNo: item.itemNo,
      count: itemCount,
    }
    let cartData = JSON.parse(localStorage.getItem('cart'))
    if (cartData === null) {
      // cart 데이터가 없으면 생성
      localStorage.setItem('cart', JSON.stringify([tempItem]))
    } else {
      const check = cartData.findIndex((v) => v.itemNo === tempItem.itemNo)
      if (check === -1) {
        // 중복 상품 x
        cartData.push(tempItem)
      } else {
        // 중복 상품의 경우
        alert('이미 담겨져 있는 상품입니다. 상품 수량을 추가합니다.')
        cartData[check].count += tempItem.count
      }
      localStorage.setItem('cart', JSON.stringify(cartData))
    }
  }

  useEffect(() => {
    // mount
    dispatch(loadingReducerActions.setLoading(true))
    API.get(`/item/${params.itemNo}`)
      .then((res) => {
        setItem(res.data.result.data)
        if (res.data.result.data.images.length > 0) {
          setItemImg(res.data.result.data.images[0].imageUrl)
          dispatch(loadingReducerActions.setLoading(false))
        }
      })
      .catch((err) => {
        console.error(err)
        dispatch(loadingReducerActions.setLoading(false))
      })
    // setItem(response.data)
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex flex-col items-center py-10 relative'>
        <div className='w-[60rem] mb-20'>
          {/* 상품 카드 */}
          <div className='flex gap-10'>
            <img
              src={itemImg || itemDefaultImg}
              alt={`${item.name} 이미지`}
              className='w-[400px] h-[500px] flex-none border border-gray-300 rounded'
              onError={(e) => {
                e.target.src = itemDefaultImg
              }}
            />
            {/* 상품 정보 */}
            <div className='h-[500px] grow flex flex-col justify-between gap-5'>
              <div className='flex-none'>
                {/* 상품명 */}
                <p className='text-2xl font-medium mb-2'>{item.name}</p>
                {/* 상품 설명 */}
                <p className='text-gray-600'>{item.description}</p>
              </div>
              {/* 가격 관련 */}
              <div className='flex-none text-right'>
                {/* 원가 */}
                <p className='text-gray-500 line-through'>{addComma(item.price)}원</p>
                {/* 판매가 */}
                <p className='text-xl'>
                  <span className='text-red-500 me-5'>
                    {Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                  </span>
                  {addComma(item.salePrice)}원
                </p>
              </div>
              {/* 상품 정보 */}
              <div className='grow flex flex-col gap-5'>
                <div className='flex'>
                  <span className='w-[150px] text-gray-500'>카테고리</span>{' '}
                  <span className='text-black'>
                    {item.category?.parentName && `${item.category.parentName} > `}
                    {item.category?.name}
                  </span>
                </div>
                <div className='flex'>
                  <span className='w-[150px] text-gray-500'>판매자</span>{' '}
                  <span className='text-black'>{item.company?.name}</span>
                </div>
                <div className='flex'>
                  <span className='w-[150px] text-gray-500'>배송비</span>{' '}
                  <div className='flex flex-col'>
                    <span className='text-black'>{addComma(3000)}원</span>
                    <span className='text-sm text-gray-500'>50,000원 이상 구매시 배송비 무료</span>
                  </div>
                </div>
              </div>
              {/* 상품 수량 설정 및 장바구니 담기 */}
              <div className='flex-none flex flex-col'>
                {/* 상품 수량 설정 */}
                <div className='flex justify-end my-3'>
                  <button
                    className='border border-gray-400 p-2 rounded-s'
                    disabled={itemCount === 1}
                    onClick={() => setItemCount(itemCount - 1)}
                  >
                    <MinusIcon className='w-3' />
                  </button>
                  <input
                    type='text'
                    className='w-[35px] text-center border-y border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    value={itemCount}
                    min={1}
                    max={item.stock}
                    onChange={handleCount}
                  />
                  <button
                    className='border border-gray-400 p-2 rounded-e'
                    disabled={item.stock < 1 || item.stock === itemCount}
                    onClick={() => setItemCount(itemCount + 1)}
                  >
                    <PlusIcon className='w-3 ' />
                  </button>
                </div>
                <div className='mb-3 flex justify-between text-xl'>
                  <span>합계</span>
                  <span>{addComma(item.salePrice * itemCount)}원</span>
                </div>
                <button
                  className='w-full h-[50px] rounded text-white bg-[#A67B5B] hover:bg-[#6F4E37]'
                  onClick={itemOnCart}
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        </div>
        <ItemDetailTab itemNo={item.itemNo} />
      </div>
    </div>
  )
}

export default ItemDetail
