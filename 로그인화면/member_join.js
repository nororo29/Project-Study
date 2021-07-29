
// 입력양식 유효성 검사 통과 플래그들
var emailFlag = false;
var pwdFlag_1 = false;
var pwdFlag_2 = false;
var pwdFlag_3 = false;
var pwdConfFlag = false;
var nameFlag = false;
var phoneFlag = false;
var checkboxFlag = false;



window.onload = function() {

    // 로그인 버튼 
    const joinBtn = document.querySelector('#join_button');

    // 입력양식 태그들
    const memEmail = document.getElementById('mem_email');
    const memPwd = document.getElementById('mem_pwd');
    const memPwdConf = document.getElementById('mem_pwd_confirm');
    const memName = document.getElementById('mem_name');
    const memPhone = document.getElementById('mem_phone');

    // 비번확인 경고 문자 태그
    const pwdConf_WarnTxt = document.getElementById("pwd_conf_warn_txt");

    // 체크박스 태그들
    const checkAll = document.querySelector(".checkAll input");
    const checkElemClass = document.getElementsByClassName('confirm');



//------------------------------------------------------------------------


    // 이메일 유효성 검사
    // 이메일 포커스 아웃될 때 유효성 검사
    memEmail.addEventListener('blur', function() {
        var emailStr = memEmail.value;
        var emailWarnTxt = memEmail.nextElementSibling;

        // 이메일 입력 값 공백이면, 경고문구 보이게
        if (isEmpty(emailStr)) {
            var warningStr = '이메일을 입력하세요.';
            emailWarnTxt.textContent = warningStr;

            emailWarnTxt.style.display = 'block';
            emailWarnTxt.style.color = 'red';
            emailFlag = false;

            return;
        }
        
        // 이메일 입력 값 유효성체크 함수 false이면, 경고문구 보이게
        if (!isValidEmail(emailStr)) {
            var warningStr = '이메일을 올바르게 입력해주세요';
            emailWarnTxt.textContent = warningStr;

            emailWarnTxt.style.display = 'block';
            emailWarnTxt.style.color = 'red';
            emailFlag = false;

            return;
        }

        // 유효성체크 true이면, 경고문구 안보이게
        emailWarnTxt.style.display = 'none';
        emailFlag = true;

    });



    // 이메일 키 입력될 때마다, pwd의 유효성 검사 3번 실행
    memEmail.addEventListener('keyup', function() {
        // 아직 pwd를 클릭하지 않아서 경고 요소가 안만들어졌으면 pwd검사 안함
        var sibling1 = memPwd.nextElementSibling;

        if (sibling1 == null) {
            return;
        }

        // pwd경고요소 만들어져 있으면 유효성 검사
        checkPwd(null, memEmail, memPwd);
    });



//------------------------------------------------------------------------


    // 비밀번호 유효성 검사
    // 비밀번호 클릭하면, 검사될 조건 표시하기 - 1번만 실행되는 함수
    memPwd.addEventListener('focus', function(){

        // 경고태그에 들어갈 문자들 배열
        var warnArr = [
            "영문/숫자/특수문자 2가지 이상 조합 (8~20자)",
            "3개 이상 연속되거나 동일한 문자/숫자 제외",
            "아이디(이메일) 제외",
            "비밀번호에 사용할 수 없는 문자가 포함되어 있습니다.",
            "사용 가능한 비밀번호입니다."
        ];

        // 경고태그 3개 생성하고 출력
        for(var i = 0; i < 5; i++) {
            var newP = document.createElement("p");
            newP.setAttribute('class', 'warn_txt');  // 클래스 값 주기
            newP.innerHTML = warnArr[i];

            if(i < 3) {  // 3개 요소만 보이게 설정
                newP.style.display = 'block';
            }

            memPwd.parentNode.append(newP);
        }

    }, {once: true});  // 한번만 실행되게...


    // 비밀번호 키 입력될 때마다, 유효성 검사하기
    memPwd.addEventListener('keyup', function(event) {  // keydown 사용하면 value에 현재 입력한 key값이 포함되지 않음.
        
        // 현재 입력한 키값.
        key = event.key;

        checkPwd(key,memEmail, memPwd);
       
    });



//------------------------------------------------------------------------


    // 비밀번호 확인 유효성 검사
    // 비번 확인 클릭하면, 경고문구 검정색 띄우고, 
    memPwdConf.addEventListener('click', function(){
        
        // 경고문 태그
        pwdConf_WarnTxt.innerHTML = "확인을 위해 새 비밀번호를 다시 입력해주세요.";
        pwdConf_WarnTxt.style.display = "block";

    }, {once: true});


    // 비번 확인버튼이 클릭된 후,,, 비번,비번확인 요소 keyup일어나면 유효성 검사...
    memPwdConf.addEventListener('click', function(){

        // 비밀번호 확인 입력 keyup되면 유효성 체크
        $("input[type='password']").keyup(function(){
            
            // 비번값, 비번확인값 가져오기
            var pwd1 = $("#mem_pwd").val();
            var pwd2 = $("#mem_pwd_confirm").val();
    
            // 비번, 비번확인 비어있지 않으면!!
            if(pwd1 != "" || pwd2 != "") {
                if(pwd1 == pwd2) { // 일치
                    pwdConf_WarnTxt.innerHTML = "새 비밀번호가 일치합니다.";
                    pwdConf_WarnTxt.style.color = "blue";
                    pwdConf_WarnTxt.style.display = "block";
                    pwdConfFlag = true;
                } else { // 불일치
                    pwdConf_WarnTxt.innerHTML = "새 비밀번호가 일치하지 않습니다.";
                    pwdConf_WarnTxt.style.color = "red";
                    pwdConf_WarnTxt.style.display = "block";
                    pwdConfFlag = false;
                }
            } else {   // 둘 다 비어 있을 경우
                pwdConf_WarnTxt.innerHTML = "확인을 위해 새 비밀번호를 다시 입력해주세요.";
                pwdConfFlag = false;
            }
            
        });

    });




//------------------------------------------------------------------------



    // 이름 유효성 체크
    // 이름 값 포커스 아웃될 때, 유효성체크
    memName.addEventListener('blur', function(){
        var memNameStr = memName.value;
        // console.log(memNameStr);

        var nameWarnTxt = memName.nextElementSibling;
        var regExp = /^[가-힣]{2,20}$/;
        

        // 이름 입력값 비어있거나, 정규식에 맞지 않을 때
        if (isEmpty(memNameStr) || !isValidPattern(regExp, memNameStr)) {
            var warningStr = '이름을 정확히 입력하세요.';
            nameWarnTxt.textContent = warningStr;
            nameWarnTxt.style.display = 'block';
            nameWarnTxt.style.color = 'red';
            nameFlag = false;

            return;
        } else {
            nameWarnTxt.style.display = 'none';
            nameFlag = true;

            return;
        }

    });



//------------------------------------------------------------------------



    // 전화번호 유효성 체크
    // 전화번호 포커스 아웃되면, 유효성 체크
    memPhone.addEventListener('blur', function(){
        var memPhoneStr = memPhone.value;
        // console.log(memPhoneStr);

        var phoneWarnTxt = memPhone.nextElementSibling;
        var regExp = /^01(0|1|6|7|8|9)-?[0-9]{3,4}-?[0-9]{4}$/;
        

        // 이름 입력값 비어있거나, 정규식에 맞지 않을 때
        if (isEmpty(memPhoneStr) || !isValidPattern(regExp, memPhoneStr)) {

            var warningStr = '휴대폰 번호를 정확하게 입력하세요.';
            phoneWarnTxt.textContent = warningStr;
            phoneWarnTxt.className = "warn_txt block_txt";  // 클래스를 설정하여 css 바꾸기 효과
            phoneFlag = false;

            return;

        } else {
            phoneWarnTxt.className = "warn_txt";
            phoneFlag = true;

            return;
        }

    });



//------------------------------------------------------------------------


    // 체크박스 유효성 검사...
    const checkElements = [
        checkElemClass[0], checkElemClass[1], checkElemClass[2], checkElemClass[3], checkElemClass[4]
    ];


    checkAll.addEventListener('change', function(){
        

        var checkStat = checkAll.checked;

        checkElements.forEach(element => element.checked = checkStat);
        checkboxFlag = checkStat;


        // if(checkAll.checked) {
        //     checkElements.forEach(element => element.checked = true);
        //     // console.log(checkElements);
        //     checkboxFlag = true;
        // } else {
        //     checkElements.forEach(element => element.checked = false);
        //     checkboxFlag = false;
        // }

    });

    checkElements.forEach(function(elem){
        elem.addEventListener('change', function(){
            if (elem.checked == false) {
                checkAll.checked = false;
                checkboxFlag = false;
            } else {
                if (allCheked(checkElements)) {
                    checkAll.checked = true;
                    checkboxFlag = true;
                }
            }
        });
    });


//------------------------------------------------------------------------


    // 로그인 버튼 눌렀을 때...
    joinBtn.addEventListener('click', function(){
        // console.log("emailFlag : " + emailFlag);
        // console.log( pwdFlag_1 + " " + pwdFlag_2 + " " + pwdFlag_3);
        // console.log(pwdFlag_1 && pwdFlag_2 && pwdFlag_3);
        // console.log(pwdConfFlag);
        // console.log(nameFlag);
        // console.log(phoneFlag);
        // console.log(checkboxFlag);

        var pwdFlag = pwdFlag_1 + " " + pwdFlag_2 + " " + pwdFlag_3;

        if (emailFlag && pwdFlag && pwdConfFlag && nameFlag && phoneFlag && checkboxFlag) {
            confirm("회원가입 하시겠습니까?");
        } else {
            memEmail.focus();
        }
        
    });
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





// 공백문자 체크 함수
function isEmpty(str) {
    var flag = false;

    try {
        if (str.split(" ").join("") == "") {
            flag = true;
        }
    } catch (error) {
        console.log(error.message);
        flag = false;
    }

    return flag;
}


// 패턴검사 공용함수
function isValidPattern(regExpObj, targetStr) {
    var flag = false;
  
    try {
      flag = regExpObj.test(targetStr);
    } catch (e) {
      alert("isValidPattern 함수 호출 시 예외 발생" + e.message);
      flag = false;
    }
  
    return flag;
}


// 이메일 유효성 검사 함수
function isValidEmail(emailStr) {
    var flag = false;

    try {
        var regExp = new RegExp(
            /^([a-zA-Z0-9_-]+)@([a-zA-Z0-9_-]+)(\.[a-zA-Z0-9_-]+){1,2}$/
        );
        flag = regExp.test(emailStr);
    } catch (e) {
        console.log(e.message);
        flag = false;
    }

    return flag;
}



// 비밀번호 체크 함수 1 - 영문/숫자/특수문자 2가지 이상 조합 (8~20자)
function isValidPwd_1(pwdStr) {

    var num = pwdStr.search(/[0-9]/g);  // 숫자 위치 반환, 없으면 -1
    var eng = pwdStr.search(/[a-zA-Z]/ig);  // 영문 위치 반환
    var spe = pwdStr.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);  // 특수문자 위치

    if (pwdStr.length < 8 || pwdStr.length > 20) {
        return false;
    } else if ( (num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0) ) {
        return false;
    } else {
        return true;
    }
}



// 체크박스 다 체크되어있는지
function allCheked(checkElements) {

    for(var i = 0; i < checkElements.length; i++) {
        if (checkElements[i].checked == false)
            return false;
    }

    return true;


}



// 경고문구 3개 출력함수
// showPwdWarnTxt3(pwdWarnTxt);
function showPwdWarnTxt3(pwdWarnTxt) {
    
    pwdWarnTxt.forEach(function(element) { 
        element.style.display = 'block'
        // element.style.color = 'red'
    });

    pwdWarnTxt[3].style.display = 'none';
    pwdWarnTxt[4].style.display = 'none';

}


// 경고문구 space 출력 함수
// showPwdWarnTxt_space(pwdWarnTxt);
function showPwdWarnTxt_space(pwdWarnTxt) {

    pwdWarnTxt.forEach(element => element.style.display = 'none');

    pwdWarnTxt[3].style.display = 'block';
    pwdWarnTxt[3].style.color = 'red';

}


// 경고문구 true 출력함수
// showPwdWarnTxt_true(pwdWarnTxt);
function showPwdWarnTxt_true(pwdWarnTxt) {
    
    pwdWarnTxt.forEach(element => element.style.display = 'none');

    pwdWarnTxt[4].style.display = 'block';
    pwdWarnTxt[4].style.color = 'blue';

}


// pwd 유효성 검사 3 - pwd에 아이디값 들어있으면 false, 아니면 true
// isValidPwd_3(memEmail, memPwd);
function isValidPwd_3(memEmail, memPwd) {

    var memPwdStr = memPwd.value;
    var memEmailStr = memEmail.value;

    var sliceIndex = memEmailStr.indexOf('@');  // @ 인덱스 가져오기

    if (sliceIndex <= 0) {  // @ 없으면 전체가 아이디
        return true;
    } else {  // @ 있으면 @ 전까지가 아이디
        var email_id = memEmailStr.slice(0, sliceIndex);
    }


    if (memPwdStr.indexOf(email_id) != -1) {
        return false;
    } else {
        return true;
    }

}



function checkPwd(key, memEmail, memPwd){

    // 비번 입력값 전체 - 현재입력값 포함..
    var memPwdStr = memPwd.value;

    // 경고문구
    let siblings = memPwd.nextElementSibling;
    const pwdWarnTxt = [siblings];  // 경고문구 배열...

    while (siblings) {  // 배열 추가...
        siblings = siblings.nextElementSibling;
        pwdWarnTxt.push(siblings);
    }

    pwdWarnTxt.pop();  // 마지막에 null추가 되서 하나 빼줌




    // 비번 값 없으면 
    // => 경고문 3개 red로 보이게, 스페이스 경고문은 안보이게
    // => showPwdWarnTxt3(pwdWarnTxt);
    if (memPwdStr == "") {

        pwdWarnTxt.forEach(function(element) { 
            element.style.color = 'red';
            pwdFlag_1 = pwdFlag_2 = pwdFlag_3 = false;
        });

        showPwdWarnTxt3(pwdWarnTxt);
        return;
    } 
    

    // 스페이스 입력하면 => 스페이스 경고문구 1개 계속...
    // => showPwdWarnTxt_space(pwdWarnTxt);
    if (key == " " || memPwdStr.includes(" ")) {
        showPwdWarnTxt_space(pwdWarnTxt);
        return;
    }


    // pwdWarnTxt_1 유효성 체크 : 영문/숫자/특수문자 2가지 이상 조합 (8~20자)
    if (!isValidPwd_1(memPwdStr)) {
        pwdWarnTxt[0].style.color = 'red';
        showPwdWarnTxt3(pwdWarnTxt);
        pwdFlag_1 = false;
    } else {
        pwdWarnTxt[0].style.color = 'blue';
        pwdFlag_1 = true;
    }



    // pwdWarnTxt_2 유효성 체크 : 3개 이상 동일한 문자/숫자 제외
    if (isValidPattern(/(\w)\1\1/,memPwdStr)) {  // 3개이상 연속되는 문자 정규식은 또 다름...
        pwdWarnTxt[1].style.color = 'red';
        showPwdWarnTxt3(pwdWarnTxt);
        pwdFlag_2 = false;
    } else {
        pwdWarnTxt[1].style.color = 'blue';
        pwdFlag_2 = true;
    }
        


    // pwdWarnTxt_3 유효성 체크 : 아이디(이메일 @ 이전 부분) 제외
    if (!isValidPwd_3(memEmail, memPwd)) {  // 3개이상 연속되는 문자 정규식은 또 다름...
        pwdWarnTxt[2].style.color = 'red';
        showPwdWarnTxt3(pwdWarnTxt);
        pwdFlag_3 = false;
    } else {
        pwdWarnTxt[2].style.color = 'blue';
        pwdFlag_3 = true;
    }



    // 다 파란색이면,,,
    // => showPwdWarnTxt_true(pwdWarnTxt);
    if (pwdFlag_1 && pwdFlag_2 && pwdFlag_3) {
        showPwdWarnTxt_true(pwdWarnTxt);
        return;
    }
}