# LMS Chrome Extension (for PC)

<p align="center">
  <img src="https://i.imgur.com/38dOPQL.png" alt="thumbnail">
  <br>
  <br>
  순천향대학교 사이버 강의 수강 툴
</p>

* [설치 방법](#설치-방법)
* [사용 방법](#사용-방법)

만일 사용 중 문제가 발생한 경우에는 [이슈](https://github.com/Gumball12/lms-playbackrate-extension/issues) 페이지를 이용해주세요. 감사합니다.

## 설치 방법

### 배포 버전

현재 배포 버전에 대한 리뷰가 진행중입니다.

### 개발 버전

개발 버전 설치 방법은 다음과 같습니다.

1. [소스 코드를 다운로드](https://github.com/Gumball12/lmsplusplus/archive/master.zip) 받고, 압축을 해제합니다.
1. 크롬 확장 프로그램 관리 페이지(chrome://extensions)에 접속한 뒤, 우측 상단에 위치한 `개발자 모드`를 활성화합니다.
1. 좌측 상단의 `압축해제된 확장 프로그램을 로드합니다.` 버튼을 클릭합니다.
1. 압축 해제한 소스 코드의 폴더를 선택합니다.

## 사용 방법

### 로그인 유지

일정 시간이 지나도 자동으로 로그아웃되지 않게끔 하는 기능입니다.

'켜짐' 상태가 되면 지속적으로 신호를 보내 로그아웃되지 않게끔 합니다.

#### 유의사항

* 강의 페이지(lms.sch.ac.kr)를 끄지 말아주세요.

### 강제 속도 변경

강의를 모두 듣지 않고도, 강제로 속도를 변경할 수 있게 하는 기능입니다.

'켜짐' 상태가 되면 강의 목록 아이콘이 아래와 같이 사라지게 되며,

<p align="center">
  <img src="https://i.imgur.com/Xp7UUXE.png" alt="course lists">
</p>

해당 강의를 클릭하게 되면 좌측 하단에 속도를 변경할 수 있는 패널이 나타납니다.

<p align="center">
  <img src="https://i.imgur.com/Ey2Pdk7.png" alt="playback-rate panel">
</p>

이를 이용해 강의 속도를 변경할 수 있습니다.

## 추가 예정

### 강의 자동 수강

일일이 강의 페이지를 켜놓고 있지 않아도 자동으로 시간이 채워지는 기능입니다.

#### 진행 상황

* [x] 코어 구현 및 동작 확인
* [x] 프로토타입 구현
* [ ] 사용 흐름 정의
* [ ] UI 구현
* [ ] 배포
