
let myNumber = 12
let myNumber2 = myNumber

console.log('hello fundamentals')


let myName = 'paul'
let myName2 = myName

myName += 'ine'   // 아 거꾸로 안가는거지 사람 머리처럼 변한애는 변한거고 예전에 만들어두었던 백업은 그대로 인거고 
console.log(myName, myName2);


let user = {
    name : 'paul',
    age : 35
}

let user2 = user
user.name = 'stephane'

console.log(user, user2);   // 아까대로라면 stephen, paul이 나와야 하는데 stephen stephen이 나옴 ㅋㅋㅋ
                            


user2.name = 'victoria'
console.log(user, user2);  // 둘다 victoria로 바뀌어 버림ㅋㅋㅋㅋㅋㅋ
                        // variable complexe에게 =은 다른 말임. variable primitif에게는 =는 prendre la vlauer et stock

// j'assigne par reference. qui vont pointer dans le meme objet
// 객체나 배열에서 = 는 d'agginger par refencence. 결국 바탕화면에 복사본을 만드는 거랑 같네

// 그니까 varialb eprimitif 들에게 =은 외장하드에 백업을 저장하는것처럼 서로 다른 애가 되는데
// variable complexe에게 = 을 쓰면 바탕화면에 새로운 아이콘은 만드는거네. 그래서 뭘 누르든 하나의 프로그램이 실행되는거처럼.

//  그래서 배열의 복사본을 만들어서 variable primitif 처럼 하고 싶으면 이렇게 해야함

let user3 = {...user}   
user3.name ='soo'
console.log(user, user2, user3);
// 그럼 모든 파라미터를 복사해서 completement independante하게 만들어짐 

// 프로그래밍 언어들에는 variable을 저장하는 방법이 두가지로 나뉘어진다.  soit par valeur, soit par assignation





// 그래서 객체랑 배열에게는 인디펜던트한 복사본을 만드는 방법이 딱 하나 spread operator인건가??? ㄴㄴ 그건 아님
// 오 잠만 find도 인디펜던트한 복사복은 만드는 방법인건가?? ㅇㅇ
// map도 find도 새로운 객체를 만드는건데 forEach같은 경우에는 사용법에서부터 이미 새로운 변수를 생성하지도 않거니와, 수정도 못한다.

// 그리고 예를들어서 파라미터중에 하나 두개 빼고 복사하고 싶을때는?? => for ...in

let arr1 = [2, 5, 7]
let arr2 = arr1

arr1.push(9)   // 마치 let arr1 = [2, 5, 7]
                    // arr1.push(9) 

                    // let arr2 = arr1   이렇게 한 것과 같음

                        
console.log(arr1, arr2);


let arr3 = [3,5,7,9,11]
arr3.forEach(el=>el-=1)
console.log(arr3);
// arr3.forEach(el=>el-=1) 왠지 원래의 배열을 수정해서 [2,4,6,8,10] 으로 보여줄것 같지만, 사실상 forEach는 수정을 못함.
// 그냥 돌고 조건에 맞는 애를 보여줄뿐
// 만약에 이렇게 배열을 돌면서 값을 수정하고 싶을 때는 for을 이용해야한다.

for (let index = 0; index < arr3.length; index++) {
    arr3[index] = arr3[index] *= 10
}
console.log(arr3);


const originalObj = {
    a: 1,
    b: {
      c: 2,
      d: 3
    }
  };
  
  // spread 연산자를 사용한 얕은 복사
  const copiedObj = { ...originalObj };
  
  // 내부 객체 수정
  copiedObj.b.c = 20;
  copiedObj.a = 25
  
  console.log(originalObj); // 원본 객체
  console.log(copiedObj);   // 복사된 객체


const originalArr = [ 1, 2, 3]
const copiedArrByFind = originalArr.map(el=>{
  if(el>0){
    return el +=3
  }
})
console.log(copiedArrByFind);

copiedArrByFind[1] = 3
console.log(originalArr, copiedArrByFind);