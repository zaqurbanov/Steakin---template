const navList = document.querySelector(".nav-list");
const bars = document.querySelector(".bars");
const line1=document.querySelector(".line1");
const line2=document.querySelector(".line2");
const line3=document.querySelector(".line3");


bars.addEventListener("click",()=>{
    navList.classList.toggle("active");
    bars.classList.toggle("active");
})



const nav = document.querySelector(".nav");
console.log(nav);

window.addEventListener("scroll",()=>{
    if(window.scrollY>250){
        nav.classList.add("active");
    }
    else{
        if(nav.classList.contains("active")){
            nav.classList.remove("active")
        }
    }
})

// Up Arrow function

const upArrow = document.querySelector(".up-arrow");

upArrow.addEventListener("click",()=>{

    window.scrollTo({
        top:0,behavior:"smooth"
    })
})

