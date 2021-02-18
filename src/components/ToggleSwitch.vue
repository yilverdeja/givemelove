<template>
    <div class="switch-wrapper">
        <div class="sun"></div>
        <div class="toggle-wrapper">
            <input id="switch" type="checkbox" />
            <label for="switch" id="toggle">Toggle</label>
        </div>
        <div class="moon"></div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
/* Inspiration
https://github.com/bchiang7/bchiang7.github.io/blob/master/_includes/switch.html
https://github.com/bchiang7/bchiang7.github.io/blob/master/_scss/partials/_switch.scss 
*/
/* TODO: dark mode switch (white sun and moon) */
.switch-wrapper{
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -webkit-box-pack:center;
    -ms-flex-pack:center;
    justify-content:center;
    -webkit-box-align:center;
    -ms-flex-align:center;
    align-items:center;
    position:absolute;
    top:20px;
    right:30px
}
@media screen and (max-width:480px){
    .switch-wrapper{
        top:10px;
        right:20px
    }
}
.switch-wrapper .moon,.switch-wrapper .sun{
    width:17px;
    height:17px
}
.switch-wrapper .sun{
    background:url(~@/assets/sun.svg) no-repeat center;background-size:100%
}
.switch-wrapper .moon{
    background:url(~@/assets/moon.svg) no-repeat center;background-size:100%
}
.switch-wrapper .toggle-wrapper{
    margin:10px
}
.switch-wrapper .toggle-wrapper #switch{
    height:0;width:0;visibility:hidden;position:absolute
}
.switch-wrapper .toggle-wrapper #switch:checked+label{
    background:#bae67e
}
.switch-wrapper .toggle-wrapper #switch:checked+label:after{
    left:calc(100% - 3px);
    -webkit-transform:translateX(-100%);
    transform:translateX(-100%)
}
.switch-wrapper .toggle-wrapper label{
    cursor:pointer;
    text-indent:-9999px;
    width:45px;
    height:25px;
    background:grey;
    display:block;
    border-radius:100px;
    position:relative
}
.switch-wrapper .toggle-wrapper label:after{
    -webkit-transition:all .2s ease-in-out;
    transition:all .2s ease-in-out;
    content:'';
    position:absolute;
    top:3px;
    left:3px;
    width:19px;
    height:19px;
    background:#fff;
    border-radius:100%
}
</style>