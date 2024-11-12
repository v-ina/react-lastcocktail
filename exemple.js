let myObj = {
    product : "smartphone",
    price : 150
}
let myObj2 = {
    product : "ordi",
    price : 200
}

let arr = [1,2,3,4,5]

/* 이렇게 안쓰고
module.exports.monObjet = myObj
module.exports.monObjet2 = myObj2
module.exports.arr = arr
*/ 

// 이렇게 쓸거야 한줄로!
module.exports = { myObj, myObj2, arr }
// module.exports.myObj = myObj 와 같음

const identify = {
    name : 'paul',
    adress : 'bordeaux'
}
const identify2 = {
    name : 'pierre',
    adress : 'talence'
}

module.exports = {identify, identify2}



const myFunction = ()=>{
    console.log('hello from myFucntion');
}

module.exports = myFunction


const add = (nb1, nb2) =>{
    const result = nb1 + nb2
    console.log(result);
}
const substract = (nb1, nb2) =>{
    const result = nb1 - nb2
    console.log(result);
}


module.exports = {myFunction, add, substract}