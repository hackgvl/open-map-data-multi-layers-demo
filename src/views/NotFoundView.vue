<template>
    <div class="star star1"></div>
    <div class="star star2"></div>
    <div class="star star3"></div>
    <div class="star star4"></div>
    <div class="star star5"></div>

    <div class="error grid justify-items-center h-full place-content-center">
        <div class="text-white text-[10em]">404</div>
        <div class="text-white text-[2em]">Page Not Found</div>
    </div>
</template>

<style>
html,
body {
    margin: 0px;
    background: linear-gradient(90deg, rgba(47, 54, 64, 1) 23%, rgba(24, 27, 32, 1) 100%);
}

.star {
    background: rgb(230, 230, 90);
    position: absolute;
    width: 5px;
    height: 5px;
    content: '';
    border-radius: 100%;
    transform: rotate(250deg);
    opacity: 0.4;
    animation-name: shimmer;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}


.star1 {
    top: 40%;
    left: 75%;
    animation-delay: 1s;
}

.star2 {
    top: 60%;
    left: 90%;
    animation-delay: 3s;
}

.star3 {
    top: 10%;
    left: 70%;
    animation-delay: 2s;
}

.star4 {
    top: 90%;
    left: 40%;
}

.star5 {
    top: 20%;
    left: 30%;
    animation-delay: 0.5s;
}
</style>