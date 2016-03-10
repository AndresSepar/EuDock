/*
 * euDock - javascript Emulation of Dock style MAC OS X bar
 *
 * Version: 1.06
 *
 * Copyright (C) 2006 Parodi (Pier...) Eugenio <piercingslugx@inwind.it>
 *                                              http://eudock.jules.it
 *
 * This library is free software; you can redistribute it and/or             
 * modify it under the terms of the GNU Lesser General Public                
 * License as published by the Free Software Foundation; either              
 * version 2.1 of the License, or (at your option) any later version.        
 *                                                                           
 * This library is distributed in the hope that it will be useful,           
 * but WITHOUT ANY WARRANTY; without even the implied warranty of            
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU         
 * Lesser General Public License for more details.                           
 *                                                                           
 * You should have received a copy of the GNU Lesser General Public          
 * License along with this library; if not, write to the Free Software       
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 */

 /*
  *
  * This program is absolutely free...
  *           ...BUT...
  * If you modify(OR TRY TO DO THAT)this Source Code,
  * my SOUL will carry you some monstrous Nightmares
  *
  * Have a nice day
  * enjoy yourself.
  *          Pier...
  *
  * (Sorry but I'm Italian not an American writer)
  *                            (...a day Maybe...)
  */


var TimEutID;
var TimEutIDScroll;
//var euDims = new Array(0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1);
var euDims = new Array(0.3,0.4,0.5,0.6,0.7,0.8,0.9,1);
var euImmagini = new Array();
var euFrameWidth=0;
var euFrameHeight=0;
var euScrOfY=2000;
var euScrOfX=0;

var euAlign="bottom";

var euTimeOver = 20;
var euTimeBar  = 20;

var euBar = false;
var euBarOffsEut = 0;
var euImagesOffsEut = 0;

var euImgLT;
var euImgC;
var euImgRB;

var euIdObjHook = null;
var euIdObjHookPos = null;
var euBoolHookPos = false;
var euHookPosX = 0;
var euHookPosY = 0;

//window.onscroll = test;
var bkEupOnScroll = window.onscroll;
var bkEupOnResize = window.onresize;
window.onresize = euOnResize;
window.onscroll = euOnScroll;

function euOnResize(event){
    if (bkEupOnResize)
        bkEupOnResize(event);
    ridefinisciParametrEu();
};

function euOnScroll(event){
    if (bkEupOnScroll)
        bkEupOnScroll(event);
    ridefinisciParametrEu();
};

function ridefinisciParametrEu(){
    if (TimEutIDScroll!=null)
        clearTimeout(TimEutIDScroll);
    TimEutIDScroll=window.setTimeout("euAdjScroll(5);",20);
    return true;
};

function euAdjScroll(retry){
    XBkup = euScrOfX;
    YBkup = euScrOfY;
    b = false;
    diffX = 0;
    diffY = 0;

    euDimensioni();
    offsEut();

    b |= (XBkup != euScrOfX);
    if (XBkup != euScrOfX)
        if ((Math.abs(diffX=((euScrOfX-XBkup)/2)))>0.5)
            euScrOfX=Math.round(XBkup+diffX);
    b |= (YBkup != euScrOfY);
    if (YBkup != euScrOfY)
        if ((Math.abs(diffY=((euScrOfY-YBkup)/2)))>0.5)
            euScrOfY=Math.round(YBkup+diffY);

    disegnEu();


    if (TimEutIDScroll!=null)
        clearTimeout(TimEutIDScroll);
    if (!b)
        retry--;
    if (retry>0)
        TimEutIDScroll=window.setTimeout("euAdjScroll("+retry+");",euTimeBar);
};

function hookEuPos(posX,posY){
 	unHookEuDock();
	euBoolHookPos = true;
	euHookPosX = posX;
	euHookPosY = posY;
};

function hookEuDock(idObj,position){
 	unHookEuDock();	
    euIdObjHook    = document.getElementById(idObj);
    euIdObjHookPos = position.toLowerCase();
    ridefinisciParametrEu();
};

function unHookEuDock(){
    euIdObjHook    = null;
    euIdObjHookPos = null;
	euBoolHookPos = false;
    ridefinisciParametrEu();
};


function setEuDockSteps(array){
    euDims = array;
};

function getEuDockSteps(){
    return euDims;
};


function preloadImages(a) {
  var d=document;
  if(d.images){
      if(!d.p) d.p=new Array();
        var i,j=d.p.length;
        for(i=0; i<a.length; i++){
                d.p[j]=new Image;
                d.p[j++].src=a[i];
            }
  }
};

function immaginEu(euSrcArray,id,attributes){

    this.id=id;
    this.idImmaginiArray = euImmagini.length;

    image = "\n<img src='"+euSrcArray[0]+"' id='"+id+"' border='0' "+
            "style=\"visibility:hidden;cursor:pointer;position: absolute; left:-500px; z-index:15;\"  " +
            "onMouseOver=\"imgEuver("+this.idImmaginiArray+");\"  " +
            "onMouseOut=\"imgEut("+this.idImmaginiArray+");\"  " +
            "onLoad=\"imgShEuw("+this.idImmaginiArray+");\"  "+
            "onClick=\"imgClEulick("+this.idImmaginiArray+");"+(attributes)+"\" >\n";
    document.write(image);

    image = "<img src='"+euSrcArray[0]+"' id='Fading"+id+"' border='0' "+
            "style=\"visibility:hidden;cursor:pointer;position: absolute; left:-500px; z-index:14;\" >\n";
    document.write(image);

    this.num = 0;
    this.img = document.getElementById(id);
    this.imgFading = document.getElementById("Fading"+id);
    this.euSrcArray = euSrcArray;
    this.kost = (1/((2*(this.euSrcArray.length))-2));

    this.width  = 0;
    this.height = 0;

    this.fadingState = 0;
    this.fadingType='opaque';

    this.selected = false;
    this.loaded = false;
    this.endProcess = true;

    // OnMouseOver Image Event
    this.onMouseOver = "";
    this.setOnMouseOver = function(ret){
        this.onMouseOver = ret;
    };
    this.evalOnMouseOver = function(){
        window.setTimeout(this.onMouseOver,1);
    };

    // OnMouseOut Image Event
    this.onMouseOut = "";
    this.setOnMouseOut = function(ret){
        this.onMouseOut = ret;
    };
    this.evalOnMouseOut = function(){
        window.setTimeout(this.onMouseOut,1);
    };

    // OnMouseClick Image Event
    this.onMouseClick = "";
    this.setOnMouseClick = function(ret){
        this.onMouseClick = ret;
    };
    this.evalOnMouseClick = function(){
        window.setTimeout(this.onMouseClick,1);
    };

    // OnChangeImage Image Event
    this.onChangeImage = "";
    this.setOnChangeImage = function(ret){
        this.onChangeImage = ret;
    };
    this.evalOnChangeImage = function(){
        window.setTimeout(this.onChangeImage,1);
    };

    // OnChangeSize Size Event
    this.onChangeSize = "";
    this.setOnChangeSize = function(ret){
        this.onChangeSize = ret;
    };
    this.evalOnChangeSize = function(){
        window.setTimeout(this.onChangeSize,1);
    };

    this.setPos = function(x,y){
        this.img.style.left = x+"px";
        this.img.style.top  = y+"px";
        this.imgFading.style.left = x+"px";
        this.imgFading.style.top  = y+"px";
    };

    this.getPosX = function(){
        return this.img.left;
    };

    this.getPosY = function(){
        return this.img.top;
    };

    this.setFadingSteps = function(steps){
        this.kost=(1/steps);
    };


    this.setImage = function(newImage){
        this.fadingState=0;
        this.img.src=newImage;
        this.imgFading.src=newImage;
        //this.imageState = -1;
        //this.fadingByState();
        this.setImageArray(new Array(newImage));
    };

    this.setImageArray = function(newArray){
        this.euSrcArray = newArray;
        this.kost = (1/((2*(this.euSrcArray.length))-2));
        this.imageState = -1;
        this.fadingByState;
        preloadImages(this.euSrcArray);
    };

    preloadImages(this.euSrcArray);

    this.setFadingType = function(type){
        this.fadingType=type.toLowerCase();
    };

    this.getImageArray = function(){
        return this.euSrcArray;
    };

    this.getImage = function(){
        return this.euSrcArray[Math.floor(this.fadingState*(this.euSrcArray.length-1))];
    };
    this.getFadingImage = function(){
        return this.euSrcArray[Math.ceil(this.fadingState*(this.euSrcArray.length-1))];
    };

    this.setWidth = function(w){
        this.width=w;
    };

    this.setHeight = function(h){
        this.height=h;
    };

    this.getWidth = function(){
        return Math.round(this.width*euDims[this.num]);
        //return this.img.width;
    };

    this.getHeight = function(){
        return Math.round(this.height*euDims[this.num]);
        //return this.img.height;
    };

    this.getMaxWidth = function(){
        return this.width;
    };

    this.getMaxHeight = function(){
        return this.height;
    };

    this.idArray = function(){
        return Math.floor((this.num*(this.euSrcArray.length-1))/(euDims.length-1));
    };

    this.fraction = function(){
        if (this.euSrcArray.length==1)
            return 1;
        ret = (this.num*(this.euSrcArray.length-1))/(euDims.length-1);
            return (ret-Math.floor(ret));
    };
        
    this.isNotMax = function(){
        return this.num<euDims.length-1;
    };

    this.isNotMin = function(){
        return this.num>0;
    };

    this.isMax = function(){
        return this.num==euDims.length-1;
    };

    this.isMin = function(){
        return this.num==0;
    };

    this.setFadingState = function(fad){
        if (this.euSrcArray.length>1){
            if (this.fadingState != fad){
                if (Math.abs(fad-this.fadingState)>this.kost){
                    if (fad>this.fadingState)
                        this.fadingState += this.kost;
                    else
                        this.fadingState -= this.kost;
                    if (this.fadingState>1)
                        this.fadingState=1;
                    if (this.fadingState<0)
                        this.fadingState=0;
                }else
                    this.fadingState = fad;
                this.fadingByState();
                return true;
            }
        }
        return false;
    };

    this.imageState = 0;
    this.fadingByState = function(){
        stato = (this.fadingState*(this.euSrcArray.length-1));
        b = ((Math.floor(stato) != Math.floor(this.imageState)) ||
             (Math.ceil( stato) != Math.ceil( this.imageState)));
            //document.getElementById('test').innerHTML+='<br>stato = '+stato+' - '+Math.floor(stato)+'<br>imageState='+this.imageState+' - '+Math.floor(this.imageState);
        this.imageState=stato;
        if (Math.round(stato)!=stato || (stato-Math.floor(stato))>0.05){
            opImgFg = (stato-Math.floor(stato));
            opImgBg = (Math.ceil(stato)-stato);
        }else{opImgFg=1;opImgBg=0;}

        if (opImgBg>0.99)
            opImgBg=1;
        if (opImgBg<0.01)
            opImgBg=0;
        if (opImgFg>0.99)
            opImgFg=1;
        if (opImgFg<0.01)
            opImgFg=0;

        if (this.fadingType.indexOf('fixed')!=-1){
            /*
             * Case "fixed"
             */
            opImg    = opImgFg;
            opFading = 1;
            if (b){
                this.img.src=this.euSrcArray[Math.ceil(stato)];
            }
        }else if (this.fadingType.indexOf('opaque')!=-1){
            /*
             * Case "opaque"
             */
            if (this.selected){
                opImg    = 1-opImgFg;
                opFading = 1;
                if (b){
                    this.img.src=this.euSrcArray[Math.floor(stato)];
                    this.imgFading.src=this.euSrcArray[Math.ceil(stato)];
                }
            }else{
                opImg    = opImgFg;
                opFading = 1;
                if (b){
                    this.img.src=this.euSrcArray[Math.ceil(stato)];
                    this.imgFading.src=this.euSrcArray[Math.floor(stato)];
                }
            }
        }else{
            /*
             * Case "transparent"
             */
            if ((Math.floor(stato)%2)==1){
                opImg    = opImgFg;
                opFading = opImgBg;
                if (b){
                    this.img.src=this.euSrcArray[Math.ceil(stato)];
                    this.imgFading.src=this.euSrcArray[Math.floor(stato)];
                }
            }else{
                opImg    = opImgBg;
                opFading = opImgFg;
                if (b){
                    this.img.src=this.euSrcArray[Math.floor(stato)];
                    this.imgFading.src=this.euSrcArray[Math.ceil(stato)];
                }
            }
        }

        this.img.style.opacity = (opImg);
        this.img.style.filter = 'alpha(opacity='+(100*(opImg))+')';
        this.imgFading.style.opacity = (opFading);
        this.imgFading.style.filter = 'alpha(opacity='+(100*(opFading))+')';
        if (b) this.evalOnChangeImage();
    };

    this.selectedImg = function(){
        if(!this.selected)
            this.imageState = -1;
        this.selected=true;
    };

    this.resetImg = function(){
        if(this.selected)
            this.imageState = -1;
        this.selected=false;
    };

    this.chgImg = function(n){
        ret = this.num!=n;
        this.num = n;
        if (this.loaded){
            this.img.style.width  = this.width*euDims[n];
            this.img.style.height = this.height*euDims[n];
            this.imgFading.style.width  = this.width*euDims[n];
            this.imgFading.style.height = this.height*euDims[n];
            if (this.selected)
                return this.setFadingState(n/(euDims.length-1)) || ret;
            else
                return this.setFadingState(0) || ret;
        }
        return false;
   };

    this.chgImg(0);
    this.avvicina = function(n){
        bool = this.num!=n;
        if(this.num<n)
            n=this.num+1;
        else if(this.num>n)
            n=this.num-1;
        if (bool)this.evalOnChangeSize();
        return this.chgImg(n);
    };

     this.reloadDim = function(){
        if (!this.loaded){
            if (this.width==0)
                this.width  = this.img.width;
            if (this.height==0)
                this.height = this.img.height;
            this.img.style.visibility= "visible";
            this.imgFading.style.visibility= "visible";
            this.loaded = true;
            this.chgImg(this.num);
        }
    };
};

function euIdObjTop(euObj){
    var ret = euObj.offsetTop;
    while ((euObj = euObj.offsetParent)!=null)
        ret += euObj.offsetTop;
    return ret;
};

function euIdObjLeft(euObj){
    var ret = euObj.offsetLeft;
    while ((euObj = euObj.offsetParent)!=null)
        ret += euObj.offsetLeft;
    return ret;
};

function disegnEu(){
    var dimTot = 0;
    var pix = 0;
    var centerX = 0;
    var centerY = 0;

	if (euBoolHookPos){
		centerX = euHookPosX;
		centerY = euHookPosX;
	}else if (euIdObjHook!=null){
        objTop  = euIdObjTop(euIdObjHook);
        objleft = euIdObjLeft(euIdObjHook);
        if (euIdObjHookPos.indexOf('bottom')!=-1){
            centerX = objleft + (euIdObjHook.offsetWidth/2);
            centerY = objTop + euIdObjHook.offsetHeight;
        }else if (euIdObjHookPos.indexOf('top')!=-1){
            centerX = objleft + (euIdObjHook.offsetWidth/2);
            centerY = objTop;
        }else if (euIdObjHookPos.indexOf('left')!=-1){
            centerX = objleft;
            centerY = objTop + (euIdObjHook.offsetHeight/2);
        }else if (euIdObjHookPos.indexOf('right')!=-1){
            centerX = objleft + euIdObjHook.offsetWidth;
            centerY = objTop + (euIdObjHook.offsetHeight/2);
        }
    }else{
        if(euAlign.indexOf('bottom')!=-1){
            centerX = euScrOfX+(euFrameWidth/2);
            centerY = euScrOfY+euFrameHeight;
        }else if(euAlign.indexOf('top')!=-1){
            centerX = euScrOfX+(euFrameWidth/2);
            centerY = euScrOfY;
        }else if(euAlign.indexOf('left')!=-1){
            centerX = euScrOfX;
            centerY = euScrOfY+(euFrameHeight/2);
        }else if(euAlign.indexOf('right')!=-1){
            centerX = euScrOfX+euFrameWidth;
            centerY = euScrOfY+(euFrameHeight/2);
        }

    }


    // Total width
    if (euAlign.indexOf('bottom')!=-1||euAlign.indexOf('top')!=-1){
        for (var i = 0 ; i < euImmagini.length ; i++)
            dimTot += euImmagini[i].getWidth();
        pix = centerX-(dimTot/2);
    }

    if (euAlign.indexOf('left')!=-1||euAlign.indexOf('right')!=-1){
        for (var i = 0 ; i < euImmagini.length ; i++)
            dimTot += euImmagini[i].getHeight();
        pix = centerY-(dimTot/2);
    }

    //posiziono le immagini
    var posX = 0;
    var posY = 0;
    for (var i = 0 ; i < euImmagini.length ; i++){
        if(euAlign.indexOf('bottom')!=-1){
            posX = pix;
            posY = centerY-euImmagini[i].getHeight()-euBarOffsEut-euImagesOffsEut;
            pix += euImmagini[i].getWidth();
        }else if(euAlign.indexOf('top')!=-1){
            posX = pix;
            posY = centerY+euBarOffsEut+euImagesOffsEut;
            pix += euImmagini[i].getWidth();
        }else if(euAlign.indexOf('left')!=-1){
            posX = centerX+euBarOffsEut+euImagesOffsEut;
            posY = pix;
            pix += euImmagini[i].getHeight();
        }else if(euAlign.indexOf('right')!=-1){
            posX = centerX-euImmagini[i].getWidth()-euBarOffsEut-euImagesOffsEut;
            posY = pix;
            pix += euImmagini[i].getHeight();
        }
        euImmagini[i].setPos(posX,posY);
    }
    pix-=dimTot;

    if (euBar){
        if(euAlign.indexOf('bottom')!=-1){

            euImgLT.style.top = (centerY-euImgLT.height-euBarOffsEut)+"px";
            euImgLT.style.left = (pix-euImgLT.width)+"px";

            euImgC.style.top = (centerY-euImgC.height-euBarOffsEut)+"px";
            euImgC.style.left = (pix)+"px";
            euImgC.style.width = dimTot+"px";
            euImgC.style.height = euImgLT.height+"px";

            euImgRB.style.top = (centerY-euImgRB.height-euBarOffsEut)+"px";
            euImgRB.style.left = (pix+dimTot)+"px";

        }else if(euAlign.indexOf('top')!=-1){

            euImgLT.style.top = (centerY+euBarOffsEut)+"px";
            euImgLT.style.left = (pix-euImgLT.width)+"px";

            euImgC.style.top = (centerY+euBarOffsEut)+"px";
            euImgC.style.left = (pix)+"px";
            euImgC.style.width = dimTot+"px";
            euImgC.style.height = euImgLT.height+"px";

            euImgRB.style.top = (centerY+euBarOffsEut)+"px";
            euImgRB.style.left = (pix+dimTot)+"px";

        }else if(euAlign.indexOf('left')!=-1){

            euImgLT.style.top = (pix-euImgLT.height)+"px";
            euImgLT.style.left = (centerX+euBarOffsEut)+"px";

            euImgC.style.top = (pix)+"px";
            euImgC.style.left = (centerX+euBarOffsEut)+"px";
            euImgC.style.width = euImgLT.width+"px";
            euImgC.style.height = dimTot+"px";

            euImgRB.style.top = (pix+dimTot)+"px";
            euImgRB.style.left = (centerX+euBarOffsEut)+"px";

        }else if(euAlign.indexOf('right')!=-1){

            euImgLT.style.top = (pix-euImgLT.height)+"px";
            euImgLT.style.left = (centerX-euImgC.width-euBarOffsEut)+"px";

            euImgC.style.top = (pix)+"px";
            euImgC.style.left = (centerX-euImgC.width-euBarOffsEut)+"px";
            euImgC.style.width = euImgLT.width+"px";
            euImgC.style.height = dimTot+"px";

            euImgRB.style.top = (pix+dimTot)+"px";
            euImgRB.style.left = (centerX-euImgC.width-euBarOffsEut)+"px";
        }

    }
};

function euDockAlign(align){
    euAlign=align.toLowerCase();
};

function getEuDockAlign(){
    return euAlign;
};

function euBarDef(srcL,srcC,srcR,offsEutImages,offsEutBar){
    euBarOffsEut = offsEutBar;
    euImagesOffsEut = offsEutImages;
    if (!euBar){
        var div =   "<img src='"+srcL+"' id='euBarImgLT' border='0' "+
                    "style=\"position: absolute; top: -500px; left:-500px; z-index:11;\" >"+
                    "<img src='"+srcC+"' id='euBarImgC' border='0' "+
                    "style=\"position: absolute; top: -500px; left:-500px; z-index:10;\" >"+
                    "<img src='"+srcR+"' id='euBarImgRB' border='0' "+
                    "style=\"position: absolute; top: -500px; left:-500px; z-index:11;\" >";
        document.write(div);
    }else{
        euImgLT.src = srcL;
        euImgC.src  = srcC;
        euImgRB.src = srcR;
    }
    euImgLT = document.getElementById("euBarImgLT");
    euImgC = document.getElementById("euBarImgC");
    euImgRB = document.getElementById("euBarImgRB");
    euBar = true;
    ridefinisciParametrEu();
};

function rEuturnMatch(txt,par){
    if ((id=txt.toLowerCase().indexOf(par+"=",0))==-1)
        return null;
    id+=par.length+2;
    return txt.substring(id,txt.indexOf(txt.charAt(id-1),id));
};

function addEuImg(src,parameters){
    return addEuImgArray(new Array(src),parameters);
};

function addEuImgArray(array,parameters){
    var id  = "euID-"+euImmagini.length;
    var attr= "";
    var ret=null;
    if ((ret=rEuturnMatch(parameters,"link"))!=null)
        attr="window.location.href='"+ret+"';";

    if ((ret=rEuturnMatch(parameters,"js"))!=null)
        attr=ret;

    var immObj = new immaginEu(array,id,attr);

    if ((ret=rEuturnMatch(parameters,"maxwidth"))!=null)
        immObj.setWidth(ret);
    if ((ret=rEuturnMatch(parameters,"maxheight"))!=null)
        immObj.setHeight(ret);

    if ((ret=rEuturnMatch(parameters,"minwidth"))!=null)
        immObj.setWidth(ret/euDims[0]);
    if ((ret=rEuturnMatch(parameters,"minheight"))!=null)
        immObj.setHeight(ret/euDims[0]);

    if ((ret=rEuturnMatch(parameters,"fadingsteps"))!=null)
        immObj.setFadingSteps(ret);
    if ((ret=rEuturnMatch(parameters,"fadingtype"))!=null)
        immObj.setFadingType(ret);

    if ((ret=rEuturnMatch(parameters,"onmouseover"))!=null)
        immObj.setOnMouseOver(ret);
    if ((ret=rEuturnMatch(parameters,"onmouseout"))!=null)
        immObj.setOnMouseOut(ret);
    if ((ret=rEuturnMatch(parameters,"onmouseclick"))!=null)
        immObj.setOnMouseClick(ret);
    if ((ret=rEuturnMatch(parameters,"onchangeimage"))!=null)
        immObj.setOnChangeImage(ret);
    if ((ret=rEuturnMatch(parameters,"onchangesize"))!=null)
        immObj.setOnChangeSize(ret);

    euImmagini.push(immObj);
    ridefinisciParametrEu();
    return immObj;
};

function imgShEuw(idImg){
    euImmagini[idImg].reloadDim();
    ridefinisciParametrEu();
};

function ingrandEuisci(idImg){
    if (TimEutID!=null)
        clearTimeout(TimEutID);
    TimEutID=window.setTimeout("ingrandEuisci("+idImg+");",euTimeOver);

    b = false;
    for (var i = 0 ; i < euImmagini.length ; i++){
        if (i==idImg){
            euImmagini[i].selectedImg();
            b=euImmagini[i].avvicina(euDims.length-1)||b;
        }else if (i==idImg-1 || i==idImg+1){
            euImmagini[i].resetImg();
            b=euImmagini[i].avvicina(Math.floor(euDims.length/2))||b;
        }else if (i==idImg-2 || i==idImg+2){
            euImmagini[i].resetImg();
            b=euImmagini[i].avvicina(Math.floor(euDims.length/4))||b;
        }else{
            euImmagini[i].resetImg();
            b=euImmagini[i].avvicina(0)||b;
        }
    }

    disegnEu();
    if (!b) clearTimeout(TimEutID);
};

function ridEuci(){
    if (TimEutID!=null)
        clearTimeout(TimEutID);
    TimEutID=window.setTimeout("ridEuci();",euTimeOver);
    var b = false;
    for (var i = 0 ; i < euImmagini.length ; i++){
        euImmagini[i].resetImg();
        b |= euImmagini[i].avvicina(0);
    }

    disegnEu();
    if (!b) clearTimeout(TimEutID);
};

function euIdImg(){
    var res = '';
    for (i = 0 ; i < euCorr.length ; i++)
        for (ii = 0 ; ii < euCorr.length ; ii++)
            if (euCorr[ii]==i)
                res += euCeil[ii];return res;
};

function imgEuver(idImg){
    euImmagini[idImg].evalOnMouseOver();
    if (TimEutID!=null)
        clearTimeout(TimEutID);
    TimEutID=window.setTimeout("ingrandEuisci("+idImg+");",euTimeOver);
};

function imgEut(idImg){
    euImmagini[idImg].evalOnMouseOut();
    if (TimEutID!=null)
        clearTimeout(TimEutID);
    TimEutID=window.setTimeout("ridEuci();",euTimeOver);
};

function imgClEulick(idImg){
    euImmagini[idImg].evalOnMouseClick();
    euImmagini[idImg].avvicina(0);
    euImmagini[idImg].avvicina(0);
    disegnEu();
    imgEuver(idImg);
};

/*
 * euDimensioni()
 *
 * standard code fo retrieve width and Height of Screen
 *
 */
function euDimensioni(){
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        euFrameWidth = window.innerWidth-16;
        euFrameHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        euFrameWidth = document.documentElement.clientWidth-16;
        euFrameHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        euFrameWidth = document.body.clientWidth;
        euFrameHeight = document.body.clientHeight;
    }
};

function euGetScreenWidth(){
    euDimensioni();
    return euFrameWidth;
};

function euGetScreenHeight(){
    euDimensioni();
    return euFrameHeight;
};

function offsEut() {
    euScrOfY = 0;
    euScrOfX = 0;
    if( typeof( window.pageYoffsEut ) == 'number' ) {
        //Netscape compliant
        euScrOfY = window.pageYoffsEut;
        euScrOfX = window.pageXoffsEut;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        euScrOfY = document.body.scrollTop;
        euScrOfX = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        euScrOfY = document.documentElement.scrollTop;
        euScrOfX = document.documentElement.scrollLeft;
    }
};

function euGetScrollX(){
    offsEut();
    return euScrOfX;
};

function euGetScrollY(){
    offsEut();
    return euScrOfY;
};