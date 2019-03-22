window.onload = function() {
    let p = document.createElement('p');
    p.setAttribute('style', "color: white")
    p.innerText = 'изменения в main.js заметны';
    document.getElementById('side').appendChild(p);
};