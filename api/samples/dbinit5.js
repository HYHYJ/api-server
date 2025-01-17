import logger from '../utils/logger.js';
import dotenv from 'dotenv';

// 기본 .env 파일 로딩(package.json에서 로딩함)
// dotenv.config({ path: '.env' });
// 환경별 .env 파일 로딩
logger.log('NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV) {
  dotenv.config({ override: true, path: `.env.${process.env.NODE_ENV}` });
}

import db, { getClient, nextSeq } from '../utils/dbutil.js';
import moment from 'moment';

async function main() {
  await db.dropDatabase();
  logger.info('DB 삭제.');
  await initDB();
  return 'DB 초기화 완료.';
}

main()
  .then(logger.info)
  .catch(logger.error)
  .finally(() => getClient().close());

async function initDB() {
  // 시퀀스 등록
  await registSeq();
  console.info('1. 시퀀스 등록 완료.');

  // 회원 등록
  await registUser();
  console.info('2. 회원 등록 완료.');

  // 상품 등록
  await registProduct();
  console.info('3. 상품 등록 완료.');

  // 장바구니 등록
  await registCart();
  console.info('4. 장바구니 등록 완료.');

  // 구매 등록
  await registOrder();
  console.info('5. 구매 등록 완료.');

  // 후기 등록
  await registReply();
  console.info('6. 후기 등록 완료.');

  // 코드 등록
  await registCode();
  console.info('7. 코드 등록 완료.');

  // 북마크 등록
  await registBookmark();
  console.info('8. 북마크 등록 완료.');

  // config
  await registConfig();
  console.info('9. config 등록 완료.');

  // 상품 조회
  await productList();
}

function getDay(day = 0) {
  return moment().add(day, 'days').format('YYYY.MM.DD');
}
function getTime(day = 0, second = 0) {
  return moment()
    .add(day, 'days')
    .add(second, 'seconds')
    .format('YYYY.MM.DD HH:mm:ss');
}

// 시퀀스 등록
async function registSeq() {
  const seqList = ['user', 'product', 'cart', 'order', 'reply', 'bookmark'];
  const data = seqList.map((_id) => ({ _id, no: 1 }));
  await db.seq.insertMany(data);
}

// 회원 등록
async function registUser() {
  var data = [
    {
      _id: await nextSeq('user'),
      email: 'admin@market.com',
      password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
      name: '무지',
      phone: '01011112222',
      address: '서울시 강남구 역삼동 123',
      type: 'admin',
      createdAt: getTime(-100, -60 * 60 * 3),
      updatedAt: getTime(-100, -60 * 60 * 3),
      extra: {
        birthday: '03-23',
        membershipClass: 'MC03',
        addressBook: [
          {
            id: 1,
            name: '집',
            value: '서울시 강남구 역삼동 123',
          },
          {
            id: 2,
            name: '회사',
            value: '서울시 강남구 신사동 234',
          },
        ],
      },
    },
    {
      _id: await nextSeq('user'),
      email: 's1@market.com',
      password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
      name: '네오',
      phone: '01022223333',
      address: '서울시 강남구 삼성동 456',
      type: 'seller',
      createdAt: getTime(-50),
      updatedAt: getTime(-30, -60 * 60 * 3),
      extra: {
        birthday: '11-23',
        membershipClass: 'MC01',
        addressBook: [
          {
            id: 1,
            name: '회사',
            value: '서울시 강남구 삼성동 567',
          },
          {
            id: 2,
            name: '학교',
            value: '서울시 강남구 역삼동 234',
          },
        ],
      },
    },
    {
      _id: await nextSeq('user'),
      email: 's2@market.com',
      password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
      name: '어피치',
      phone: '01033334444',
      address: '서울시 강남구 도곡동 789',
      type: 'seller',
      createdAt: getTime(-40, -60 * 30),
      updatedAt: getTime(-30, -60 * 20),
      extra: {
        confirm: false, // 관리자 승인이 안됨
        birthday: '11-24',
        membershipClass: 'MC02',
        addressBook: [
          {
            id: 1,
            name: '회사',
            value: '서울시 마포구 연희동 123',
          },
          {
            id: 2,
            name: '가게',
            value: '서울시 강남구 학동 234',
          },
        ],
      },
    },
    {
      _id: await nextSeq('user'),
      email: 'u1@market.com',
      password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
      name: '제이지',
      phone: '01044445555',
      address: '서울시 강남구 논현동 222',
      type: 'user',
      createdAt: getTime(-20, -60 * 30),
      updatedAt: getTime(-10, -60 * 60 * 12),
      extra: {
        birthday: '11-30',
        membershipClass: 'MC02',
        address: [
          {
            id: 1,
            name: '회사',
            value: '서울시 강동구 천호동 123',
          },
          {
            id: 2,
            name: '집',
            value: '서울시 강동구 성내동 234',
          },
        ],
      },
    },
  ];

  await db.user.insertMany(data);
}

// 상품 등록
async function registProduct() {
  var data = [
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍도넛',
      options: ['자색고구마(보라색)', '시금치(초록색)', '단호박(노란색)'],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202205/c8a90a8b833ba40366a4fd34e955b590.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/d223b65ad2daf105ee11cc874f89fb37.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/3e2ed0105b93601e5bc5eadc2d7ea3fc.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202205/f265e9606fd29913466e18bf09bddcaa.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/d223b65ad2daf105ee11cc874f89fb37.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/3e2ed0105b93601e5bc5eadc2d7ea3fc.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/1395a0006745dd4ff464cea769f7c80f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/01e1173192083f24b2c5e5e4e038de17.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/a02487f9d646ee48f9b9585afa340a9f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/e9abcfcb0b79e733eec07296b744af1e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/d0c6a78dcdd7936a97a165b85c2e357c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/9f1dc859794c418c22c058ba133ff5d0.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍도넛</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '고구마 쏙 마들렌 6P',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202012/d43b0de7333bd9958b2eecd11d71c595.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/beb59e159c2cc6fffe9126e5b4c86def.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/bada79c8e32124b2c3f3edb916ab7a76.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202012/8f796832549eb8e060924e58c6ba2b3d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/beb59e159c2cc6fffe9126e5b4c86def.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/bada79c8e32124b2c3f3edb916ab7a76.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230305/adf389238001b958be8b02d18cc81e9a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/296c5b2e0b3a80101b486f30c1827d1d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/56495436871725704ff6b4afdd3d0561.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/df60758eba2235bd3e59b67f1faa00e3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/a2ed778c7070e10070c7ccca79f4a837.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/9a459cfaca8c890384303c55c02a8095.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>고구마 쏙 마들렌 6P</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '단호박 무스 타르트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202012/0740fcbf4d3e6e312f6b79c96dc7c257.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/b9f4fec880e7c3928b5b773086e49681.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/5060e7aa293da250c16d5d3897e1ff85.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202012/f19a97e61b5d857c949e8a1294f5f267.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/b9f4fec880e7c3928b5b773086e49681.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/5060e7aa293da250c16d5d3897e1ff85.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/b5db80b0702c60f30defad43221300b8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/520447ccd1244d7b9244178045614729.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/81e6ee66cab030861625c22e95848bfd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/63555fde7f5e7c0fe977195495326cc2.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/89ac11ed85ae03147c1b5a39e0a33352.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/44e97d41ddb04c868087f4b46a1dd3a2.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>단호박 무스 타르트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '당근 와플',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202012/ed1921cb5ab43b150901ded7fc783072.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/e3b713c1ade84a441e2eba0032150024.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/abddaa48ac544c343bcb04542f8d2d1e.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202012/54b4bb62d650d61e9c87d493b85b0f06.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/e3b713c1ade84a441e2eba0032150024.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/abddaa48ac544c343bcb04542f8d2d1e.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/fa51430ede1421941b95d2bfd34a8a3e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/8a7301487bc92a5ea8530f24ea6b6e77.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/e8ad13a19c1a7616eb1232148db1011a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/3606b8c5d094b74024a721a8ef70b5bd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/53f3ba812cf78076fa551d2389cd6c0a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/c6830d845d071d29c53686f5f86bc210.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>당근 와플</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리 핫도그 (대)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202112/7adb945ee4e648b1142667e6cf58d05a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/bd3aafae9c6b611a8c1e72e5967278e9.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/8f87b80453f33b87cc87720138cce8a0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fb76ee1476cfb94c64f52831f55a6082.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/987fc91eae2b10aa29762fec02da627e.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202112/dd7df883482a33eeb35531357064785e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/bd3aafae9c6b611a8c1e72e5967278e9.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/8f87b80453f33b87cc87720138cce8a0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fb76ee1476cfb94c64f52831f55a6082.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/987fc91eae2b10aa29762fec02da627e.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230515/6fe8ebd8a461ad9fa928aa0dc2696c9e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/e62f0864d9d44d7c426e4526da5ae6fe.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/95eed9e876414fcb5165f9cc23c9075d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/caca27624b35bf580096546da4535856.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/eecc3de2a9b091bbe20a83dbe363b8f5.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리 핫도그 (대)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '콤비네이션 타르트',
      options: [
        { 사이즈: '기본 9.5cm' },
        { 사이즈: '케이크 대용 12cm (+5,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202012/8e6738607993c7cbe4b3b724072677e0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202012/ce2f2ad2acbcb9b993d03113ebf09933.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/421bb9f2cd73a685405a27c2c7c4c392.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/e76f4c46fda5c42a3a8d60f668529109.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202012/1c82959179fc6af4d445cf4352b0a45c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202012/ce2f2ad2acbcb9b993d03113ebf09933.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/421bb9f2cd73a685405a27c2c7c4c392.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/e76f4c46fda5c42a3a8d60f668529109.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220625/6a07153ffae11f42394206639b5bccb6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220625/4a8e170accd6ebc087c8f0318f4a6b6a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220625/d61cd9905259cf3afc919ff1b88c98ad.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220625/a081a26a52f5b4200e38ed50a4242161.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220625/c8ddf44d252ed464da985978f507433c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220625/f72ac49a5c6b2ef23a70138357826d6c.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>콤비네이션 타르트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '단호박 머핀 2P',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202102/53b029a9a7e0f51578fa17f02a39f233.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/d87ae97ad26735aaed4be5e4e60bc39b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/11aa0f1cad284c7d9c11ada9a09e513f.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202102/ee96efc8a0ed0476a4c3ee043c273155.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/d87ae97ad26735aaed4be5e4e60bc39b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/11aa0f1cad284c7d9c11ada9a09e513f.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230305/21072e5e8dc98401b846b14925b27868.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/f020656d599acbbb4dc325813d551550.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/caa6e37d04ec1f644e90dc245be3661f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/4707ae8097570964aba527be1503d677.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/e55c8a5144fa99b4989100054e7e5e97.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/baccd00cb159db7ef344170ccd45ffba.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>단호박 머핀 2P</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 12000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍치킨',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/faa22208906b96be2b548f02ada28ed3.jpg',
        '//ggaggamukja.com/web/product/extra/big/202106/dd8d6ca6b62e383acdbb98dc955e479b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202106/5eb5b3afdf4db0b951a5b993bf1a1098.jpg',
        '//ggaggamukja.com/web/product/extra/big/202106/372ee266ba3694ec6cd6605473c0b5ec.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/4b1e6d24f7b302e72046b34750d7259a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202106/dd8d6ca6b62e383acdbb98dc955e479b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202106/5eb5b3afdf4db0b951a5b993bf1a1098.jpg',
        '//ggaggamukja.com/web/product/extra/small/202106/372ee266ba3694ec6cd6605473c0b5ec.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8b07687e16b2f8e4d992e941608a3ccf.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/7c4d7469db636dc83450d2dc3a9897ad.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6a743e915c2b18b7ce4cb36420b0bc99.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/43396ece6cb25d57f11ae80fc1f60690.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/24bb2a4c12000604d41b2bea96edaa48.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8b625dbcaa2d819f27aab4ba84895a9e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/067585ed4730522d56b633bdf426adc6.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍치킨</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍김밥',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/885223ea2c8094f00d04369add009393.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/ceb3ca10cbe58a89f80308538e88db2a.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/b7d18431b28dd68d13bd6316a24cf9e2.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/ceb3ca10cbe58a89f80308538e88db2a.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230518/98f05710cdeb624f6c5593bf3f0f45ec.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/b9bcd13d6a2da2b31530f6bf13b35cbd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/094696e4088ee271603d3692dc7a9b27.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/0be82999b488b6e1d44fa4f99f6e0644.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/2420adb24c1c3f5a8382951d81568dd4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/0d6fd7d2de0fda5ce8e054ce80a23c90.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍김밥</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '코코넛 치즈볼',
      options: [
        { 용량: '단품' },
        { 용량: '5팩(5% 할인) (+15,000원)' },
        { 용량: '10팩(10% 할인) (+32,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/18a2e36960287be027bdc83940350d50.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/ac3f42ec81670a739e05ec0092a0ef4d.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/726f254623263a278f1dcd55f13ea90f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/ac3f42ec81670a739e05ec0092a0ef4d.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/7dd67c37f5387e3a71d3cceb3eca7a47.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c6e3c73ba5c846e87b30ed7d917ae3b9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/2775ff7d7dc3d26222014fe87c1f5fd2.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3e017c2cfafcd4e134b72b84a44e4aeb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/78501d4e6bce4eb9ccca8cfff7d1e336.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6a9bbd05cbadd6a85f34bb6de0673e94.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>코코넛 치즈볼</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '치즈 호두과자 6P',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202205/4297c3aa5ac5a96200aa5c256d79fdaa.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/fe5df30e752344a0a117ac3277b1fc93.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/87b2e387501f5a5095277619080f0b4f.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202205/44979155142869b8638cadcd08cdfb10.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/fe5df30e752344a0a117ac3277b1fc93.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/87b2e387501f5a5095277619080f0b4f.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230305/e56665df31c86b644b04843711b1ec2d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/b0dc5a87b72b09cf98abda945b02b35a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/a73849830f13c25d0cfc1eb304d5379d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/9a3fb6cc88e67ca549317ff6b432ea6a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/1eb0c22afbc1bbf323aaf52b47858747.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230305/bb27c421486869527b520511d221d27b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>치즈 호두과자 6P</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 14000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍피자',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/ff41e97c0152a925ee4e5e4dadc5d6aa.jpg',
        '//ggaggamukja.com/web/product/extra/big/202106/a9faef64dd57734fd2a236038d59e791.jpg',
        '//ggaggamukja.com/web/product/extra/big/202106/8a502b3aa0eb6d8f9cd204582f2ec16b.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/077f3a64d05bb2b931e0dd4fe9bd641b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202106/a9faef64dd57734fd2a236038d59e791.jpg',
        '//ggaggamukja.com/web/product/extra/small/202106/8a502b3aa0eb6d8f9cd204582f2ec16b.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/534845abd2fb8fa6563f9ace0de8aefd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/1fccd7123837c15029dd58644a12d2d8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a2a4cda2534b660cce0335882cbd67f3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3498b4ce0ad146afbab82e8ca2e64b4e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/4606853190eda83586808d3d0985ebee.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/539d07a36bb4a40e3ff4ce89048a1410.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/e1ebcef7c2bf92f34fef83cc5d0af0ff.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍피자</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 9500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '피크닉 도시락 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202307/5a9cfa0e0b7fa21e0a30ca4c0fe967c6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/32e4798fb99f03a686c7d956f888cf3e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/c813f3774535ea05f2cba07a64407701.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/98ab3e9dfdf61537a5672a3e53591972.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/8d611923b24901201892ea487aa26b9f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/a6b5927060a6b5d1f38246b635e78fcb.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/70511074c0f07a3914c3a8003532fcc6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/1cca6ce4bde1c8ff7d47cc25b828cb12.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202307/d64257586ae41b2308778821c4a4d763.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/32e4798fb99f03a686c7d956f888cf3e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/c813f3774535ea05f2cba07a64407701.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/98ab3e9dfdf61537a5672a3e53591972.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/8d611923b24901201892ea487aa26b9f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/a6b5927060a6b5d1f38246b635e78fcb.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/70511074c0f07a3914c3a8003532fcc6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/1cca6ce4bde1c8ff7d47cc25b828cb12.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230724/78d6bec6f1451cc3f24010c18be798fd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/45ddab7661539f6b4cc305a1d5e88335.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/ab1108a46fe63b2188b4cf280373a5a7.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/c3018b3dd57030f84c2116d277ab0bdf.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/380dba9e5800e2abe119faa6e4a5b22e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/f1eab0487cfd199d39726180e26fa486.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/bb1303a7040215553aa4c5273809d79f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/a8cea7bbc7f1246311f00be249dc058a.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>피크닉 도시락 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 8000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍돈까스',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/9a0d91db522758c9ba7e3a764acca74e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/2d331c8980222af7b3faeae9efdaeab6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/9cd1e8d4cd0d1dbd11d22941157e38ad.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/328cda91e825f00e46dc7bc08f65110b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/439efb4631f53fea75d646b65e30c8c7.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/57c5da5b02f13fdd22cf697e06e30dac.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/2d331c8980222af7b3faeae9efdaeab6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/9cd1e8d4cd0d1dbd11d22941157e38ad.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/328cda91e825f00e46dc7bc08f65110b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/439efb4631f53fea75d646b65e30c8c7.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/0371b10f06aff2dc2765ad26505102c1.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/33f238cd33d8418ad18f793ebbd5dbfd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/11fbad51b1a60f06aa68a9ce7a0947d6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d3e94fa5918b2f24818a2151e509621e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d1caa7d599487e36b0f944d206ac1aed.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3b8ac6e6cb41897b708a26180dbdede3.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍돈까스</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 12000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '특별한 날엔 케이크',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/f4214eea999cd049e8dd9feefbcf7c90.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/d696664674894ea9d8cb1d72f8e588b1.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/f9adb139cd25d5bf0a74f1104f7b3ba0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/857759c651d2be716aa70a1f3d57db40.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/f7b4742048bdb93f60712642b07f942a.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/cc458b1e94a680cfc32bebeb5c4d8beb.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/d696664674894ea9d8cb1d72f8e588b1.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/f9adb139cd25d5bf0a74f1104f7b3ba0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/857759c651d2be716aa70a1f3d57db40.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/f7b4742048bdb93f60712642b07f942a.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230317/7d5e29429d4350618a395dd5934f900f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/adc1150136771740b502f515c5ef409d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/d4dec8e511301775e4ca3c5fe998dec3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/1f10d488e80a73003e8636481dfe935e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/db1485caea74c0dc3c10aa45c8748a08.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/5a3c34e0c45a62091d6f280ed8aa48d2.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>특별한 날엔 케이크</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 23000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍피자 멍치킨 피크닉 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/10e4612462adca4ed8178f25e12e8083.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/b83a3d8f88f030b4f28e0987c83020de.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/121156cafdf7bc4610ac0c3b49696a3a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/266f98400d5d3e53e65df78951412c46.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/ef0c1559d727feaec2f7223cd36c04f6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/7adfc1b453f4b700e30238f6556f4245.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/4268fd08fee82b7e319f2eb269e01a1e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/411dfcf850dd267c4703461edd21e8c0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/28af8c9ff75fdaad88632da271232e12.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/bba1e510035257013c19be281d17f0f7.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/b83a3d8f88f030b4f28e0987c83020de.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/121156cafdf7bc4610ac0c3b49696a3a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/266f98400d5d3e53e65df78951412c46.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/ef0c1559d727feaec2f7223cd36c04f6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/7adfc1b453f4b700e30238f6556f4245.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/4268fd08fee82b7e319f2eb269e01a1e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/411dfcf850dd267c4703461edd21e8c0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/28af8c9ff75fdaad88632da271232e12.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230313/0614fa8fa31563099cdb94289728e69f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/02f806bc0aa8bafda701001846d511df.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/15f6639969a121a245e8cd20d09b456d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/6d8c20d032a4fd939ba5f9ae51188496.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/cf34df9a03891c8ac3707314d09fa474.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/0d5cfe904a9161110202b508284f1a91.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/a18e8d305099a5e5afd59a54bb9c8e17.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/8b64a55f5e0b8fd2063b70bc84b81b1b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/ec916e8b78317da9fa98c4882e6c322b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/3b9ca86c99b8133471e75c3cb31bf8d6.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍피자 멍치킨 피크닉 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 9500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '바캉스 도시락 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202308/5108e846edd53fd2907958444aeb5107.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/0bbfa406cbb510881d717ff98c8d7a5f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/0972097b71561ba5661f95bb10380f92.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/fcc3e249d30c3977a164d6c43c6cfe5f.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202308/b465487ae174e3da5710f52d7b2cf10c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/0bbfa406cbb510881d717ff98c8d7a5f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/0972097b71561ba5661f95bb10380f92.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/fcc3e249d30c3977a164d6c43c6cfe5f.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230802/90cda67a811e8a33f1feae0ad2b39abd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/6e0bcf88fcdf85ed9df61f56ad8d6be8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/8cbd1845969228219c15156da5094363.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/8122bf4a4e3abc86e1717558bb17912e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/dfc002d665b3532088a0178fb331e82f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/67d711419097b494d4ebc9af461855cb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/36159addccaaf6f9494e84f1071964fa.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>바캉스 도시락 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 37000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '특별한 날 간식세트 2023',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202307/90e56026066aa0740e415c143de27cdb.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/773f85817d07dfa8edd381fa69897983.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/2c80757a18b9cfb1358fe83847b5ff65.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/d971cb9dbdbc59419f826a9ae21b8603.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/0f30794210cb075bde753776f59b5249.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/4a38b8e6ac2982ec3b27739fc7b14453.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/111a1147f2cee6ff71a3d63cf3fce4b4.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/0d7928f1af3cc95620fdb40d968cf1c6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/6e3f5bca1e2e2b64efe09844ccffb072.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/33946b59718bd45fa64f40cdd24d37c9.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202307/3027ef04472ab98abbb07572104df04b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/773f85817d07dfa8edd381fa69897983.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/2c80757a18b9cfb1358fe83847b5ff65.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/d971cb9dbdbc59419f826a9ae21b8603.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/0f30794210cb075bde753776f59b5249.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/4a38b8e6ac2982ec3b27739fc7b14453.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/111a1147f2cee6ff71a3d63cf3fce4b4.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/0d7928f1af3cc95620fdb40d968cf1c6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/6e3f5bca1e2e2b64efe09844ccffb072.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/33946b59718bd45fa64f40cdd24d37c9.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230724/d37841423c8add8b4e817824803a14fc.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/b8b1858e25add880288bcda3698c1d6e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/3db7777bb8623e8e5ac214fd4edb2151.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/bfade7efa396907f6d75b6d195a5c3bf.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/794a0d84f9725908fdeab18aca667021.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/0f53917d55a075d9f0013e2bcf2822c5.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/5bf53fa741505e7c9b5c31492d3aa0e4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/6e59834811780df1151abb6f900d172b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/a14549e6ccd335646e7e6a9ba9fc8e3b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>특별한 날 간식세트 2023</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 37000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '까까묵자 생일 파티 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202308/7626c41a25d53564cf7fd0c4469e48fd.png',
        '//ggaggamukja.com/web/product/extra/big/202308/912732c3e402df6d05dd7d0793441d13.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/adf985e3575cb5df8a86da022c09d67e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/ec6adaac9098d2b7be79348424e628c3.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/585226c43492eadfeb7c699a0385da57.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202308/d2530f72313d8478492baf04666f4df6.png',
        '//ggaggamukja.com/web/product/extra/small/202308/912732c3e402df6d05dd7d0793441d13.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/adf985e3575cb5df8a86da022c09d67e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/ec6adaac9098d2b7be79348424e628c3.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/585226c43492eadfeb7c699a0385da57.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230802/c1fe535e031f4fdebd2d7faf972ba805.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/4f653a5607c041a150779898b6c6787f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/d2604d536f2669d23f47cedcfe79240d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/6d12a056e6f5dd671a5618991ecaa0c9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/46083c79a88f6216c35a7d9f3e6c4e14.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/22aa30d36e70a0d07be5810eb5e6422d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/251fbdf9815028433cfb0b832761f7d9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/65a0b466a8339c1ad5d9f5bf5d3472e3.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>까까묵자 생일 파티 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '곰돌이 주먹밥 3p',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202307/3a35082ddc35302a4823f68ffd5ba857.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/54f267802d5ff9cc37a4c092ba0c6ca8.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/3ab8f19a54538fcab6f6e105ff341d8d.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/e923702ff09baa7a9ed8194fc727b5b9.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202307/2fdf3530426cd385db62aa772fc3e711.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/54f267802d5ff9cc37a4c092ba0c6ca8.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/3ab8f19a54538fcab6f6e105ff341d8d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/e923702ff09baa7a9ed8194fc727b5b9.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230724/02f3e209504db8f5e1ab9c9e6bec18a9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/6901f5c6edb5b1f1cc7e39e461f19772.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/dd4016ae268fa2485a1aeeaeea27f117.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/cbe9e8d0a8cb311f4ee4d68c0d1e7380.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/858d717d3bd85702c692bc5202f7c833.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/705e5bfcd8615e181fe234e060cf92d6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/dc17785b537a141a0e03fcc2fed26e25.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230724/739579de6302ffb62f9c910b6d9426a0.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>곰돌이 주먹밥 3p</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 35000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '까까묵자 X 스너플 도그비어 캠핑 세트',
      options: [
        { '세트 선택': '피자+치킨+도그비어' },
        { '세트 선택': '피자+도그비어 (-12,000원)' },
        { '세트 선택': '치킨+도그비어 (-14,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202308/d85b8fbf57e1ba9093adc4bc0932f09a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/e85ac274e9d0dc16313e8569ff130c98.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/01c8a8f7792bc48d005959ccbbd26e86.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/809ca66fcf42d83220be466bebf6173e.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202308/c3f417c296b221783eb203c48d849184.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/e85ac274e9d0dc16313e8569ff130c98.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/01c8a8f7792bc48d005959ccbbd26e86.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/809ca66fcf42d83220be466bebf6173e.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230905/ce9a38e3ab550abf1f2b50cf405e5413.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/a5fcf584b68e851a7f5cdf91faf38238.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/bcff16abbeaf9b7f18eff1bdedba9829.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/a78eff389e29734350990cd7a3ed6762.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/477abd54dadb9f9374247a9b9926b966.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/4cd218ad9406c48c503b593f902f7267.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/d1c7cbae97ab904af0adf31b4df5675d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/28e91f51195db51d18dc2b069270f043.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/0d5ceffd7d5a1779ebe7ebbce3fb15e4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/7cff1bc13ff1209f3e1064e34ee98724.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>까까묵자 X 스너플 도그비어 캠핑 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 29000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '베이커리 파티 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202308/6946f1239a991a71f2013da01452e32a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/25cf9ecf468b854a061a0251c744c4c5.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/011c3b877a3ac07564d901063ef729bb.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/cd077eb700ebbc43f2c5476260023fa6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/cb5d41588b5e8bbb5af7fe85f8470c9e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/ed7c970fbb9467a2d5d7c97dd25b90ae.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/d5fb6f964b5f51c96bfde54ec6abea04.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/3d9090389a768af35a3ac79130b66193.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/fc172e489e752a5615e87ed73372e160.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202308/cd5ab40e24a2ac575be491ae8f4afbd0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/25cf9ecf468b854a061a0251c744c4c5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/011c3b877a3ac07564d901063ef729bb.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/cd077eb700ebbc43f2c5476260023fa6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/cb5d41588b5e8bbb5af7fe85f8470c9e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/ed7c970fbb9467a2d5d7c97dd25b90ae.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/d5fb6f964b5f51c96bfde54ec6abea04.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/3d9090389a768af35a3ac79130b66193.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/fc172e489e752a5615e87ed73372e160.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230802/a5ac35c8ef67291232590819124261a2.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/da211b35cbbee687e9b50f874b045f26.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/def3c30fd25d7f0092c30061011e84eb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/09b129d21a10b43c0383ed53dbc4e745.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/2c5dae8bb89e4f3daf48e3c40e0720bf.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/eb14896513d66ebc758995568d84f2a0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/b86e51a27fec8f6e6ca15203c01f47b5.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/37fdb8f97606283c71a865ec73eba35f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/a201eb8c884f1985942f4ef2601761d1.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>베이커리 파티 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 15500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '까까묵자 X 스너플 콜라보 세트',
      options: [
        { '세트 선택': '조각피자+조각치킨+도그비어 캔' },
        { '세트 선택': '조각피자+도그비어 캔 (-3,500원)' },
        { '세트 선택': '조각치킨+도그비어 캔 (-4,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202309/5ba45f0712c3d4ca1c9125ff445ea801.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/d16544838014204bfbf2a0b2432f7554.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/66e6a1b29c37c525a511ac0624a2538a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/d3228c239cc92c3d38770b536ad70449.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202309/3bed95d41235d7d42a875c9e60d18c07.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/d16544838014204bfbf2a0b2432f7554.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/66e6a1b29c37c525a511ac0624a2538a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/d3228c239cc92c3d38770b536ad70449.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230905/978e20931cb112b1546b42970e5cf330.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/a5fcf584b68e851a7f5cdf91faf38238.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/bcff16abbeaf9b7f18eff1bdedba9829.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/a78eff389e29734350990cd7a3ed6762.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/4cd218ad9406c48c503b593f902f7267.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230905/472b30db1f308df5a922423c1052f785.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/d1c7cbae97ab904af0adf31b4df5675d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/0d5ceffd7d5a1779ebe7ebbce3fb15e4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230806/7cff1bc13ff1209f3e1064e34ee98724.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>까까묵자 X 스너플 콜라보 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 43000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '풀패키지 파티 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202308/470fd82f6a66297c201522014ab6a097.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/0f9a55e934af6af866fd85271664b15b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/f9bdd66bb5baefb1a06b81c69d2ec5a7.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/fa3b2ed4607fc335b73d7f170f398fe4.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/32a9bbe2c2781a3a59b12415807c9e9f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/c09998d91e5b0027cf62208739d17ed6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/43bdf214ee8690f3b5ceb840bbac79b4.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/9a795a9c4d7e552182289ac1288ab9a4.jpg',
        '//ggaggamukja.com/web/product/extra/big/202308/d7d108fd2b667c40f2a7416ba16b28cc.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202308/ffaa56b06f03927d0921c4fa09cf5571.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/0f9a55e934af6af866fd85271664b15b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/f9bdd66bb5baefb1a06b81c69d2ec5a7.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/fa3b2ed4607fc335b73d7f170f398fe4.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/32a9bbe2c2781a3a59b12415807c9e9f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/c09998d91e5b0027cf62208739d17ed6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/43bdf214ee8690f3b5ceb840bbac79b4.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/9a795a9c4d7e552182289ac1288ab9a4.jpg',
        '//ggaggamukja.com/web/product/extra/small/202308/d7d108fd2b667c40f2a7416ba16b28cc.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230802/b52c6ffe264ebe0ccfc76d61e6b299c7.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/2a3ca406a23f78655bb88905e10a58d0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/7c5fab66a482471f21aa38d023416742.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/0233e2fc77729a3693f7694fd2e60b05.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/61a34b55b549419bb1d386bd92444fef.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/119dc9212e964295b91e0fdab1ad3277.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/6a1bfece6225e18e8b176349e46a65bc.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/6bc56115929e1975496838c7ecbda0d2.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230802/e5325f843a3557f88f742576ce8929d5.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>풀패키지 파티 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 14000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '소풍 도시락 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/ff18ad6bd94837694c095f4b4e308f56.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/32e4798fb99f03a686c7d956f888cf3e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/e45bb01fbdab91f1f1e70a3a80e34716.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/a2058bfb51d54279dc611c5bc3bd381c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/66eebe778658b39f1cc7fc7ec6ef565f.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/2e83f21ae3488352e2d9bdb764cd032f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/32e4798fb99f03a686c7d956f888cf3e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/e45bb01fbdab91f1f1e70a3a80e34716.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/a2058bfb51d54279dc611c5bc3bd381c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/66eebe778658b39f1cc7fc7ec6ef565f.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230317/0ebe5a6938a12cb4d2ff150523978917.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/3cc2863934592d1275e49d74f5674f24.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/a18d4f95f097403405642acd0aee4f81.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/905153b2c622b7e3a0b041c7aad18226.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/1d5348d3cc0f5909984f9fd0912078ed.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/30b08ec94e0bf4965df89d8d2bef0dfb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230317/644a565263964ed6b50615a2843e6467.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>소풍 도시락 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-dessert'],
        sort: 1,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '닭가슴살 테린',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+14,000원)' },
        { '용량 선택': '10팩(10% 할인) (+28,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202102/54f9c3a6dbfb72fb4a14df9ffbedf540.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/ffcc8452a77c9e12b19c15f2b0c6b74a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/218462e4b1aa57e283a290828eb517c4.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202102/2297b5cb2ef834ba3a8fb00679b0b67a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/ffcc8452a77c9e12b19c15f2b0c6b74a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/218462e4b1aa57e283a290828eb517c4.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/b5f4a459f6d26f96ce83af0414324f55.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/f8fe2b3c4b8c8bec4d60201441e450e7.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/dfd83656a80d848905f6287ea79a9b7f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/03a00c230d24bf4a62d3acd6418f62a4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/7b9b066d28bc56310396a9117f6e40ce.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5f9ad6c72d5836b2ab787a61ce6fa0ce.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>닭가슴살 테린</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '한우 미트볼',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+18,750원)' },
        { '용량 선택': '10팩(10% 할인) (+40,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/f8999fa26ba0b517725642c613f93323.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/2ea57e843526b9c7ed30a4c8e70ad46f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/28aa8a79f3b6604ff1e6809c691fa4bc.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/c64fbaec301e6d8a26ab49c87315c390.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/2ea57e843526b9c7ed30a4c8e70ad46f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/28aa8a79f3b6604ff1e6809c691fa4bc.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/fa67d62d69fb7b7ceee18bc61556a0c7.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/1ab9dbd345bf271a81fa636bcefb4ddb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/2b2b2db6a96ad0eee3bd8941a41587cd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8e10c90e9a1d7e96c222f4e4b8b44887.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6c4f1a118303466dd3044a8636f2159c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6ff8a62387b08cbb1d6e0d96719a5ba7.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>한우 미트볼</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리안심 테린',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+14,050원)' },
        { '용량 선택': '10팩(10% 할인) (+32,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202102/efd3f06cf95a6693c80118bd08e3575f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/e72f20c9b531d3fe27bde3dca3760975.jpg',
        '//ggaggamukja.com/web/product/extra/big/202102/9fef9116c51b7a073565fc819dcf2c1b.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202102/04722f50aee2dddfd06ad775c20a96f7.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/e72f20c9b531d3fe27bde3dca3760975.jpg',
        '//ggaggamukja.com/web/product/extra/small/202102/9fef9116c51b7a073565fc819dcf2c1b.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c4e8c0ca6d3a9af5f417b5aca60c6286.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5277f035174b14b346240e56c2de5cca.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6d2e1351dd091af43568d88e922e7e59.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/81358fb129c50d3bdf15cbd5df63c19c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8d09c29c3a17d64cecf875230442a914.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/41a8c487ab439fd5c4f13b43ae98f041.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리안심 테린</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리 핫도그 (대)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202112/7adb945ee4e648b1142667e6cf58d05a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/bd3aafae9c6b611a8c1e72e5967278e9.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/8f87b80453f33b87cc87720138cce8a0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fb76ee1476cfb94c64f52831f55a6082.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/987fc91eae2b10aa29762fec02da627e.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202112/dd7df883482a33eeb35531357064785e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/bd3aafae9c6b611a8c1e72e5967278e9.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/8f87b80453f33b87cc87720138cce8a0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fb76ee1476cfb94c64f52831f55a6082.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/987fc91eae2b10aa29762fec02da627e.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230515/6fe8ebd8a461ad9fa928aa0dc2696c9e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/e62f0864d9d44d7c426e4526da5ae6fe.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/95eed9e876414fcb5165f9cc23c9075d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/caca27624b35bf580096546da4535856.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230515/eecc3de2a9b091bbe20a83dbe363b8f5.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리 핫도그 (대)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍김밥',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/885223ea2c8094f00d04369add009393.jpg',
        '//ggaggamukja.com/web/product/extra/big/202205/ceb3ca10cbe58a89f80308538e88db2a.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/b7d18431b28dd68d13bd6316a24cf9e2.jpg',
        '//ggaggamukja.com/web/product/extra/small/202205/ceb3ca10cbe58a89f80308538e88db2a.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230518/98f05710cdeb624f6c5593bf3f0f45ec.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/b9bcd13d6a2da2b31530f6bf13b35cbd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/094696e4088ee271603d3692dc7a9b27.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/0be82999b488b6e1d44fa4f99f6e0644.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/2420adb24c1c3f5a8382951d81568dd4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230518/0d6fd7d2de0fda5ce8e054ce80a23c90.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍김밥</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 8000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍돈까스',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/9a0d91db522758c9ba7e3a764acca74e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/2d331c8980222af7b3faeae9efdaeab6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/9cd1e8d4cd0d1dbd11d22941157e38ad.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/328cda91e825f00e46dc7bc08f65110b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/439efb4631f53fea75d646b65e30c8c7.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/57c5da5b02f13fdd22cf697e06e30dac.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/2d331c8980222af7b3faeae9efdaeab6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/9cd1e8d4cd0d1dbd11d22941157e38ad.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/328cda91e825f00e46dc7bc08f65110b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/439efb4631f53fea75d646b65e30c8c7.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/0371b10f06aff2dc2765ad26505102c1.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/33f238cd33d8418ad18f793ebbd5dbfd.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/11fbad51b1a60f06aa68a9ce7a0947d6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d3e94fa5918b2f24818a2151e509621e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d1caa7d599487e36b0f944d206ac1aed.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3b8ac6e6cb41897b708a26180dbdede3.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍돈까스</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 23000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '멍피자 멍치킨 피크닉 세트',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202303/10e4612462adca4ed8178f25e12e8083.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/b83a3d8f88f030b4f28e0987c83020de.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/121156cafdf7bc4610ac0c3b49696a3a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/266f98400d5d3e53e65df78951412c46.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/ef0c1559d727feaec2f7223cd36c04f6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/7adfc1b453f4b700e30238f6556f4245.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/4268fd08fee82b7e319f2eb269e01a1e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/411dfcf850dd267c4703461edd21e8c0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202303/28af8c9ff75fdaad88632da271232e12.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202303/bba1e510035257013c19be281d17f0f7.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/b83a3d8f88f030b4f28e0987c83020de.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/121156cafdf7bc4610ac0c3b49696a3a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/266f98400d5d3e53e65df78951412c46.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/ef0c1559d727feaec2f7223cd36c04f6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/7adfc1b453f4b700e30238f6556f4245.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/4268fd08fee82b7e319f2eb269e01a1e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/411dfcf850dd267c4703461edd21e8c0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202303/28af8c9ff75fdaad88632da271232e12.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230313/0614fa8fa31563099cdb94289728e69f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/02f806bc0aa8bafda701001846d511df.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/15f6639969a121a245e8cd20d09b456d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/6d8c20d032a4fd939ba5f9ae51188496.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/cf34df9a03891c8ac3707314d09fa474.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/0d5cfe904a9161110202b508284f1a91.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/a18e8d305099a5e5afd59a54bb9c8e17.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/8b64a55f5e0b8fd2063b70bc84b81b1b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/ec916e8b78317da9fa98c4882e6c322b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230313/3b9ca86c99b8133471e75c3cb31bf8d6.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>멍피자 멍치킨 피크닉 세트</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '캥거루 스테이크 2P',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202309/b5cbe0d1a23f5f96738faca250ee78ea.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/9d3fb3d2a4e57f249678bb9a174330d0.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/928535082c6b700c09003a319aabe1d1.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202309/f99ad36e98bd712bef615a5da468494d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/9d3fb3d2a4e57f249678bb9a174330d0.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/928535082c6b700c09003a319aabe1d1.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230726/f22673ece4584b07608777b9f38f3de4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/1c157d7f40a9a4f220a67f52f1917dd3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/88a66c0c009c0b413a7e4bebe2d72637.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/63074c09dd81c7b7cbccd8936971e82d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/e3f5a5cad202ca51965642dbb8fe5868.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/8ff0cd37deeb5cdd90668fd26d3eac27.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/f933480ad9c44c500e51967ed770456b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>캥거루 스테이크 2P</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '말고기 스테이크 2P',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202309/50ebd8f574ebe7574a7247f4904d72d5.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/eb0140777bd3de5427e5e97695bb8a88.jpg',
        '//ggaggamukja.com/web/product/extra/big/202307/15680881bf9458d19289fe42b3fe49bb.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202309/3d0611bfd47c95cd57033eef791781c4.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/eb0140777bd3de5427e5e97695bb8a88.jpg',
        '//ggaggamukja.com/web/product/extra/small/202307/15680881bf9458d19289fe42b3fe49bb.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230726/3dc4f69d603223a0713205984e257dfb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/794db441489dcf7ac1c55c06a414a455.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/aadb64cc052d0ae196b7646152b39d5a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/5976bb7f6b74ada2ad40f8c6c74bafe0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/d16a6b5707d37afc09dcecb04956f2bb.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/abe0d0ab91935a11a2f948537616a209.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230726/8a89ff97f84264e3dc79b5e32ad73a72.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>말고기 스테이크 2P</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-special'],
        sort: 2,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '닭가슴살 육포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+18,380원)' },
        { '용량 선택': '10팩(10% 할인) (+39,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/82e27378db65ce514d3c7eda9f45a4a4.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fd6c177fe9f645e4a10b2f6d32b7e315.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f9b60ded23b1d7c266b16fff24a03a01.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f685890f201311e41a988b1f76354a83.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/89c430c1b5e3182231bbf64d184508dc.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fd6c177fe9f645e4a10b2f6d32b7e315.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f9b60ded23b1d7c266b16fff24a03a01.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f685890f201311e41a988b1f76354a83.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/c4c9ce842309c41b374c5d03173c4bde.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/d5125268d959174ebc338e41a91fb7e1.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/c2d6c62dd23d4b6247a45ed6d93bc5b0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/b4fbb7a585f67c8a499bdb0e565256c3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/37e376a6b7ad6aa421ac9479a1d23e06.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/4e15736a2d6a6093cb4f12a80ed0b8ce.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>닭가슴살 육포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리안심 육포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+24,380원)' },
        { '용량 선택': '10팩(10% 할인) (+52,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/eab5c40f540af2fad5f855a9d2d1137c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/7da404fed811162897085729ecfb44ba.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/ae41cc531ef1efad8127d5d428b7dd79.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fb7dfb5a59c85bfca9583c91cffac696.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/0d4c6e6dcbcffaee83e16f2eefac6c6a.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/c75c99e48bd0102f947acb4f5fb1624b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/7da404fed811162897085729ecfb44ba.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/ae41cc531ef1efad8127d5d428b7dd79.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fb7dfb5a59c85bfca9583c91cffac696.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/0d4c6e6dcbcffaee83e16f2eefac6c6a.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/706191f0f1f02075a20247fe51d4580f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/797961c138b6bd93a10efebaa2c0b0ca.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/33febb54b2e78ebb3c56b8c0afb34869.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/746ec171b142c571ec7cdf3833f3d563.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/b441c274cd03857a5bb961701b420322.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/438adadf4f868fad8f69930e13702721.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리안심 육포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '소고기 큐브',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+25,880원)' },
        { '용량 선택': '10팩(10% 할인) (+55,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/bccd7356518124a50abe56586768e099.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f508a90ebd3e16efbb0200066ab8b30b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/c1b45bd471e4577d69aae758b6b7a928.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/4f3dc8138269fcf58abb03a558d77cb4.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/36a35f8799a133366660c375d3c1707b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f508a90ebd3e16efbb0200066ab8b30b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/c1b45bd471e4577d69aae758b6b7a928.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/4f3dc8138269fcf58abb03a558d77cb4.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/f76ddf4dc5b6b99922c56079c50dd650.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/2f354c51b2c5530d7e86c4df49da7a96.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/8366d6b4a653879a8824829c1f026aae.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/f19ab96cb06eeb377359541c138e9fa9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/23e53b750d6dac5576abd979cdd2ed00.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/0eb2a27205cd5f7c2d4a63c4a83c1e5c.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>소고기 큐브</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '무염 황태포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+27,600원)' },
        { '용량 선택': '10팩(10% 할인) (+55,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202111/ce6c17bb7c93e1542fa2d68d314af500.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/19222849f435bd92c4cc5889184950a1.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/99c41c5ce1017aba7a2b9654910485a6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f6ca78ca97500214f09e7d9d589a02bc.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202111/98b1303d16cbcf1c797a227ba851d5c5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/19222849f435bd92c4cc5889184950a1.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/99c41c5ce1017aba7a2b9654910485a6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f6ca78ca97500214f09e7d9d589a02bc.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/bdbe56565e4307ad027161ad8e53498c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/be2a87edfbe93b1fe445115b09a763fc.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/50087091807de358a3ac3178c174c8b6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/adad85f942eec9103368bbb28083467c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/00a75743066488d23f4bd99fe7c7e75f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/fb158252a360f22b1f130d516e0fdbc5.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>무염 황태포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '돼지안심 육포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+22,130원)' },
        { '용량 선택': '10팩(10% 할인) (+47,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/84c73d5433269022af69fe53ba3c221c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/be69424bcfa29d243049ebf1131206fa.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/c4df605459d4f2523270c9a76bf4b7b5.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/08636003c4c5830c2c30328ba714a3bb.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/a5b7444d31c4e2e2a650cc32455c5f3d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/be69424bcfa29d243049ebf1131206fa.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/c4df605459d4f2523270c9a76bf4b7b5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/08636003c4c5830c2c30328ba714a3bb.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8778b56a216ffab9eee3266eb9516662.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/4ad3e1f66e6c25eafd1cfa76135e0354.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/9b2510deba099b6f32606989e981b9fa.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a9e0923c253d00aea46b8e4b5d4b603d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5ff00f2335c247ce2f47281b10dcb4ec.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8af75b35b5ea73acd2dfaded5e3addc7.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>돼지안심 육포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7800,
      shippingFees: 0,
      show: true,
      active: true,
      name: '연어 큐브',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+29,250원)' },
        { '용량 선택': '10팩(10% 할인) (+62,400원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/f71a10b75623d1820ae6865a14b31156.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/1dbb7e54cdf25f7cd656aa7335070c6c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/24ed0ad5ec5ac934fe7e609b3235e766.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/cd16f60d9758a697e7c776d77bbddd73.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/bd096388184ac484e6bb2c6b7af65931.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/1dbb7e54cdf25f7cd656aa7335070c6c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/24ed0ad5ec5ac934fe7e609b3235e766.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/cd16f60d9758a697e7c776d77bbddd73.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/0201345a63c6d1a0b3ff1beaa4742f26.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/cb08c42a1cadc79b7995fd2142c01b2e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/49e387adb47b70efa4f73702684907ee.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/225c845fc28179d120a20030828b2364.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/a0623744ecd5a3c5b5942687c1bf299c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/9e51f2191213c0bf15454ec698be59a7.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>연어 큐브</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '열빙어 육포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+28,130원)' },
        { '용량 선택': '10팩(10% 할인) (+60,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/a5be444af0f495e820e1f88ae9b5819f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202103/bb6926adde1e3703ef4ce9d32325b859.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/34f93adc5e7a0814b05c077b68c80ae5.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/def2b0b9199160eb5d7d0dcc2dcc4249.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/3c02e4bf5cab37a298d1d6ab4da99cda.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/43fb39c03a9575e31965854f8dfe990b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202103/bb6926adde1e3703ef4ce9d32325b859.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/34f93adc5e7a0814b05c077b68c80ae5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/def2b0b9199160eb5d7d0dcc2dcc4249.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/3c02e4bf5cab37a298d1d6ab4da99cda.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/54b0bec1fb98a980579cd151cc27618b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d78c21188df9c68f876864ef0f172218.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3f70d616da91e8cf1667e6296b71c6c8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5b0675d167c6ac73519a4d83eb42679b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/874283ebdb43885819add1d1f274d8d0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/f0759f1d397d04e94fc333c2dcd06575.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>열빙어 육포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '제주 말고기 큐브',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+25,880원)' },
        { '용량 선택': '10팩(10% 할인) (+55,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/fb911580fb36b82574e3c7d6af159c4b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/b1fd6e48309d135b92fbdff9848a3e57.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/c580160f3d2f1ff8406efe0378f44571.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/a0da30f52758f442bc2a261856df0cc1.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/45c132311f7d126c7427ae624ad93d8a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/b1fd6e48309d135b92fbdff9848a3e57.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/c580160f3d2f1ff8406efe0378f44571.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/a0da30f52758f442bc2a261856df0cc1.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8528df4c4a9107aa9cc27d4718e44f54.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c58883665177204f5b145d4c632ec5de.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/1038687e8bcd260ea8a5a1b23ae94192.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5a121598e869e9d0d36849175edbaa87.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/55162d69518794c99ccffc1d7cfdfffc.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/343ab8affc8dd4802d4562a9ddc415c3.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>제주 말고기 큐브</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '한우 소간 육포',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+16,880원)' },
        { '용량 선택': '10팩(10% 할인) (+36,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/db8d9610a952e0dbf4f12db9d1ebec90.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/e3b9462535616599a81e9be12d032c27.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/27e83cdd218ee86d2dfc42b4ee26416f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fb00ea26253af9f3cc015403f3ae4f7f.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/85dee6196cd7c947a6252ee0131949e5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/e3b9462535616599a81e9be12d032c27.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/27e83cdd218ee86d2dfc42b4ee26416f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fb00ea26253af9f3cc015403f3ae4f7f.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/7cd4675ee9b72c58c65288f51a44efb5.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/efd4302a4baff9b0cde683ecdffd68e3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/a693e174fd684bf70902e4bf11ca73ac.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/f82e085b4ecddf368a7c6e4f3c2e7e8a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/76df96ec939efc2bd42eff906f960302.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/b727db380bd76345755ca2712e944ef0.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>한우 소간 육포</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-gum'],
        sort: 3,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '한우 우족 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+22,130원)' },
        { '용량 선택': '10팩(10% 할인) (+47,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202111/3339b97d1c243c143ca4cd41d20177d9.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/ff6b8a69211770b42389d6921961ce4f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/483e210a9b791d8cfa93711eb8555e51.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f3f26cd2d5e94b853b1bb2fbaef27dcc.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202111/7f2f15f8e9d8601365510bd7a8417c7e.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/ff6b8a69211770b42389d6921961ce4f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/483e210a9b791d8cfa93711eb8555e51.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f3f26cd2d5e94b853b1bb2fbaef27dcc.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/42912a7647588605bdf629f1625a97c4.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/0b7e05065762fed0893cf851cbcf6864.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/00f4a6ed03e98a848bc771565803e516.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/852a56b40824135b42a31f513c033ea8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/df7e8ca13ab96a06d3d21f0599e652d3.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/a0d7aa64ea8fc0822478f8edeaa3d6da.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>한우 우족 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '메추리 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+15,000원)' },
        { '용량 선택': '10팩(10% 할인) (+32,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/424f0152158efa65c94aa9af9f4d2be7.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/265c7c60078037547983ed8ad7ff677d.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/a208ac112e444338f07da24a9fdc73f8.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/a3348f72b29550d828aa874f35795bac.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/14c134677f003b2fc1cb1f1ebe164007.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/265c7c60078037547983ed8ad7ff677d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/a208ac112e444338f07da24a9fdc73f8.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/a3348f72b29550d828aa874f35795bac.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/42936846a06221286b14f1ba15ec3ff6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/894548d1ea0e219701fe642919cf9d52.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3300919027f24d50e8b75c4de18eb01c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/21be1d9740c6b2004221633bc751e276.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/2be36f9250f0b690da2cfaa565dae160.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/188cf8d6925d7d951c4bcbf3658a9e2f.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>메추리 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '송아지목뼈 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+29,630원)' },
        { '용량 선택': '10팩(10% 할인) (+63,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/fc313662a4a1b1be059ece9c78be29a3.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/6bba1a8a7c575ff55b3f5ea5bfd859d5.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/0c4d9843ca35d6e6890e4c662fea577f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/1a732d934f872ef4032df1f95c15a497.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/24658a8899b50a296b783048c128b90c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/6bba1a8a7c575ff55b3f5ea5bfd859d5.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/0c4d9843ca35d6e6890e4c662fea577f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/1a732d934f872ef4032df1f95c15a497.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a60a17c106d8b07b045d45660879ea6f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/f014a512658042867b1458004a914e7d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/dd9bfa260ec3a199f411642a2ec64a60.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c2a14153b81eb972024f9b0113e1c032.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a953c391e66fbfd5778ed71a38ed0e72.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/ba9c6d1e750a23111cb850b9d52be7c3.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>송아지목뼈 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 9500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '제주 말갈비 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+35,630원)' },
        { '용량 선택': '10팩(10% 할인) (+76,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202112/e68f7baedc07f6c4ee6a1bc96ac6d4aa.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/08f97304b5476a08c34b816001312ffd.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/36bf4bf95b50433e70857e9418735523.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202112/ac360a2ca1160f181be4d559e36806d3.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/08f97304b5476a08c34b816001312ffd.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/36bf4bf95b50433e70857e9418735523.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/92d237ea4b9420743d36b3f41e2da617.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/85166240890ab8f83ed4ab56f0b0f189.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/571bbb591a8e011cbb6ad0a287f391e1.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/da79481c71d72c77563e422a4ff72590.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/fd861c88419c69199813e8f0f3bf9c11.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/117b711c0e85984abbbbc3a28f553c5b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>제주 말갈비 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리장각 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+16,880원)' },
        { '용량 선택': '10팩(10% 할인) (+36,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/4c77e71767cf7f04499cc8c2d84ba623.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/08a635de8f16ec48054160f7749503ca.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/6625e0c139fd0411391031dbbeab9523.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/bd4c5a7d34c32c613a14b0090b69fcb0.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/c039ef0c299f4579bbb23bbf13e23f6d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/08a635de8f16ec48054160f7749503ca.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/6625e0c139fd0411391031dbbeab9523.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/bd4c5a7d34c32c613a14b0090b69fcb0.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/7e15003d8be0c360a11e2cf75a06d0f1.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/328d2114769c4ccce5d579adc2f0b34e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a0c08a6275a7c28b8165d3ae3e155f6d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c58488ac7d85d9fd5594ae773d04c4f6.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/045d10785315966c3739a79e5745755d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/bf08cc77261781c571048037bec9a818.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리장각 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '캥거루꼬리 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+29,630원)' },
        { '용량 선택': '10팩(10% 할인) (+63,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202111/c2f99f661c7cfa9695a9ddf345c5995c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/dd8ef9d8a73f632fa354c2f29c211995.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/8d03098c1c389e719a1898570aba420c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/4c2fe865bf1ff1a9d87d332146d07145.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202111/378a035805fbf765cf64812d0a447186.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/dd8ef9d8a73f632fa354c2f29c211995.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/8d03098c1c389e719a1898570aba420c.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/4c2fe865bf1ff1a9d87d332146d07145.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3edcb2be56621524bb0bffe330fddbe5.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/1b4e33b9316e294251eb429230ab5f77.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/8cf2d99c1b2b52d72204aea599592de0.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/0478392bb080da7e687686ae21fe5744.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/03a5ee526d8609df1dffa2966c828543.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/566cd0abb286b8f126b7c762fa2c1c6b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>캥거루꼬리 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리근위 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+22,130원)' },
        { '용량 선택': '10팩(10% 할인) (+47,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/4ae384240f184e0fcc5d818d0f0e6034.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/88396e8c72c2437f0c53b212b7782ffe.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/1575782a7f9d431db83451166a3d71cf.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/a85dcffe31df58b8d578be4cd1f05506.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/0b13a2ed898e67f7a8c7288c2f2ab9e4.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/423ce9dfd23b1d9da143471b8494de0d.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/88396e8c72c2437f0c53b212b7782ffe.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/1575782a7f9d431db83451166a3d71cf.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/a85dcffe31df58b8d578be4cd1f05506.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/0b13a2ed898e67f7a8c7288c2f2ab9e4.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/947b08b7ddec9b152d0f545a1be4c18a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/5d3904840e7607980233cef0f96c018f.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/48fe251a1be7a2e0508637bd618f9a3a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d5740e8fdb9420147fc3d8406acf5ab7.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d13592c946a09d24412114172db3c00e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d38eb0e447d31d24f3ce2eb35157afc0.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리근위 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '양등뼈 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+16,880원)' },
        { '용량 선택': '10팩(10% 할인) (+36,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202112/f167c512114c314b94cac80161f5cdcd.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/c8ff6974f4dff0dbdadc770311a9b995.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/0cfa079a23f84d12a05a1b7a8bc6f9f3.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/1f7701d1fb2e43dca3611d410bc4f7de.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202112/ffd0ee1b4a96142a1cb0ab66aab73922.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/c8ff6974f4dff0dbdadc770311a9b995.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/0cfa079a23f84d12a05a1b7a8bc6f9f3.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/1f7701d1fb2e43dca3611d410bc4f7de.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/a3ed934d427f6e30a879fa8d5761d984.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/968b6a8d4d872f6f511f49151890724a.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/98d83ef7a8abc351fcaae264a4731e55.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/dc38038fbf4e8bba5dc239923b9d1532.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/d2c474152d239374771f24f3a8107df5.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/f337d6d431bedb9f678cf2c70c9ef4f2.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>양등뼈 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '상어연골 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+24,380원)' },
        { '용량 선택': '10팩(10% 할인) (+52,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/df69af13efaafe33be45f0ec3413230e.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/e48a6d3a2cf6a07e145857a3e233718b.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/fa32b31d8bcaba8c3a2bc6ccbad0c9c8.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/b515718bf7ad469122529b91fef185c7.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/3f8d947dd39c70777356777f70bb7caf.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/e48a6d3a2cf6a07e145857a3e233718b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/fa32b31d8bcaba8c3a2bc6ccbad0c9c8.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/b515718bf7ad469122529b91fef185c7.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220706/e1f3c06bb6076d7835820a024c0f337c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/29f81f61bbf85fa8877e143aef724a25.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/43acd710430300d1feb6080b8435f66b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/4e4d7fab15c251132ca1b869a32a4bf2.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/786b087f0879a5f41fe69b53469c2800.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220706/782ec7aa5b0a6cec749b8718e48c6566.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>상어연골 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 6500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '오리 오돌뼈 천연껌',
      options: [
        { '용량 선택': '기본 한팩' },
        { '용량 선택': '5팩(5% 할인) (+24,380원)' },
        { '용량 선택': '10팩(10% 할인) (+52,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202112/fc00b86e2537ef4ed46bf9f7f34b8e81.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/a2b20eebc1d4ef2f6a9ceaef950ebe9f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202112/59afb8f30b66c231fafc7b0061041b33.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/7e922439ce70b87c5bca0fe9e59ebd02.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/32fd9a27cad707e1c9f56a142d1f782e.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202112/111de5b5d23fb690d8a1a1800d04404b.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/a2b20eebc1d4ef2f6a9ceaef950ebe9f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202112/59afb8f30b66c231fafc7b0061041b33.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/7e922439ce70b87c5bca0fe9e59ebd02.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/32fd9a27cad707e1c9f56a142d1f782e.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/4a56aec54bd8f4e6ba8fc78a773aa4ec.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/6deff4c5d67b2263c19e7c294544e0b8.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/595b0f1402dedfc96f7574452332e542.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/f633f65ac7e51c65df12de01bbb9b343.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/35903921b8b13d83d93760eaaadd963c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/1304a7a49ada653c9980326dbe08bb39.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>오리 오돌뼈 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5900,
      shippingFees: 0,
      show: true,
      active: true,
      name: '한우 소발톱 천연껌',
      options: [
        { '용량 선택': '기본 단품' },
        { '용량 선택': '5팩(5% 할인) (+22,130원)' },
        { '용량 선택': '10팩(10% 할인) (+47,200원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202207/a5806ed454e6d86d6a9fb805bbe1dc5c.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/df05607099c558f08da73db618c9bf74.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/8b9e7362ac2ea12dceaa143c8d68f37f.jpg',
        '//ggaggamukja.com/web/product/extra/big/202207/f731301c825cc87f2ee4830034db1757.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202207/01fbb0b79a087c386347ab45ab02671f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/df05607099c558f08da73db618c9bf74.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/8b9e7362ac2ea12dceaa143c8d68f37f.jpg',
        '//ggaggamukja.com/web/product/extra/small/202207/f731301c825cc87f2ee4830034db1757.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220707/2aba44db341ff6e99a532dfe0849f655.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/31e488f6772eec7d5e77ea97906b70d9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/9a7329547821587f8a18f574a4fcf7ad.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/21e864dd630656ccd3c8a241dd31849e.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/c0302c1c7fed58392ed321b6d36ef92b.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220707/3d93e3ce908cb732286336f0067b9c82.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>한우 소발톱 천연껌</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-bone'],
        sort: 4,
      },
    },
    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '강아지 전용 멍맥주 220ml',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/4329ce74a81f9d59db063b5badf067b5.png',
        '//ggaggamukja.com/web/product/extra/big/202110/d3429011c3264041e111183a3523e622.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/5450caea28388cb615eaf395f5cdeb48.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/ec595500ab20487f466cc56a976cca53.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/dc9b90c5d200251daedd72538e891238.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/7b5252e33720d61b3d229b8f0ef3ccdf.png',
        '//ggaggamukja.com/web/product/extra/small/202110/d3429011c3264041e111183a3523e622.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/5450caea28388cb615eaf395f5cdeb48.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/ec595500ab20487f466cc56a976cca53.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/dc9b90c5d200251daedd72538e891238.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/dd109bf546da0234c58c6b0f43fe951c.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20211013/7e9470b16b4c6d415292f4c25dcb9685.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>강아지 전용 멍맥주 220ml</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 800,
      shippingFees: 0,
      show: true,
      active: true,
      name: '숫자 초 (색상랜덤)',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/e0bd41c91b4a6bae9406bbe92bc6bb71.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/67188edb3529c65abecf67688963f038.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/4debffa6628bcecadf079e7acbde2cb8.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>숫자 초 (색상랜덤)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '강아지 전용 멍소주 330ml',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/dcfec4998d7808b1b58dcc4f94ad8b1c.png',
        '//ggaggamukja.com/web/product/extra/big/202110/72eb24a4f5ea8c8967fc13f1e7dcba07.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/ff7110f3e00ff785d3513e69f3274d24.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/d7fddc444c74aa2ccb9c004d464562c6.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/2b6ecd173ced002d04016f8c0bee6ceb.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/39d68d51401e27196e10d47e8a085c2d.png',
        '//ggaggamukja.com/web/product/extra/small/202110/72eb24a4f5ea8c8967fc13f1e7dcba07.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/ff7110f3e00ff785d3513e69f3274d24.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/d7fddc444c74aa2ccb9c004d464562c6.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/2b6ecd173ced002d04016f8c0bee6ceb.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/cb09c051349c35fd7edbcfb7bac06a41.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20211013/7ea97f56240932f99702a73353b6d467.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>강아지 전용 멍소주 330ml</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 2500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '스마일 꼬깔모자',
      options: [{ 사이즈: '소형견용' }, { 사이즈: '중대형견용 (+500원)' }],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/ee8c49d2a232879b4429df85af2df2c4.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/fd61167ae420399ce689bb6c4f1846ff.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/059f612b403db1aa0210ffdd908858a4.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>스마일 꼬깔모자</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '해피벌스데이 케이크 토퍼',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202203/31ab6ed030e81587a50b598a90414d4f.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202203/1be0f85e102f181d17123e0c6fdb424e.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220326/d97e60ecc76d7221b62d669837126541.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/1cd2fb867eb0e590a9ba512a9f167a67.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>해피벌스데이 케이크 토퍼</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '스마일 & 꼬깔 초 (색상 랜덤)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/6a138d913534d4595dc3756969415122.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/4b24d95adf8b5f8a41c809c07fa37e66.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/4236e9c768da94134ff37dfb98f41812.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>스마일 & 꼬깔 초 (색상 랜덤)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1200,
      shippingFees: 0,
      show: true,
      active: true,
      name: '꽃가루 풍선 2개',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/c31318a8a513343a1089acce6ddd9b50.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/46741262da3592d1b85de704e2a41a74.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/d9aa0d7464700a293059d56f719209c4.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>꽃가루 풍선 2개</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 7500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '생일 케이프',
      options: ['핑크색', '하늘색'],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/b2072642354505330e6ebe10feec4709.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/0b1aec33eef2e7eca2d47e92458242ce.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/be3a380cf6f40f450612e01d136a03fa.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>생일 케이프</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1200,
      shippingFees: 0,
      show: true,
      active: true,
      name: '핑크색 스트라이프 일회용 디자인 접시',
      options: [
        { 사이즈: '지름 18cm 3개입' },
        { 사이즈: '지름 23cm 3개입 (+300원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202203/ef2e520505c40a8810ce14fa2b681705.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202203/d088ab247b0c9753ef496c0b4eea0b47.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220326/3a6e7d0d40cc32037d02aeef05603740.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/278c3ff38596b9f1cd92c08befe94611.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/63c20b7fff64ae7b78792098b0cbaa1a.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>핑크색 스트라이프 일회용 디자인 접시</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '꽈배기 & 스마일 초 (색상 랜덤)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/68754ad8a4513cedf82c1d49fcc3e1b2.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/f2c75b213d54dfe54bd99680f29ae8a9.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/aaf243dc22fb3e85c7ff7fcd3c9381e7.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>꽈배기 & 스마일 초 (색상 랜덤)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 9000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '강아지 전용 멍와인 340ml',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/d127740c3de561facfa285e9ed88a470.png',
        '//ggaggamukja.com/web/product/extra/big/202110/40e4a0e1d4cebbaceb043c723fef527a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/f159f561b5ff8f4fdefa7f1a623810a8.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/7b97a2e0b2dea77b459fd2eb89b36e58.jpg',
        '//ggaggamukja.com/web/product/extra/big/202110/59efb8b329ff543fa5cb62a81aba2df8.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/47e39384a52a3e77b24d23b14b5402c0.png',
        '//ggaggamukja.com/web/product/extra/small/202110/40e4a0e1d4cebbaceb043c723fef527a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/f159f561b5ff8f4fdefa7f1a623810a8.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/7b97a2e0b2dea77b459fd2eb89b36e58.jpg',
        '//ggaggamukja.com/web/product/extra/small/202110/59efb8b329ff543fa5cb62a81aba2df8.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/ff9c4b0d93b77b7c100b06740ddde4d9.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20211013/e3e9da3158f476f01fa2cc6dd0f79950.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>강아지 전용 멍와인 340ml</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '파스텔 풍선 (30cm) 5ea',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202203/763f248e0a28dbab687727b79626e2c7.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202203/53a48d6eb458e9c44a38facc1d3fcb38.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220326/1bcbc3cacdd5c107c4c67162f0189028.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/419db19fcb5722cf866b57f85476d565.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>파스텔 풍선 (30cm) 5ea</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '데이지 가랜드',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202302/b3e0343d62fc6ce45f5545ed8ae362c0.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202302/18109d10f9a1370b424bd864ea0ab217.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220326/cae00b0d76597d0e81069e6af23f0279.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/efbe0e685e08bcb9ae078e64829ddded.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>데이지 가랜드</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 5000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '민트 고깔모자',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202309/5ea95fc750782a9b39171f2964f4cabd.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/ef865dd2ee19b167107bd6655cff30a2.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202309/b98ee27dcd4cc9ea14039ad1d4b7de24.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/ef865dd2ee19b167107bd6655cff30a2.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230912/dc21e32e354b868bd3a167c41cf9f17d.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230912/cc731f8d5c01654e2fb01811ce10578c.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>민트 고깔모자</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 4000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '파스텔 생일 가랜드',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202302/76a5dcffa1265ad208e78644d4e32388.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202302/d0d9a34fc9fd12224f2edea1cd7cdab6.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20220326/9d28fb2dc4f487c6f9112b89b3a16944.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20220326/66b54e9cdaedde84cdc4321ab720ec8b.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>파스텔 생일 가랜드</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 3500,
      shippingFees: 0,
      show: true,
      active: true,
      name: '가랜드 (로즈골드)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/cde8edf79cb582817a1cc73928ed0227.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/ab0d865765c60acb7226e41b45ca60ad.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/70ff4708a2575f124097eb4c7cb9a1cc.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>가랜드 (로즈골드)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 1000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '크레용 초 (색상 랜덤)',
      options: [],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202110/a655cb5ef5a613f9239d21904ab81cc2.png',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202110/61ec5a97152eeee062a5ae4ba0adf24f.png',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20211013/19df44d68ee349cd71ecef6a1c4885f8.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>크레용 초 (색상 랜덤)</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },

    {
      _id: await nextSeq('product'),
      seller_id: 2,
      price: 9000,
      shippingFees: 0,
      show: true,
      active: true,
      name: '스너플 도그비어',
      options: [
        { '종류 선택': '병 맥주' },
        { '종류 선택': '캔 맥주 (-1,000원)' },
      ],
      mainImages: [
        '//ggaggamukja.com/web/product/big/202309/4e4a90ff9933f1acef4b839a153e5091.png',
        '//ggaggamukja.com/web/product/extra/big/202309/4eee7fd5f276c673c66393de5814f9c0.png',
        '//ggaggamukja.com/web/product/extra/big/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/d16544838014204bfbf2a0b2432f7554.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/66e6a1b29c37c525a511ac0624a2538a.jpg',
        '//ggaggamukja.com/web/product/extra/big/202309/d3228c239cc92c3d38770b536ad70449.jpg',
      ],
      detailImages: [
        '//ggaggamukja.com/web/product/small/202309/b37a4052ab82fc8a6b90cf9db60046a9.png',
        '//ggaggamukja.com/web/product/extra/small/202309/4eee7fd5f276c673c66393de5814f9c0.png',
        '//ggaggamukja.com/web/product/extra/small/202308/46a1be176219e44531a00ec2239ad64a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/d16544838014204bfbf2a0b2432f7554.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/66e6a1b29c37c525a511ac0624a2538a.jpg',
        '//ggaggamukja.com/web/product/extra/small/202309/d3228c239cc92c3d38770b536ad70449.jpg',
      ],
      descriptImages: [
        '//ggaggamukja.com/web/upload/NNEditor/20230907/92a83913618cf89dc52cac06da520dae.jpg',
        '//ggaggamukja.com/web/upload/NNEditor/20230907/f338a083418304f5e85749ca77193e23.jpg',
      ],
      content: `
              <div class="product-detail">
                  <p>스너플 도그비어</p>
              </div>`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      quantity: 100,
      buyQuantity: 0,
      extra: {
        isNew: true,
        isBest: true,
        category: ['PC-shop', 'PC-party'],
        sort: 5,
      },
    },
  ];

  await db.product.insertMany(data);
}

// 장바구니 등록
async function registCart() {
  var data = [
    {
      _id: await nextSeq('cart'),
      user_id: 4,
      product_id: 1,
      quantity: 2,
      createdAt: getTime(-7, -60 * 30),
      updatedAt: getTime(-7, -60 * 30),
    },
    {
      _id: await nextSeq('cart'),
      user_id: 4,
      product_id: 2,
      quantity: 1,
      createdAt: getTime(-4, -60 * 30),
      updatedAt: getTime(-3, -60 * 60 * 12),
    },
    {
      _id: await nextSeq('cart'),
      user_id: 2,
      product_id: 3,
      quantity: 2,
      createdAt: getTime(-3, -60 * 60 * 4),
      updatedAt: getTime(-3, -60 * 60 * 4),
    },
    {
      _id: await nextSeq('cart'),
      user_id: 2,
      product_id: 4,
      quantity: 3,
      createdAt: getTime(-2, -60 * 60 * 12),
      updatedAt: getTime(-1, -60 * 60 * 20),
    },
  ];

  await db.cart.insertMany(data);
}

// 구매 등록
async function registOrder() {
  var data = [
    {
      _id: await nextSeq('order'),
      user_id: 4,
      state: 'OS010',
      products: [
        {
          _id: 2,
          name: '헬로카봇 스톰다이버',
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-diver.jpg`,
          quantity: 2,
          price: 34520,
          reply_id: 3,
        },
      ],
      cost: {
        products: 34520,
        shippingFees: 2500,
        discount: {
          products: 0,
          shippingFees: 0,
        },
        total: 37020,
      },
      address: {
        name: '회사',
        value: '서울시 강남구 신사동 234',
      },
      createdAt: getTime(-6, -60 * 60 * 3),
      updatedAt: getTime(-6, -60 * 60 * 3),
    },
    {
      _id: await nextSeq('order'),
      user_id: 4,
      state: 'OS035',
      delivery: {
        company: '한진 택배',
        trackingNumber: '364495958003',
        url: 'https://trace.cjlogistics.com/next/tracking.html?wblNo=364495958003',
      },
      products: [
        {
          _id: 3,
          name: '레고 클래식 라지 조립 박스 10698',
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-classic.jpg`,
          quantity: 1,
          price: 48870,
        },
        {
          _id: 4,
          name: '레고 테크닉 42151 부가티 볼리드',
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-bugatti.png`,
          quantity: 2,
          price: 90000,
          reply_id: 2,
        },
      ],
      cost: {
        products: 138840,
        shippingFees: 3500,
        discount: {
          products: 13880,
          shippingFees: 3500,
        },
        total: 124960,
      },
      address: {
        name: '집',
        value: '서울시 강남구 역삼동 123',
      },
      createdAt: getTime(-4, -60 * 60 * 22),
      updatedAt: getTime(-2, -60 * 60 * 12),
    },
    {
      _id: await nextSeq('order'),
      user_id: 4,
      state: 'OS310',
      products: [
        {
          _id: 4,
          name: '레고 테크닉 42151 부가티 볼리드',
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-bugatti.png`,
          quantity: 1,
          price: 45000,
          reply_id: 1,
        },
      ],
      cost: {
        products: 45000,
        shippingFees: 3500,
        discount: {
          products: 4500,
          shippingFees: 0,
        },
        total: 44000,
      },
      address: {
        name: '학교',
        value: '서울시 강남구 역삼동 234',
      },
      createdAt: getTime(-3, -60 * 60 * 18),
      updatedAt: getTime(-1, -60 * 60 * 1),
    },
  ];

  await db.order.insertMany(data);
}

// 후기 등록
async function registReply() {
  var data = [
    {
      _id: await nextSeq('reply'),
      user_id: 4,
      product_id: 4,
      rating: 5,
      content: '아이가 좋아해요.',
      createdAt: getTime(-4, -60 * 60 * 12),
    },
    {
      _id: await nextSeq('reply'),
      user_id: 2,
      product_id: 4,
      rating: 4,
      content: '배송이 좀 느려요.',
      createdAt: getTime(-3, -60 * 60 * 1),
    },
    {
      _id: await nextSeq('reply'),
      user_id: 4,
      product_id: 2,
      rating: 1,
      content: '하루만에 고장났어요.',
      createdAt: getTime(-2, -60 * 60 * 10),
    },
  ];

  await db.reply.insertMany(data);
}

// 코드 등록
async function registCode() {
  var data = [
    {
      _id: 'productCategory',
      title: '상품 카테고리',
      codes: [
        {
          sort: 0,
          code: 'PC-shop',
          value: 'shop',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 1,
          code: 'PC-dessert',
          value: '디저트/케이크',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 2,
          code: 'PC-special',
          value: '자연식/특식',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 3,
          code: 'PC-gum',
          value: '육포/우유껌',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 4,
          code: 'PC-bone',
          value: '천연껌/뼈간식',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 5,
          code: 'PC-party',
          value: '파티용품/굿즈',
          extra: {
            depth: 1,
          },
        },
        {
          sort: 2,
          code: 'PC01',
          value: '어린이',
          depth: 1,
        },
        {
          sort: 3,
          code: 'PC0101',
          value: '퍼즐',
          parent: 'PC01',
          depth: 2,
        },
        {
          sort: 1,
          code: 'PC0102',
          value: '보드게임',
          parent: 'PC01',
          depth: 2,
        },
        {
          sort: 2,
          code: 'PC010201',
          value: '2인용',
          parent: 'PC0102',
          depth: 3,
        },
        {
          sort: 1,
          code: 'PC010202',
          value: '3~4인용',
          parent: 'PC0102',
          depth: 3,
        },
        {
          sort: 2,
          code: 'PC0103',
          value: '레고',
          parent: 'PC01',
          depth: 2,
        },
        {
          sort: 4,
          code: 'PC0104',
          value: '로봇',
          parent: 'PC01',
          depth: 2,
        },

        {
          sort: 1,
          code: 'PC02',
          value: '스포츠',
          depth: 1,
        },
        {
          sort: 1,
          code: 'PC0201',
          value: '축구',
          parent: 'PC02',
          depth: 2,
        },
        {
          sort: 3,
          code: 'PC0202',
          value: '야구',
          parent: 'PC02',
          depth: 2,
        },
        {
          sort: 2,
          code: 'PC0203',
          value: '농구',
          parent: 'PC02',
          depth: 2,
        },

        {
          sort: 3,
          code: 'PC03',
          value: '어른',
          depth: 1,
        },
        {
          sort: 1,
          code: 'PC0301',
          value: '원격 조종',
          parent: 'PC03',
          depth: 2,
        },
        {
          sort: 2,
          code: 'PC0302',
          value: '퍼즐',
          parent: 'PC03',
          depth: 2,
        },
        {
          sort: 3,
          code: 'PC0303',
          value: '레고',
          parent: 'PC03',
          depth: 2,
        },
      ],
    },
    {
      _id: 'orderState',
      title: '주문 상태',
      codes: [
        {
          sort: 1,
          code: 'OS010',
          value: '주문 완료',
        },
        {
          sort: 2,
          code: 'OS020',
          value: '결제 완료',
        },
        {
          sort: 3,
          code: 'OS030',
          value: '배송 준비중',
        },
        {
          sort: 4,
          code: 'OS035',
          value: '배송중',
        },
        {
          sort: 5,
          code: 'OS040',
          value: '배송 완료',
        },
        {
          sort: 6,
          code: 'OS110',
          value: '반품 요청',
        },
        {
          sort: 7,
          code: 'OS120',
          value: '반품 처리중',
        },
        {
          sort: 8,
          code: 'OS130',
          value: '반품 완료',
        },
        {
          sort: 9,
          code: 'OS210',
          value: '교환 요청',
        },
        {
          sort: 10,
          code: 'OS220',
          value: '교환 처리중',
        },
        {
          sort: 11,
          code: 'OS230',
          value: '교환 완료',
        },
        {
          sort: 12,
          code: 'OS310',
          value: '환불 요청',
        },
        {
          sort: 13,
          code: 'OS320',
          value: '환불 처리중',
        },
        {
          sort: 14,
          code: 'OS330',
          value: '환불 완료',
        },
      ],
    },
    {
      _id: 'membershipClass',
      title: '회원 등급',
      codes: [
        {
          sort: 1,
          code: 'MC01',
          value: '일반',
          discountRate: 0, // 할인율
        },
        {
          sort: 2,
          code: 'MC02',
          value: '프리미엄',
          discountRate: 10,
        },
        {
          sort: 3,
          code: 'MC03',
          value: 'VIP',
          discountRate: 20,
        },
      ],
    },
  ];
  await db.code.insertMany(data);
}

// 북마크 등록
async function registBookmark() {
  var data = [
    {
      _id: await nextSeq('bookmark'),
      user_id: 4,
      product_id: 2,
      memo: '첫째 크리스마스 선물.',
      createdAt: getTime(-3, -60 * 60 * 2),
    },
    {
      _id: await nextSeq('bookmark'),
      user_id: 4,
      product_id: 3,
      memo: '둘째 입학 선물',
      createdAt: getTime(-2, -60 * 60 * 20),
    },
    {
      _id: await nextSeq('bookmark'),
      user_id: 4,
      product_id: 4,
      memo: '이달 보너스타면 꼭!!!',
      createdAt: getTime(-1, -60 * 60 * 12),
    },
    {
      _id: await nextSeq('bookmark'),
      user_id: 2,
      product_id: 4,
      memo: '1순위로 살것!',
      createdAt: getTime(-1, -60 * 60 * 12),
    },
  ];

  await db.bookmark.insertMany(data);
}

// config 등록
async function registConfig() {
  var data = [
    {
      _id: 'shippingFees',
      title: '배송비',
      value: 3500,
    },
    {
      _id: 'freeShippingFees',
      title: '배송비 무료 금액',
      value: 50000,
    },
  ];
  await db.config.insertMany(data);
}

// 모든 상품명을 출력한다.
async function productList() {
  var result = await db.product
    .find({}, { projection: { _id: 0, name: 1 } })
    .toArray();
  logger.log(`상품 ${result.length}건 조회됨.`);
  logger.log(result);
}
