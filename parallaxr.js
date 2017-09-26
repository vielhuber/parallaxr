'use strict';
class parallaxr
{
    constructor(item)
    {
        this.item = item;
    }
    init()
    {
        this.onInit();
        this.onResize();
        window.addEventListener('resize', () => { this.onResize(); } );
        this.onScroll();
        window.addEventListener('scroll', () => { this.onScroll(); } );
    }
    onInit()
    {
        this.setImageDimensions();
    }
    onResize()
    {
        this.setContainerDimensions();
        this.setOccurence();
        this.checkDisabled();
    }
    onScroll()
    {
        this.setPosition();
    }
    setImageDimensions()
    {
        this.widthImage = this.item.querySelector('img').naturalWidth;
        this.heightImage = this.item.querySelector('img').naturalHeight;
    }
    setContainerDimensions()
    {
        this.heightContainer = this.outerHeight(this.item);
        this.widthContainer = this.outerWidth(this.item);
    }
    setOccurence()
    {
        /* image is visible on scroll pos 0 */
        if( this.offsetTop(this.item) <= window.innerHeight )
        {
            this.occurence = 1;
        }
        /* image is visible on scroll pos 100 */
        else if( (this.offsetTop(this.item)+this.outerHeight(this.item)) >= (this.documentHeight()-window.innerHeight) )
        {
            this.occurence = 3;
        }
        /* image is not visible on scroll pos 0 and 100 */
        else
        {
            this.occurence = 2;
        }
    }
    setPosition()
    {
        if( this.disabled === true )
        {
            console.log('DO NOTHING');
            return;
        }
        let pos = this.scrollTop(),
            pos_top,
            pos_bottom;
        if( this.occurence == 1 )
        {
            pos_top = 0;
            pos_bottom = (this.offsetTop(this.item)+this.outerHeight(this.item));
        }
        else if( this.occurence == 2 )
        {
            pos_top = (this.offsetTop(this.item)-window.innerHeight);
            pos_bottom = (this.offsetTop(this.item)+this.outerHeight(this.item));
        }
        else if( this.occurence == 3 )
        {
            pos_top = (this.offsetTop(this.item)-window.innerHeight);
            pos_bottom = this.documentHeight()-window.innerHeight;
        }
        let percent = 0;
        if( pos <= pos_top )
        {
            percent = 0;
        }
        else if( pos >= pos_bottom )
        {
            percent = 1;
        }
        else
        {
            percent = ((pos-pos_top)/(pos_bottom-pos_top));
        }
        let shift = Math.floor(percent * (((this.widthContainer/this.widthImage)*this.heightImage)-this.heightContainer));
        this.item.querySelector('img').style.transform = 'translateY(-'+(shift)+'px)';
    }   
    checkDisabled()
    {
        if( (this.widthImage/this.heightImage) > (this.widthContainer/this.heightContainer) )
        {
            this.disabled = true;
            this.item.querySelector('img').style.transform = 'translateY(0px)';
            this.item.querySelector('img').style.width = Math.floor((this.widthImage/this.heightImage)*(this.heightContainer))+'px';
            this.item.querySelector('img').style.left = ((-1)*(((this.widthImage/this.heightImage)*(this.heightContainer))-this.widthContainer)/2)+'px';
            this.item.querySelector('img').style.height = this.heightContainer+'px';
        }
        else
        {
            this.disabled = false;
            this.item.querySelector('img').style.left = '';
            this.item.querySelector('img').style.width = '';
            this.item.querySelector('img').style.height = '';
        }
    }
    outerWidth(el)
    {
        return el.offsetWidth + parseInt(getComputedStyle(el).marginLeft) + parseInt(getComputedStyle(el).marginRight);
    }
    outerHeight(el)
    {
        return el.offsetHeight + parseInt(getComputedStyle(el).marginTop) + parseInt(getComputedStyle(el).marginBottom);
    }
    scrollTop()
    {
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }
    documentHeight()
    {
        return Math.max(document.body.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight, document.documentElement.scrollHeight);
    }
    offsetTop(el)
    {
        return (el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop);
    }
    static addStyles()
    {
        let style = document.createElement('style');
        style.innerHTML = `
            .parallaxr
            {
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 50vh; /* default height */
            }
            .parallaxr *
            {
                z-index: 400;
                position: relative;
            }
            .parallaxr img
            {
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                width: 100%;
                height: auto;
                max-width: none;
                z-index: auto;
            }
        `;
        let ref = document.querySelector('script');
        ref.parentNode.insertBefore(style, ref);
    }
}
window.onload = function()
{
    parallaxr.addStyles();
    [].forEach.call(document.querySelectorAll('.parallaxr'), function(el)
    {
        let item = new parallaxr(el);
        item.init();
    });
}