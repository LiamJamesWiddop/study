<template>
    <div class="rippleContainer" ref="rippleContainer">
        <div :class="ripple.class"
        v-for="ripple in ripples"
        :key="ripple.id"
        :style="ripple.style"></div>
        <div class="ripple"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';

interface parentProperties {
    x:number,
    y:number,
    halfwidth:number,
    halfheight:number
}

@Options({

})
export default class Ripple extends Vue {
    @Prop({}) white: boolean;
    @Prop({}) circle: boolean;

    rippleContainer:HTMLElement;
    parent:HTMLElement;
    ripples: {
        id: number,
        deletedAt: number,
        class:{
            ripple:boolean,
            white:boolean,
            flagged:boolean
        },
        style: {
            left: string,
            top: string,
            width: string,
            height: string,
        },
    }[] = [];
    updateTimerID: any | false = false;
    mouseDownListener: any;
    touchDownListener: any;
    mouseUpListener: any;

    mounted() { 
        this.rippleContainer = this.$refs.rippleContainer as HTMLElement;
        if(this.rippleContainer.parentElement){
            this.parent = this.rippleContainer.parentElement;
        }
        this.getBorderRadius();
        this.createListeners();
        this.events();
    }

    getBorderRadius(){
        let css = window.getComputedStyle(this.parent, null);
        this.rippleContainer.style.borderTopLeftRadius = css.borderTopLeftRadius;
        this.rippleContainer.style.borderTopRightRadius = css.borderTopRightRadius;
        this.rippleContainer.style.borderBottomLeftRadius = css.borderBottomLeftRadius;
        this.rippleContainer.style.borderBottomRightRadius = css.borderBottomRightRadius;
    }

    createListeners(){
        this.mouseDownListener = (event:MouseEvent):void => {
            event.stopPropagation();
            let parent:parentProperties = this.getContainerProperties();

            // position
            let x:number = event.clientX - parent.x;
            let y:number = event.clientY - parent.y;

            // size
            let maxCircleSize:number = this.getSize(parent,x,y);
            this.newRipple(x,y,maxCircleSize);
        };

        this.touchDownListener = (event:TouchEvent):void => {
            let parent:parentProperties = this.getContainerProperties();

            // position
            let x:number = event.touches[0].clientX - parent.x;
            let y:number = event.touches[0].clientY - parent.y;

            
            // size
            let maxCircleSize:number = this.getSize(parent,x,y);
            this.newRipple(x,y,maxCircleSize);
        };

        this.mouseUpListener = () => {
            this.flagRipples();
        };
    }

    getSize(parent:parentProperties,x:number,y:number):number{
        // size
        let centreOffsetX = Math.abs(parent.halfwidth - x);
        let centreOffsetY = Math.abs(parent.halfheight - y);
        let maxWH = Math.max(parent.halfwidth*2,parent.halfheight*2);
        return (Math.max(centreOffsetX,centreOffsetY) * 2 + maxWH) * 1.5;
    }

    events(){
        if(this.parent){
            // mouse events
            this.parent.addEventListener("mousedown",this.mouseDownListener);
            this.parent.addEventListener("mouseout",this.mouseUpListener);
            this.parent.addEventListener("mouseup",this.mouseUpListener);

            // touch events
            this.parent.addEventListener("touchstart",this.touchDownListener);
            this.parent.addEventListener("touchout",this.mouseUpListener);
            this.parent.addEventListener("touchend",this.mouseUpListener);
        }
    }

    getContainerProperties():parentProperties{
        let parentBox = this.rippleContainer.getBoundingClientRect();
        return {
            x:parentBox.left,
            y:parentBox.top,
            halfwidth:parentBox.width/2,
            halfheight:parentBox.height/2
        }
    }
    
    beforeDestroy() {
        let rippleContainer = this.$refs.rippleContainer as Element;
        if(!parent) {return;}
        parent.removeEventListener("mousedown",this.mouseDownListener);
        parent.removeEventListener("touchstart",this.touchDownListener); 
        parent.removeEventListener("mouseout",this.mouseUpListener);
        parent.removeEventListener("touchout",this.mouseUpListener);
        parent.removeEventListener("mouseup",this.mouseUpListener);
        parent.removeEventListener("touchend",this.mouseUpListener);
    }

    newRipple(centerX:number,centerY:number,maxDiameter:number) {
        let ripple = {
            id: Date.now(),
            deletedAt: 0,
            class:{
                ripple:true,
                white:this.white,
                flagged:false
            },
            style: {
                left: `${centerX - (maxDiameter / 2)}px`,
                top: `${centerY - (maxDiameter / 2)}px`,
                width: `${maxDiameter}px`,
                height: `${maxDiameter}px`,
            },
        };
        this.ripples.push(ripple);

        if(this.updateTimerID === false) {
            this.updateTimerID = setInterval(() => {
                if(this.ripples.length === 0) {
                    clearInterval(this.updateTimerID);
                    this.updateTimerID = false;
                    return;
                }
                this.updateRipples();
            },1000);
        }
    }
    
    flagRipples() {
        for(let ripple of this.ripples) {
            if(!ripple.class.flagged) {
                ripple.class.flagged = true;
                ripple.deletedAt = Date.now();
            }
        }
    }

    updateRipples() {
        let i = 0;
        while(i < this.ripples.length) {
            let ripple = this.ripples[i];

            if(ripple.class.flagged && ((Date.now() - ripple.deletedAt) > 1000)) {
                this.ripples.splice(i,1);
            }
            else {
                i++;
            }
        }
    } 
}

</script>
 
<style lang="scss" scoped>
    .rippleContainer{
        pointer-events: none;
        position: absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        z-index: 999;
        overflow: hidden;
    }
    .ripple{
        position: absolute;
        pointer-events: none;
        transform: scale3d(1,1,1);
        border-radius: 50%;
        z-index: 99;
        animation-name: expand;
        animation-duration: 2s;
        animation-timing-function: cubic-bezier(0,.25,.18,.92);
        transition: all 0.6s $cubic;
        opacity: 0.075;
        background: $black;
        z-index: 99;
    }
    .white{
        background: #FFFFFF;
        opacity: 0.3;
    }
    .flagged{
        transform: scale3d(1,1,1);
        opacity: 0;
        animation-duration: 1.25s;
    }

    @keyframes expand {
        from{
            transform: scale3d(0,0,1);
        }
        to{
            transform: scale3d(1,1,1)
        }
    }

</style>

