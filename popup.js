// generate
const wrapper = document.querySelector('.wrapper-g'),
qrInput = wrapper.querySelector('.form input'),
generateBtn = wrapper.querySelector('.form button'),
qrImg = wrapper.querySelector('.qr-code img');

generateBtn.addEventListener('click', () => {
    let qrVal = qrInput.value;
    if(!qrVal)return;
    generateBtn.innerHTML = 'Generating QR Code...';
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrVal}`;
    qrImg.addEventListener('load', () => {
        wrapper.classList.add('active');
        generateBtn.innerHTML = 'Generate QR Code';
    });
});

qrInput.addEventListener('keyup', () => {
    if(!qrInput.value){
        wrapper.classList.remove('active');
    }
})

// scan
const wrappers = document.querySelector('.wrapper-s'),
form = wrappers.querySelector('#scan'),
fileInp = form.querySelector('#scan input'),
infoText = form.querySelector("#scan p"),
copyBtn = wrappers.querySelector(".copy"),
closeBtn = wrappers.querySelector(".close");

function fetchRequest(formData, file){
    infoText.innerText = "Scanning QR Code..."; 
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        infoText.innerText = result ? "Upload QR Code to Scan": "Couldn't Scan QR Code";
        if(!result) return;
        wrappers.querySelector("textarea").innerText = result;
        form.querySelector('img').src = URL.createObjectURL(file);        
        wrappers.classList.add('active');
    }).catch(() => {
        infoText.innerText = "Couldn't Scan QR Code";
    });
}

fileInp.addEventListener('change', e => {
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(formData, file);

} );

copyBtn.addEventListener('click', ()=>{
    let text =  wrappers.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
});

closeBtn.addEventListener('click', () => {
    wrappers.classList.remove('active');
});
form.addEventListener('click', () => fileInp.click());


// Drag Code
wrappers.addEventListener("dragover", (e)=>{
    e.preventDefault();
})
wrappers.addEventListener("drop", (e)=>{
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(formData, file);;

})

// ui
let current;
document.getElementsByClassName('generate')[0].addEventListener('click',()=>{
    current = '.wrapper-g';    
    document.querySelector('.wrapper').style.display='none';
    document.querySelector('.head svg').style.display='block';
    document.querySelector(`${current}`).style.display = 'block';
})

document.getElementsByClassName('scan')[0].addEventListener('click',()=>{
    current = '.wrapper-s';    
    document.querySelector('.wrapper').style.display='none';
    document.querySelector('.head svg').style.display='block';
    document.querySelector(`${current}`).style.display = 'block';
})

document.querySelector('.head svg').addEventListener('click', ()=>{
    document.querySelector(`${current}`).style.display = 'none';
    document.querySelector('.wrapper').style.display='flex';
    document.querySelector('.head svg').style.display='none';
})
