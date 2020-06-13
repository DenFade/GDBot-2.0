# GDBot-2.0
현재 구동되는 GDBot 메인 스크립트 입니다.

---

# About this bot
Geometry Dash 기능들을 카톡봇으로 구현. (최신버전: o)

매번 즉흥적으로 만들고 추가한탓에 일관성, 발적화는 같이 딸려옴.. 양해좀

---

# Command List

### 주의사항

> 레벨 혹은 유저를 검색 할 시에 띄워쓰기가 필요하다면 \_ <- 언더바 로 바꿔서 사용해야합니다
> ex) !search level Ancestral_Calamity

> 본인 기기 상태에 따라 응답이 ~~심각하게~~ 지연되는 경우가 자주 발생합니다.
> 지연되더라도 여러번 쓰지 말아주세요.


## Search 관련

> !search user (유저명, 혹은 player id)

해당 쿼리로 유저를 검색합니다.
-> !open (숫자): 1~n(n<=10) 개의 목록에서 해당 유저를 열람합니다.
-> !next, !pre, !page (페이지) 등의 페이지 명령어를 지원합니다.


> !search level (레벨명, 혹은 level id)

해당 쿼리로 레벨을 검색합니다.
-> !open (숫자): 1~n(n<=10) 개의 목록에서 해당 레벨을 열람합니다. (레벨 크기에 따라 지연시간이 발생합니다.)
-> !next, !pre, !page (페이지) 등의 페이지 명령어를 지원합니다.


> !search user-level (유저명, 혹은 player id)

해당유저의 레벨을 열람합니다.
-> !open (숫자): 1~n(n<=10) 개의 목록에서 해당 레벨을 열람합니다. (레벨 크기에 따라 지연시간이 발생합니다.)
-> !next, !pre, !page (페이지) 등의 페이지 명령어를 지원합니다.



## TimelyLevel 관련

> !daily 

데일리 레벨을 가져옵니다. (레벨 크기에 따라 지연시간이 발생합니다.)


> !weekly

위클리 레벨을 가져옵니다. (레벨 크기에 따라 지연시간이 발생합니다.)



## Registration, 연동 관련

```
Q: 제 Account ID를 어떻게 알아내나요?
A:

1. !search user 자신의닉네임 으로 검색 후 !open 명령어를 통해서
자신의 프로필을 엽니다.
2. 하단의 Account ID 부분을 외우면 됩니다.


Q: 전송 실패라 뜨는데 왜이러나요..?
A:

다음과 같은 이유 일껍니다.
1. Account ID안넣고 닉네임 넣고 안된다고 찡찡대지마세요.
2. Account ID가 아닌 Player ID를 입력했다. (둘은 전혀 다릅니다)
3. 제대로 친건 맞으나 Unfriend상태인 유저의 개인 메시지를 차단했다.
-> 이 경우에는 다음과 같이 해결하세요
  1. Geometry Dash 를 키고 본인의 Profile에 들어간다(아이콘창 아님)
  2. 하단의 아이콘들중 설정 모양의 아이콘을 눌러 프로필 설정창에 들어간다.
  3. Message 수신범위를 All로 바꾼다.
  
  이렇게 해결한 뒤 !retry명령어로 재시도 해보세요.
4. 본인 프로필이 아니다.
5. 제게 문의하세요

Q: 코드가 날아왔는데 Geometry Dash 내에서 답장으로 !code (코드) 를 입력하면 되나요?
A: 아뇨. 코드 외웠으면 다시 해당 카톡방으로 돌아오셔서 진행하세요.
```

> !register

회원가입 절차를 실행합니다.


> !id (Account ID)

위 방법으로 알아낸 자신의 account id 를 입력하세요


> !code (Private Code)

!id 명령어로 정상적으로 발송했다는 문구를 받았다면 Geometry Dash를 키고 자신의 메시지함에 가보세요.
Deprecated라는 유저한테 개인 코드가 왔을 껍니다. 해당코드를 위와같이 입력하세요.


> !retry

코드전송 실패시 재시도 할때 이용하십시오. (코드 발송이 성공적으로 이루어진 후에는 사용불가능)


> !profile

가입후 자신의 GDBot 전용 프로필을 열람합니다. (아직 쓸모없음)


> !update

자신의 profile 을 업데이트 합니다.


> !sync (Account ID)

해당방에서 가입했으나, 카톡 닉네임을 바꿨을경우 계정 동기화를 위한 기능입니다.



## Ranking 관련

> !ranking (star|demon|diamond|cp|uc|sc)

해당 쿼리로 해당방에 GDBot에 가입된 유저들끼리의 랭킹을 열람합니다.


> !leaderboard (top|creators|fixedtop) (카운트)

해당 쿼리로 Geometry Dash 인게임 랭킹을 열람합니다. 카운트에 아무것도 안 적을시 기본으로 100명을 불러옵니다.
최대 약 1000위? 까지 열람 가능 _(fixedtop은 130+@ 까지만 가능)_


> !demonlist

Demonlist 레벨 전체 순위를 열람합니다.



## 봇 게임 관련

```
Tower 하는법

1. !profile 입력후 Tower_Level에 있는 id에 해당하는 레벨을 클리어하세요. (2.11 기록 갱신이 안되있는경우 재클리어 필요)
2. !클리어 하셨다면, 레벨 댓글에 가셔서 gg를 입력하세요. 이때 Percentage체크박스 꼭 체크하고 댓글다세요! 
3. 채팅방으로 오셔서 !tower를 입력하세요 :) 다음 타워로 이동하면서 레벨들을 클리어하세요!
```
> !tower

가입 유저만 사용가능합니다. 다음 타워로 이동합니다.


---

# Credit
본인 혼자 만듬 ㅋㅋ
Made by _DenFade_


---

# Last..

Discord: DenFade#3350

Email: rurchi1206@gmail.com
