const eleA = $('#A');
eleA.on('click', () => {
    alert(111)
});
eleA.on('mouseover', () => {
    alert(333)
});

setTimeout(() => {
    console.error(222);
}, 1000)
