//import 'animate.css';
import '../scss/main.scss';

	// 슬라이드 위치 추적 변수
  let currentSlideIndex = 0;
  let swiperInstance;

  document.addEventListener('DOMContentLoaded', () => {
    // kiosk 요소 가져오기
    const kiosk = document.querySelector('.kiosk');

    // page1 클래스 업데이트 함수
    const updatePage1Class = () => {
      if (currentSlideIndex === 0) {
        kiosk.classList.add('page1');
      } else {
        kiosk.classList.remove('page1');
      }
    };

    // end 클래스 업데이트 함수
    const updateEndClass = () => {
      const lastIndex = swiperInstance.slides.length - 1;
      if (currentSlideIndex === lastIndex) {
        kiosk.classList.add('end');
      } else {
        kiosk.classList.remove('end');
      }
    };

    // Swiper 인스턴스 생성
    swiperInstance = new Swiper('.swiper-container', {
      slidesPerView: 1,
      pagination: { el: '.swiper-pagination', clickable: true },
      autoHeight: true,
      initialSlide: 0,
      on: {
        slideChange: function() {
          console.log(this.activeIndex);
        }
      }
    });

    // 초기 인덱스 설정
    currentSlideIndex = swiperInstance.activeIndex;
    updatePage1Class();
    updateEndClass();

    // 슬라이드 변경 시 인덱스 업데이트 및 page1 클래스 업데이트
    swiperInstance.on('slideChange', () => {
      currentSlideIndex = swiperInstance.activeIndex;
      updatePage1Class();
      updateEndClass();
    });

    // 이전 페이지 버튼
    const btnPrev = document.querySelector('.btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
          swiperInstance.slidePrev();
        }
      });
    }

    // 다음 페이지 버튼
    const btnNext = document.querySelector('.btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentSlideIndex < swiperInstance.slides.length - 1) {
          swiperInstance.slideNext();
        }
      });
    }

    // 홈 버튼 (맨 처음으로)
    const btnHome = document.querySelector('.btn-home');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        swiperInstance.slideTo(0);
      });
    }

    // 팝업 열기 함수
    const openPopup = (popupName) => {
      const popup = document.querySelector(`.${popupName}`);
      if (popup) {
        popup.classList.add('show');
      }
    };

    // 팝업 닫기 함수
    const closePopup = (popup) => {
      if (popup) {
        popup.classList.remove('show');
      }
    };

    // data-popup 속성을 가진 모든 버튼에 이벤트 리스너 등록
    const popupButtons = document.querySelectorAll('[data-popup]');
    popupButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const popupName = btn.getAttribute('data-popup');
        openPopup(popupName);
      });
    });

    // 팝업 닫기 버튼들 (모든 팝업의 닫기 버튼)
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const popup = e.target.closest('.popup');
        closePopup(popup);
      });
    });

    // data-move 속성을 가진 모든 버튼에 이벤트 리스너 등록
    const moveButtons = document.querySelectorAll('[data-move]');
    moveButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const slideIndex = btn.getAttribute('data-move');
        if (slideIndex !== '' && !isNaN(slideIndex)) {
          const index = parseInt(slideIndex);
          // 팝업 닫기
          const popup = btn.closest('.popup');
          if (popup) {
            closePopup(popup);
          }
          // 슬라이드 이동
          swiperInstance.slideTo(index);
        }
      });
    });
  });